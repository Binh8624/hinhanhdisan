import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import dns from 'node:dns/promises';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase projectId solely for non-sensitive health check status
let firebaseProjectId = '';
try {
  const cfgPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(cfgPath)) {
    const rawCfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8')) as { projectId?: string };
    firebaseProjectId = rawCfg.projectId ?? '';
  }
} catch {
  firebaseProjectId = '';
}

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function isPrivateOrReservedIp(ip: string): boolean {
  const normalized = ip.replace(/^::ffff:/i, '');
  const version = net.isIP(normalized);
  if (version === 4) {
    const parts = normalized.split('.').map(Number);
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
      return true;
    }
    const [a, b] = parts;
    if (a === 0) return true; // 0.0.0.0/8
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    if (a === 127) return true; // loopback 127.0.0.0/8
    if (a === 169 && b === 254) return true; // link-local / cloud metadata 169.254.0.0/16
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a >= 224) return true; // multicast & reserved
    return false;
  }
  if (version === 6) {
    const lower = normalized.toLowerCase();
    if (
      lower === '::' ||
      lower === '::1' ||
      lower.startsWith('fe80:') ||
      lower.startsWith('fc') ||
      lower.startsWith('fd') ||
      lower.startsWith('ff')
    ) {
      return true;
    }
    return false;
  }
  return true;
}

async function validateSafeExternalUrl(rawUrl: string): Promise<URL | null> {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    if (parsed.username || parsed.password) {
      return null;
    }
    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (
      !host ||
      host === 'localhost' ||
      host === 'metadata.google.internal' ||
      host.endsWith('.local') ||
      host.endsWith('.internal') ||
      host.endsWith('.localhost')
    ) {
      return null;
    }
    if (net.isIP(host)) {
      return isPrivateOrReservedIp(host) ? null : parsed;
    }
    const resolved = await dns.lookup(host, { all: true });
    if (!resolved.length) return null;
    for (const entry of resolved) {
      if (isPrivateOrReservedIp(entry.address)) {
        return null;
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

async function fetchSafelyWithManualRedirects(
  initialUrl: URL,
  method: 'HEAD' | 'GET',
  signal: AbortSignal
): Promise<globalThis.Response> {
  let currentUrl = initialUrl;
  for (let hop = 0; hop <= 3; hop += 1) {
    const response = await fetch(currentUrl.toString(), {
      method,
      redirect: 'manual',
      signal,
      headers: { 'User-Agent': 'DiSanSo-SourceChecker/1.0' },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return response;
      const nextRaw = new URL(location, currentUrl).toString();
      const safeNext = await validateSafeExternalUrl(nextRaw);
      if (!safeNext) {
        throw new Error('Chuyển hướng tới địa chỉ nội bộ hoặc không hợp lệ bị chặn.');
      }
      currentUrl = safeNext;
      continue;
    }
    return response;
  }
  throw new Error('Quá nhiều lượt chuyển hướng HTTP.');
}

// Sliding-window rate limiter per client IP
function createRateLimiter(maxRequests: number, windowMs: number) {
  const buckets = new Map<string, number[]>();
  return (req: Request, res: Response, next: NextFunction) => {
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]) ||
      req.ip ||
      'unknown';
    const ip = rawIp.trim();
    const now = Date.now();
    const recent = (buckets.get(ip) ?? []).filter((ts) => now - ts < windowMs);
    if (recent.length >= maxRequests) {
      res.status(429).json({
        ok: false,
        error: 'Quá nhiều yêu cầu từ địa chỉ này trong thời gian ngắn. Vui lòng thử lại sau 1 phút.',
      });
      return;
    }
    recent.push(now);
    buckets.set(ip, recent);
    if (buckets.size > 1000) {
      for (const [k, v] of buckets.entries()) {
        const filtered = v.filter((ts) => now - ts < windowMs);
        if (filtered.length === 0) buckets.delete(k);
        else buckets.set(k, filtered);
      }
    }
    next();
  };
}

const ALLOWED_ATTACHMENT_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const MIME_TO_EXTENSIONS: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

const FORBIDDEN_EXTENSIONS = [
  '.exe', '.dll', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js', '.mjs', '.cjs',
  '.ts', '.php', '.py', '.rb', '.pl', '.html', '.htm', '.svg', '.msi', '.apk', '.jar',
];

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024; // 5 MB

async function createServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '1mb' }));

  const sourceCheckLimiter = createRateLimiter(20, 60_000);
  const complaintValidateLimiter = createRateLimiter(15, 60_000);
  const geminiLimiter = createRateLimiter(12, 60_000);

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      publicMode: true,
      geminiConfigured: Boolean(
        process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'
      ),
      firebaseProjectConfigured: Boolean(firebaseProjectId),
      timestamp: new Date().toISOString(),
    });
  });

  // Real HTTP accessibility check for official reference sources (with DNS+CIDR SSRF guard)
  app.post('/api/sources/check', sourceCheckLimiter, async (req: Request, res: Response) => {
    const { url } = req.body as { url?: string };
    if (!url || typeof url !== 'string') {
      res.status(400).json({
        ok: false,
        linkStatus: 'Không truy cập được',
        message: 'Thiếu đường dẫn URL để kiểm tra.',
      });
      return;
    }

    const safeUrl = await validateSafeExternalUrl(url.trim());
    if (!safeUrl) {
      res.status(400).json({
        ok: false,
        linkStatus: 'Không truy cập được',
        message: 'Đường dẫn không hợp lệ hoặc thuộc vùng mạng nội bộ bị chặn bảo mật.',
      });
      return;
    }

    const startedAt = Date.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7500);
      let response: globalThis.Response;
      try {
        response = await fetchSafelyWithManualRedirects(safeUrl, 'HEAD', controller.signal);
        if (response.status === 405 || response.status === 403) {
          response = await fetchSafelyWithManualRedirects(safeUrl, 'GET', controller.signal);
        }
      } finally {
        clearTimeout(timer);
      }

      const latencyMs = Date.now() - startedAt;
      const accessible = response.status >= 200 && response.status < 400;
      res.json({
        ok: accessible,
        httpStatus: response.status,
        latencyMs,
        linkStatus: accessible ? 'Hoạt động' : 'Không truy cập được',
        checkedAt: new Date().toISOString(),
      });
    } catch (err) {
      res.json({
        ok: false,
        httpStatus: null,
        latencyMs: Date.now() - startedAt,
        linkStatus: 'Không truy cập được',
        message:
          err instanceof Error && err.name === 'AbortError'
            ? 'Hết thời gian chờ kết nối tới máy chủ nguồn.'
            : 'Không thể thiết lập kết nối an toàn tới máy chủ nguồn.',
        checkedAt: new Date().toISOString(),
      });
    }
  });

  // Strict attachment metadata validator for public complaint/takedown form
  app.post(
    '/api/complaints/validate-attachment',
    complaintValidateLimiter,
    (req: Request, res: Response) => {
      const { fileName, mimeType, sizeBytes } = req.body as {
        fileName?: unknown;
        mimeType?: unknown;
        sizeBytes?: unknown;
      };

      if (typeof fileName !== 'string' || !fileName.trim() || fileName.length > 180) {
        res.status(400).json({
          valid: false,
          message: 'Tên tệp đính kèm không hợp lệ hoặc vượt quá 180 ký tự.',
        });
        return;
      }

      if (typeof mimeType !== 'string' || !ALLOWED_ATTACHMENT_MIME.has(mimeType)) {
        res.status(400).json({
          valid: false,
          message: 'Định dạng tệp không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP hoặc PDF.',
        });
        return;
      }

      if (
        typeof sizeBytes !== 'number' ||
        !Number.isFinite(sizeBytes) ||
        sizeBytes <= 0 ||
        sizeBytes > MAX_ATTACHMENT_BYTES
      ) {
        res.status(400).json({
          valid: false,
          message: 'Dung lượng tệp phải lớn hơn 0 và không vượt quá 5 MB.',
        });
        return;
      }

      const lowerName = fileName.trim().toLowerCase();
      if (lowerName.includes('..') || lowerName.includes('/') || lowerName.includes('\\')) {
        res.status(400).json({
          valid: false,
          message: 'Tên tệp chứa ký tự đường dẫn không hợp lệ.',
        });
        return;
      }

      if (FORBIDDEN_EXTENSIONS.some((ext) => lowerName.includes(ext))) {
        res.status(400).json({
          valid: false,
          message: 'Tên tệp chứa phần mở rộng thực thi hoặc kịch bản bị cấm.',
        });
        return;
      }

      const allowedExts = MIME_TO_EXTENSIONS[mimeType] ?? [];
      if (!allowedExts.some((ext) => lowerName.endsWith(ext))) {
        res.status(400).json({
          valid: false,
          message: 'Phần mở rộng của tệp không khớp với định dạng MIME đã khai báo.',
        });
        return;
      }

      res.json({
        valid: true,
        sanitizedFileName: path.basename(fileName.trim()),
        mimeType,
        sizeBytes,
        message: 'Tệp đáp ứng tiêu chuẩn an toàn đính kèm khiếu nại.',
      });
    }
  );

  // Grounded Gemini Heritage Rights & Records Assistant (Backend-only)
  app.post('/api/gemini/assist', geminiLimiter, async (req: Request, res: Response) => {
    const ai = getGenAIClient();
    if (!ai) {
      res.status(503).json({
        error: 'Dịch vụ Gemini chưa được cấu hình GEMINI_API_KEY trong phần Settings > Secrets.',
      });
      return;
    }

    const { query, mode, records, sources, consents, permissions, rightsHolders } = req.body as {
      query?: string;
      mode?: 'lookup' | 'gaps' | 'summary' | 'questions_for_holder' | 'version_diff';
      records?: Array<Record<string, unknown>>;
      sources?: Array<Record<string, unknown>>;
      consents?: Array<Record<string, unknown>>;
      permissions?: Array<Record<string, unknown>>;
      rightsHolders?: Array<Record<string, unknown>>;
    };

    if (!query || typeof query !== 'string' || !query.trim() || query.length > 1500) {
      res.status(400).json({
        error: 'Vui lòng nhập câu hỏi hợp lệ (tối đa 1500 ký tự).',
      });
      return;
    }

    const safeRecords = Array.isArray(records) ? records.slice(0, 30) : [];
    const safeSources = Array.isArray(sources) ? sources.slice(0, 30) : [];
    const safeConsents = Array.isArray(consents) ? consents.slice(0, 30) : [];
    const safePermissions = Array.isArray(permissions) ? permissions.slice(0, 30) : [];
    const safeRightsHolders = Array.isArray(rightsHolders) ? rightsHolders.slice(0, 50) : [];

    const systemInstruction = `Bạn là "TRỢ LÝ TRA CỨU QUYỀN VÀ TƯ LIỆU DI SẢN" của nền tảng phi lợi nhuận Di Sản Số (Đề tài J02).
NGUYÊN TẮC BẮT BUỘC TUYỆT ĐỐI:
1. CHỈ sử dụng dữ liệu được cung cấp trong ngữ cảnh JSON dưới đây. Tuyệt đối KHÔNG bịa đặt tên tư liệu, mã định danh, chủ sở hữu, người lưu giữ, người cho phép công bố, giấy phép, niên đại hay nguồn tham khảo.
2. Phân biệt rạch ròi thông tin ĐÃ XÁC MINH ("Đã kiểm") và CHƯA XÁC MINH ("Chưa kiểm" hoặc "Chưa đọc được").
3. Phân biệt 5 loại phiên bản: Bản gốc, Bản sao, Bản số hóa, Ảnh chụp, Tư liệu phái sinh (và cách viết cũ Bản số của bản gốc / Bản số của bản sao nếu có trong hồ sơ).
4. Không tự kết luận quyền sở hữu pháp lý, không tự cấp phép, không tự suy đoán người lưu giữ, không tự khẳng định được phép công bố nếu không có căn cứ rõ ràng trong dữ liệu.
5. Nếu câu hỏi liên quan đến một tư liệu hoặc tình huống mà dữ liệu hiện có không đủ căn cứ để kết luận quyền hoặc thiếu người cho phép/bằng chứng, trường "answer" PHẢI chứa nguyên văn câu:
   "Dữ liệu hiện có chưa đủ căn cứ để đưa ra kết luận. Vui lòng kiểm tra hồ sơ tư liệu, bằng chứng về quyền và liên hệ chủ thể có liên quan."
6. Nếu người dùng hỏi về một tư liệu, nhân vật, địa danh hoặc sự kiện hoàn toàn KHÔNG CÓ trong dữ liệu được cung cấp (ngoại trừ câu hỏi kiến thức chung về sự khác nhau giữa bản gốc, bản sao, bản số hoặc quy trình xin phép), trường "answer" PHẢI trả lời nguyên văn:
   "Hiện hệ thống chưa có tư liệu xác minh cho nội dung này."
7. Mọi đề xuất do AI tổng hợp (như gợi ý trường thiếu, câu hỏi cần hỏi người lưu giữ) PHẢI gắn rõ nhãn "NỘI DUNG AI ĐỀ XUẤT – CHƯA XÁC MINH".
8. Luôn trả lời bằng tiếng Việt có dấu chuẩn xác, trang trọng theo văn phong bảo tàng số.`;

    const contextPayload = JSON.stringify({
      mode: mode ?? 'lookup',
      recordCount: safeRecords.length,
      records: safeRecords,
      sources: safeSources,
      consents: safeConsents,
      permissions: safePermissions,
      rightsHolders: safeRightsHolders,
    });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `DỮ LIỆU HỆ THỐNG HIỆN TẠI (NGUỒN DUY NHẤT ĐỂ ĐỐI CHIẾU):\n${contextPayload}\n\nCÂU HỎI / YÊU CẦU CỦA NGƯỜI DÙNG (Chế độ: ${mode ?? 'lookup'}):\n${query.trim()}`,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description:
                  'Nội dung trả lời chi tiết dựa trên dữ liệu đã nạp, phân biệt thông tin đã xác minh và chưa xác minh.',
              },
              relatedRecordCodes: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Danh sách mã định danh tư liệu liên quan (hoặc ["KHÔNG CÓ TRONG CSDL"] nếu không có).',
              },
              custodyLocation: {
                type: Type.STRING,
                description: 'Nơi lưu giữ theo hồ sơ, hoặc "CHƯA CÓ DỮ LIỆU".',
              },
              versionType: {
                type: Type.STRING,
                description: 'Loại bản, hoặc "CHƯA XÁC ĐỊNH".',
              },
              rightsStatus: {
                type: Type.STRING,
                description: 'Trạng thái quyền theo hồ sơ, hoặc "CHƯA ĐỦ CƠ SỞ KẾT LUẬN".',
              },
              sources: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Danh sách nguồn tham khảo có trong hệ thống.',
              },
              missingInfo: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Các trường thông tin hoặc bằng chứng còn thiếu cần bổ sung.',
              },
              aiAdvisoryTag: {
                type: Type.STRING,
                description: 'Nhãn cảnh báo: luôn là "NỘI DUNG AI ĐỀ XUẤT – CHƯA XÁC MINH".',
              },
            },
            required: [
              'answer',
              'relatedRecordCodes',
              'custodyLocation',
              'versionType',
              'rightsStatus',
              'sources',
              'missingInfo',
              'aiAdvisoryTag',
            ],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      res.json({
        ...parsed,
        aiAdvisoryTag: 'NỘI DUNG AI ĐỀ XUẤT – CHƯA XÁC MINH',
        modelUsed: 'gemini-4-hydrogen',
      });
    } catch {
      res.status(502).json({
        error: 'Không thể kết nối hoặc nhận phản hồi hợp lệ từ dịch vụ trợ lý tra cứu.',
      });
    }
  });

  // Vite dev middleware or static dist serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*path}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Di San So server listening on port ${port}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

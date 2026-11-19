import React, { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';

interface GeminiAssistantPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

type AssistMode =
  | 'lookup'
  | 'gaps'
  | 'summary'
  | 'questions_for_holder'
  | 'version_diff';

interface GeminiStructuredReply {
  answer: string;
  relatedRecordCodes: string[];
  custodyLocation: string;
  versionType: string;
  rightsStatus: string;
  sources: string[];
  missingInfo: string[];
  aiAdvisoryTag: string;
  modelUsed?: string;
}

export function GeminiAssistantPage({ onNavigate }: GeminiAssistantPageProps) {
  const { records, sources, consentRecords, permissions, rightsHolders } =
    useHeritage();

  const [mode, setMode] = useState<AssistMode>('lookup');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reply, setReply] = useState<GeminiStructuredReply | null>(null);

  const handleAskGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const sanitizedRecords = records.map((r) => ({
        id: r.id,
        dcIdentifier: r.dcIdentifier,
        dcTitle: r.dcTitle,
        dcType: r.dcType,
        dcDate: r.dcDate,
        dcSource: r.dcSource,
        currentCustodyLocation: r.currentCustodyLocation,
        displayedVersionType: r.displayedVersionType,
        originalCondition: r.originalCondition,
        publicationAuthorizer: r.publicationAuthorizer,
        allowedScope: r.allowedScope,
        rightsStatus: r.rightsStatus,
        verificationLevel: r.verificationLevel,
        uncertainPoints: r.uncertainPoints,
        canDisplayImage: r.canDisplayImage,
        canDownload: r.canDownload,
        sourceReferenceIds: r.sourceReferenceIds,
      }));

      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          mode,
          records: sanitizedRecords,
          sources: sources.map((s) => ({
            id: s.id,
            name: s.name,
            organizationOrAuthor: s.organizationOrAuthor,
            sourceType: s.sourceType,
            url: s.url,
          })),
          consents: consentRecords.map((c) => ({
            id: c.id,
            recordIds: c.recordIds,
            consenterName: c.consenterName,
            consenterRole: c.consenterRole,
            effectiveStatus: c.effectiveStatus,
            allowedScopes: c.allowedScopes,
          })),
          permissions,
          rightsHolders: rightsHolders.map((rh) => ({
            recordId: rh.recordId,
            subjectName: rh.subjectName,
            roleType: rh.roleType,
            verificationStatus: rh.verificationStatus,
          })),
        }),
      });

      const data = (await res.json()) as GeminiStructuredReply & { error?: string };
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Không thể nhận phản hồi từ trợ lý AI.');
        setReply(null);
      } else {
        setReply(data);
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Lỗi kết nối tới máy chủ tra cứu AI.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-5">
          <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
            GIAO DIỆN TRA CỨU HỌC THUẬT · BACKEND PROXY
          </p>
          <h1
            className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-4xl"
            style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
          >
            Trợ lý Tra cứu Quyền &amp; Tư liệu
          </h1>
          <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
            Truy xuất có kiểm soát từ {records.length} hồ sơ tư liệu và {sources.length} nguồn đối chiếu đã lưu trên hệ thống. Tuyệt đối không tạo giấy phép giả, không suy đoán quyền sử dụng.
          </p>
        </div>
      </header>

      {/* Scholarly Research Console */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Query Parameters */}
        <aside className="lg:col-span-5 space-y-7">
          <div className="border-y border-[#781F25]/35 py-4 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-4 h-4 text-[#781F25] shrink-0 mt-0.5" />
            <p className="text-[#57524A] leading-relaxed">
              Mọi phản hồi đều gắn nhãn{' '}
              <strong className="text-[#781F25]">“NỘI DUNG AI ĐỀ XUẤT – CHƯA XÁC MINH”</strong>. AI không thể chỉnh sửa hồ sơ hay phê duyệt quyền công bố.
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#57524A]">
              Chế độ đối chiếu dữ liệu
            </p>
            <div className="divide-y divide-[#201F1C]/10 border-t border-b border-[#201F1C]/12 text-xs">
              {[
                { id: 'lookup', label: '01. Tra cứu hồ sơ & quyền' },
                { id: 'gaps', label: '02. Phân tích trường còn thiếu' },
                { id: 'summary', label: '03. Tóm tắt hồ sơ tư liệu' },
                { id: 'questions_for_holder', label: '04. Câu hỏi phỏng vấn người lưu giữ' },
                { id: 'version_diff', label: '05. Giải thích Bản gốc – Bản sao – Bản số' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as AssistMode)}
                  className={`w-full text-left py-3 transition-colors flex items-center justify-between ${
                    mode === m.id
                      ? 'text-[#781F25] font-semibold'
                      : 'text-[#201F1C] hover:text-[#781F25]'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className="font-mono-tabular text-[10px]">
                    {mode === m.id ? '● ĐANG CHỌN' : '→'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAskGemini} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#201F1C] mb-1">
                Câu hỏi hoặc mã định danh tư liệu *
              </label>
              <textarea
                rows={4}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ví dụ: Hồ sơ nào hiện chưa đủ bằng chứng công bố hình ảnh?"
                className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-sm text-[#201F1C] focus:outline-none focus:border-[#781F25]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full py-3.5 bg-[#781F25] text-[#FBFAF7] text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 hover:bg-[#5D171C] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Đang đối chiếu...' : 'Gửi truy vấn học thuật'}</span>
            </button>

            <div className="space-y-2 pt-2 text-xs">
              <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#57524A]">
                Gợi ý câu hỏi nhanh
              </p>
              <div className="flex flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuery(
                      'Hệ thống hiện có những hồ sơ tư liệu nào và hồ sơ nào đang thiếu bằng chứng quyền?'
                    )
                  }
                  className="link-editorial text-[#57524A] hover:text-[#781F25] text-left"
                >
                  • Kiểm tra tình trạng hồ sơ thiếu bằng chứng
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQuery(
                      'Giải thích sự khác nhau giữa bản gốc, bản sao, bản số của bản gốc và bản số của bản sao.'
                    )
                  }
                  className="link-editorial text-[#57524A] hover:text-[#781F25] text-left"
                >
                  • Phân biệt Bản gốc, Bản sao và Bản số hóa
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setQuery(
                      'Đề xuất bộ câu hỏi cần hỏi người đang lưu giữ gia phả dòng họ trước khi số hóa.'
                    )
                  }
                  className="link-editorial text-[#57524A] hover:text-[#781F25] text-left"
                >
                  • Bộ câu hỏi phỏng vấn người lưu giữ
                </button>
              </div>
            </div>
          </form>
        </aside>

        {/* Right Scholarly Dossier Response */}
        <section className="lg:col-span-7 bg-[#FBFAF7] border-y border-[#201F1C]/15 p-6 sm:p-10 space-y-6">
          {errorMsg && (
            <p className="text-xs sm:text-sm text-[#781F25] border-l-2 border-[#781F25] pl-4 py-1">
              {errorMsg}
            </p>
          )}

          {!reply ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#A58A61]">
                SẴN SÀNG TRUY XUẤT
              </p>
              <h2 className="font-display text-2xl font-bold text-[#201F1C]">
                Phiếu Kết quả Đối chiếu Học thuật
              </h2>
              <p className="text-xs sm:text-sm text-[#57524A] max-w-md mx-auto leading-relaxed">
                Chọn chế độ phân tích và nhập truy vấn bên trái để đối chiếu trực tiếp trên siêu dữ liệu đã lưu.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#201F1C]/12 pb-4">
                <h2 className="font-display text-2xl font-bold text-[#201F1C]">
                  Phiếu Kết quả Đối chiếu
                </h2>
                <span className="font-mono-tabular text-[11px] font-semibold text-[#781F25]">
                  {reply.aiAdvisoryTag || 'NỘI DUNG AI ĐỀ XUẤT – CHƯA XÁC MINH'}
                </span>
              </div>

              <div className="text-sm sm:text-base text-[#201F1C] leading-relaxed whitespace-pre-line editorial-measure">
                {reply.answer}
              </div>

              <dl className="grid grid-cols-1 md:grid-cols-2 border-y border-[#201F1C]/12 divide-y md:divide-y-0 md:divide-x divide-[#201F1C]/12 text-xs">
                <div className="py-4 md:pr-6">
                  <dt className="font-mono-tabular text-[10px] uppercase tracking-wider text-[#781F25]">
                    Mã tư liệu liên quan
                  </dt>
                  <dd className="font-mono-tabular text-[#201F1C] mt-1">
                    {reply.relatedRecordCodes.length > 0
                      ? reply.relatedRecordCodes.join(', ')
                      : 'KHÔNG CÓ TRONG CSDL'}
                  </dd>
                </div>
                <div className="py-4 md:pl-6">
                  <dt className="font-mono-tabular text-[10px] uppercase tracking-wider text-[#781F25]">
                    Nơi lưu giữ &amp; Quyền
                  </dt>
                  <dd className="text-[#201F1C] mt-1">
                    {reply.custodyLocation} · {reply.versionType} · {reply.rightsStatus}
                  </dd>
                </div>
              </dl>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                <div className="space-y-2">
                  <p className="font-semibold text-[#201F1C]">Nguồn tham khảo đối chiếu</p>
                  <ul className="list-disc pl-4 space-y-1 text-[#57524A]">
                    {reply.sources.length > 0 ? (
                      reply.sources.map((s) => <li key={s}>{s}</li>)
                    ) : (
                      <li>CHƯA CÓ NGUỒN ĐỐI CHIẾU</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-[#781F25]">Phần thông tin còn thiếu</p>
                  <ul className="list-disc pl-4 space-y-1 text-[#57524A]">
                    {reply.missingInfo.length > 0 ? (
                      reply.missingInfo.map((m) => <li key={m}>{m}</li>)
                    ) : (
                      <li>Không ghi nhận thiếu hụt bổ sung.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#201F1C]/12 flex justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate('/tra-cuu')}
                  className="link-editorial text-xs font-semibold text-[#781F25]"
                >
                  Đối chiếu trực tiếp trong Kho Tư liệu →
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

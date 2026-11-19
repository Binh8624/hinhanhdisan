import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Upload, Lock } from 'lucide-react';
import type {
  AppRoute,
  AttachmentMetadata,
  ComplaintRequestCategory,
} from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';

interface TakedownComplaintPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const REQUEST_CATEGORIES: Array<{
  id: ComplaintRequestCategory;
  title: string;
  desc: string;
  defaultScope: string;
}> = [
  {
    id: 'Báo cáo sử dụng hình ảnh trái phép',
    title: '01. Báo cáo sử dụng trái phép',
    desc: 'Thông báo hành vi sao chép, chỉnh sửa hoặc khai thác hình ảnh vượt phạm vi cho phép.',
    defaultScope: 'Ngừng khai thác trái phép và kiểm tra nguồn sử dụng',
  },
  {
    id: 'Yêu cầu tạm ẩn hình ảnh',
    title: '02. Yêu cầu tạm ẩn hình ảnh',
    desc: 'Đề nghị tạm ẩn hiển thị hình ảnh trong thời gian rà soát quyền hoặc bảo vệ đời tư.',
    defaultScope: 'Tạm ẩn hiển thị hình ảnh và khóa tải xuống',
  },
  {
    id: 'Yêu cầu gỡ bỏ tư liệu',
    title: '03. Gỡ bỏ / Rút lại đồng ý',
    desc: 'Chủ thể quyền hoặc đại diện gia đình/dòng họ thực hiện quyền rút lại sự đồng ý.',
    defaultScope: 'Thu hồi sự đồng ý và gỡ bỏ hình ảnh/nội dung liên quan',
  },
  {
    id: 'Yêu cầu chỉnh sửa thông tin sai lệch',
    title: '04. Đính chính thông tin sai lệch',
    desc: 'Đề nghị đính chính sai sót về tác giả, nơi lưu giữ, niên đại, loại bản hoặc nguồn gốc.',
    defaultScope: 'Cập nhật, đính chính siêu dữ liệu hồ sơ theo nguồn đối chiếu',
  },
];

export function TakedownComplaintPage({ onNavigate }: TakedownComplaintPageProps) {
  const { records, submitTakedownRequest } = useHeritage();

  const [requestCategory, setRequestCategory] = useState<ComplaintRequestCategory>(
    'Yêu cầu tạm ẩn hình ảnh'
  );
  const [requesterName, setRequesterName] = useState('');
  const [requesterRole, setRequesterRole] = useState(
    'Chủ sở hữu hiện vật / Đại diện gia đình – dòng họ'
  );
  const [contactInfo, setContactInfo] = useState('');
  const [recordIdentifier, setRecordIdentifier] = useState('');
  const [affectedScope, setAffectedScope] = useState(
    'Tạm ẩn hiển thị hình ảnh và khóa tải xuống'
  );
  const [rightsBasisDescription, setRightsBasisDescription] = useState('');
  const [supportingUrl, setSupportingUrl] = useState('');
  const [reason, setReason] = useState('');

  const [attachmentMeta, setAttachmentMeta] = useState<AttachmentMetadata | undefined>(undefined);
  const [attachmentStatus, setAttachmentStatus] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);
  const [validatingFile, setValidatingFile] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const handleSelectCategory = (cat: (typeof REQUEST_CATEGORIES)[number]) => {
    setRequestCategory(cat.id);
    setAffectedScope(cat.defaultScope);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAttachmentMeta(undefined);
    setAttachmentStatus(null);
    if (!file) return;

    setValidatingFile(true);
    try {
      const res = await fetch('/api/complaints/validate-attachment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      });
      const data = (await res.json()) as {
        valid?: boolean;
        sanitizedFileName?: string;
        mimeType?: string;
        sizeBytes?: number;
        message?: string;
      };

      if (!res.ok || !data.valid) {
        setAttachmentStatus({
          ok: false,
          msg: data.message || 'Tệp không hợp lệ.',
        });
        e.target.value = '';
        return;
      }

      setAttachmentMeta({
        fileName: data.sanitizedFileName ?? file.name,
        mimeType: data.mimeType ?? file.type,
        sizeBytes: data.sizeBytes ?? file.size,
      });
      setAttachmentStatus({
        ok: true,
        msg: `Đã kiểm tra tệp an toàn: ${data.sanitizedFileName} (${Math.round((data.sizeBytes ?? file.size) / 1024)} KB). Tệp chỉ dùng làm thông tin đối chiếu, không hiển thị công khai.`,
      });
    } catch {
      setAttachmentStatus({
        ok: false,
        msg: 'Không thể xác thực tệp đính kèm với máy chủ.',
      });
      e.target.value = '';
    } finally {
      setValidatingFile(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (
      !requesterName.trim() ||
      !requesterRole.trim() ||
      !contactInfo.trim() ||
      !recordIdentifier.trim() ||
      reason.trim().length < 5
    ) {
      setFeedback({
        type: 'err',
        msg: 'Vui lòng điền đầy đủ họ tên, tư cách liên quan, thông tin liên hệ, mã tư liệu và lý do (tối thiểu 5 ký tự).',
      });
      return;
    }

    setSubmitting(true);
    try {
      const reqId = await submitTakedownRequest({
        requestCategory,
        requesterName: requesterName.trim(),
        requesterRole: requesterRole.trim(),
        contactInfo: contactInfo.trim(),
        recordIdentifier: recordIdentifier.trim(),
        reason: reason.trim(),
        affectedScope: affectedScope.trim(),
        rightsBasisDescription: rightsBasisDescription.trim() || undefined,
        supportingUrl: supportingUrl.trim() || undefined,
        attachmentMeta,
      });
      setRequesterName('');
      setContactInfo('');
      setReason('');
      setRightsBasisDescription('');
      setSupportingUrl('');
      setAttachmentMeta(undefined);
      setAttachmentStatus(null);
      setFeedback({
        type: 'ok',
        msg: `Đã tiếp nhận khẩn yêu cầu (${requestCategory}) với Mã phiếu: ${reqId}. Dữ liệu cá nhân của bạn được bảo vệ ở chế độ chỉ ghi và không hiển thị công khai.`,
      });
    } catch (err) {
      setFeedback({
        type: 'err',
        msg: err instanceof Error ? err.message : 'Không thể gửi yêu cầu khiếu nại / gỡ bỏ.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
              BẢO VỆ CHỦ THỂ QUYỀN &amp; DỮ LIỆU CÁ NHÂN (LUẬT 91/2025/QH15)
            </p>
            <h1
              className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-4xl"
              style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
            >
              Khiếu nại, Tạm ẩn &amp; Gỡ bỏ Tư liệu
            </h1>
            <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
              Chủ sở hữu hiện vật, đại diện gia đình/dòng họ hoặc tác giả có quyền gửi đề nghị tạm ẩn, thu hồi sự đồng ý, báo cáo sử dụng trái phép hoặc đính chính thông tin sai lệch mà không cần tài khoản.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/su-dong-y')}
            className="link-editorial text-xs font-semibold text-[#781F25] shrink-0"
          >
            Xem quy trình Sự đồng ý →
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 space-y-12">
        {/* Minimalist 4-Category Underline Selector */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-[#201F1C]/15 divide-y sm:divide-y-0 sm:divide-x divide-[#201F1C]/12">
          {REQUEST_CATEGORIES.map((cat) => {
            const active = requestCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                className={`text-left p-6 transition-colors space-y-2 border-b-2 ${
                  active
                    ? 'bg-[#FBFAF7] border-b-[#781F25]'
                    : 'bg-transparent border-b-transparent hover:bg-[#FBFAF7]/60'
                }`}
              >
                <p
                  className={`font-mono-tabular text-[10px] uppercase tracking-widest ${
                    active ? 'text-[#781F25] font-semibold' : 'text-[#57524A]'
                  }`}
                >
                  {active ? '● Đang chọn biểu mẫu' : 'Chọn loại yêu cầu'}
                </p>
                <h2 className="font-display text-base font-bold text-[#201F1C]">{cat.title}</h2>
                <p className="text-xs text-[#57524A] leading-relaxed">{cat.desc}</p>
              </button>
            );
          })}
        </section>

        {/* Privacy Notice Strip */}
        <div className="border-y border-[#781F25]/30 py-4 flex items-start gap-3.5 text-xs sm:text-sm">
          <Lock className="w-4 h-4 text-[#781F25] shrink-0 mt-1" />
          <p className="text-[#57524A] leading-relaxed">
            <strong className="text-[#201F1C]">Bảo mật thông tin người khiếu nại:</strong>{' '}
            Firestore Security Rules chặn hoàn toàn thao tác đọc hoặc liệt kê danh sách yêu cầu từ phía trình duyệt công khai. Chỉ thông tin xác nhận mã phiếu được trả về cho người gửi ngay lúc nộp.
          </p>
        </div>

        {/* Clean Intake Form */}
        <section className="bg-[#FBFAF7] border-y border-[#201F1C]/15 p-6 sm:p-10 space-y-8">
          <div className="border-b border-[#201F1C]/12 pb-4">
            <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#781F25]">
              TIẾP NHẬN YÊU CẦU CHÍNH THỨC
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C] mt-1">
              {requestCategory}
            </h2>
          </div>

          {feedback && (
            <div
              className={`py-4 px-5 border-l-2 text-xs sm:text-sm flex items-start gap-2.5 ${
                feedback.type === 'ok'
                  ? 'border-[#A58A61] bg-[#F4F1EA] text-[#201F1C]'
                  : 'border-[#781F25] bg-[#781F25]/8 text-[#781F25]'
              }`}
            >
              {feedback.type === 'ok' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#781F25] mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{feedback.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Họ tên người yêu cầu *
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={160}
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Tư cách / Vai trò đối với tư liệu *
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={160}
                  value={requesterRole}
                  onChange={(e) => setRequesterRole(e.target.value)}
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Thông tin liên hệ xác minh (Bảo mật) *
                </label>
                <input
                  type="text"
                  required
                  minLength={4}
                  maxLength={200}
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Email hoặc phương thức liên hệ"
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Mã định danh hoặc tên tư liệu liên quan *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  list="heritage-record-codes-complaint"
                  value={recordIdentifier}
                  onChange={(e) => setRecordIdentifier(e.target.value)}
                  placeholder="Ví dụ: DSS-J02-007"
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
                <datalist id="heritage-record-codes-complaint">
                  {records.map((r) => (
                    <option key={r.id} value={r.dcIdentifier}>
                      {r.dcTitle}
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Phạm vi đề nghị xử lý *
                </label>
                <input
                  type="text"
                  required
                  maxLength={300}
                  value={affectedScope}
                  onChange={(e) => setAffectedScope(e.target.value)}
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Căn cứ quyền hoặc tài liệu đối chiếu
                </label>
                <input
                  type="text"
                  maxLength={600}
                  value={rightsBasisDescription}
                  onChange={(e) => setRightsBasisDescription(e.target.value)}
                  placeholder="Ví dụ: Biên bản họ, giấy xác nhận lưu giữ..."
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Đường dẫn minh chứng (nếu có)
                </label>
                <input
                  type="url"
                  maxLength={500}
                  value={supportingUrl}
                  onChange={(e) => setSupportingUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#201F1C] mb-1">
                Chi tiết nội dung khiếu nại / lý do rút đồng ý / điểm cần đính chính *
              </label>
              <textarea
                rows={4}
                required
                minLength={5}
                maxLength={1000}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Mô tả rõ trang/ảnh nào liên quan, thông tin riêng tư nào cần ẩn hoặc điểm cần đính chính..."
                className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
              />
            </div>

            <div className="border-t border-[#201F1C]/12 pt-5 space-y-2">
              <label className="font-medium text-[#201F1C] inline-flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#781F25]" />
                <span>Kiểm tra &amp; đính kèm thông tin văn bản minh chứng (JPG, PNG, WEBP, PDF ≤ 5MB)</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => void handleFileChange(e)}
                className="block w-full text-xs text-[#57524A]"
              />
              {validatingFile && (
                <p className="text-xs text-[#57524A]">Đang kiểm tra định dạng và dung lượng tệp...</p>
              )}
              {attachmentStatus && (
                <p
                  className={`text-xs ${
                    attachmentStatus.ok ? 'text-[#201F1C] font-medium' : 'text-[#781F25] font-semibold'
                  }`}
                >
                  {attachmentStatus.msg}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || validatingFile}
              className="px-7 py-3.5 bg-[#781F25] text-[#FBFAF7] text-xs sm:text-sm font-medium inline-flex items-center gap-2 hover:bg-[#5D171C] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu khiếu nại / tạm ẩn'}</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

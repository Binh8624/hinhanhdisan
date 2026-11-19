import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';

interface UsageRequestPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const NINE_PRINCIPLES = [
  {
    num: '01',
    title: 'Xin phép gia đình đang bảo quản tư liệu',
    body: 'Xác định người trực tiếp giữ hiện vật và người đại diện hợp pháp. Trình bày rõ mục đích phi lợi nhuận và ký biên bản đồng ý ghi rõ phạm vi.',
  },
  {
    num: '02',
    title: 'Xin phép hội đồng gia tộc / dòng họ',
    body: 'Với gia phả, sắc phong chung của dòng họ, cần đồng thuận từ đại diện dòng họ và tách riêng thông tin cá nhân người còn sống.',
  },
  {
    num: '03',
    title: 'Xin phép ban quản lý di tích',
    body: 'Gửi văn bản giới thiệu trước khi chụp ảnh văn bia, sắc phong; tuân thủ nghiêm quy tắc không dùng đèn flash hoặc chạm vào hiện vật.',
  },
  {
    num: '04',
    title: 'Xin phép bảo tàng nơi trưng bày/lưu giữ',
    body: 'Việc được phép chụp lưu niệm tại phòng trưng bày không mặc nhiên cho phép đăng tải, sao chép hay in ấn công khai.',
  },
  {
    num: '05',
    title: 'Sử dụng tư liệu tại Trung tâm lưu trữ',
    body: 'Tuân thủ ký hiệu phông lưu trữ, điều kiện trích dẫn của Cục Văn thư và Lưu trữ Nhà nước hoặc thư viện công lập.',
  },
  {
    num: '06',
    title: 'Ghi nguồn và phân biệt rõ loại bản',
    body: 'Luôn ghi đủ: Tác giả, Nhan đề, Mã định danh, Loại bản (Bản gốc / Bản sao / Bản số hóa / Ảnh chụp / Phái sinh) và Nguồn lưu trữ.',
  },
  {
    num: '07',
    title: 'Ghi chú thích ngay dưới hình ảnh',
    body: 'Mỗi hình ảnh sử dụng trong phạm vi cho phép phải có chú thích liền kề: mô tả loại bản và nguồn cung cấp / chủ thể cho phép.',
  },
  {
    num: '08',
    title: 'Xin phép riêng cho tệp độ phân giải cao',
    body: 'Bản hiển thị web chỉ phục vụ đối chiếu trực tuyến. Nhu cầu sử dụng bản phân giải cao cho nghiên cứu phải nêu rõ mục đích.',
  },
  {
    num: '09',
    title: 'Ngừng khai thác khi rút lại sự đồng ý',
    body: 'Nếu chủ thể quyền thông báo rút lại đồng ý hoặc yêu cầu tạm ẩn, người sử dụng phải ngừng hiển thị và gỡ bỏ bản sao liên quan.',
  },
];

export function UsageRequestPage({ onNavigate }: UsageRequestPageProps) {
  const { records, submitUsageRequest } = useHeritage();

  const [requesterName, setRequesterName] = useState('');
  const [organization, setOrganization] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [recordIdentifier, setRecordIdentifier] = useState('');
  const [purpose, setPurpose] = useState('Nghiên cứu / Học tập phi lợi nhuận');
  const [scope, setScope] = useState('Trích dẫn hình ảnh độ phân giải web kèm chú thích nguồn');
  const [usageFormat, setUsageFormat] = useState('Báo cáo nghiên cứu / Bài viết học thuật');
  const [duration, setDuration] = useState('12 tháng');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const handleUsageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (
      !requesterName.trim() ||
      !organization.trim() ||
      !contactInfo.trim() ||
      !recordIdentifier.trim()
    ) {
      setFeedback({
        type: 'err',
        msg: 'Vui lòng điền đầy đủ họ tên, đơn vị, thông tin liên hệ và mã định danh tư liệu.',
      });
      return;
    }
    if (!pledgeAccepted) {
      setFeedback({
        type: 'err',
        msg: 'Vui lòng xác nhận cam kết sử dụng phi lợi nhuận, ghi rõ nguồn và tuân thủ phạm vi cho phép.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const reqId = await submitUsageRequest({
        requesterName: requesterName.trim(),
        organization: organization.trim(),
        contactInfo: contactInfo.trim(),
        recordIdentifier: recordIdentifier.trim(),
        purpose: purpose.trim(),
        scope: scope.trim(),
        usageFormat: usageFormat.trim(),
        duration: duration.trim(),
        pledgeAccepted: true,
        additionalNotes: additionalNotes.trim(),
      });
      setRequesterName('');
      setOrganization('');
      setContactInfo('');
      setAdditionalNotes('');
      setPledgeAccepted(false);
      setFeedback({
        type: 'ok',
        msg: `Đã tiếp nhận yêu cầu sử dụng hình ảnh (Mã phiếu: ${reqId}). Thông tin liên hệ của bạn được bảo mật ở chế độ chỉ ghi và không hiển thị công khai.`,
      });
    } catch (err) {
      setFeedback({
        type: 'err',
        msg: err instanceof Error ? err.message : 'Không thể gửi yêu cầu sử dụng.',
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
              CỔNG TIẾP NHẬN CÔNG KHAI · KHÔNG CẦN TÀI KHOẢN
            </p>
            <h1
              className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-4xl"
              style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
            >
              Yêu cầu Sử dụng Hình ảnh
            </h1>
            <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
              Tham khảo 9 nguyên tắc xin phép bên trái và gửi đề nghị sử dụng hình ảnh đúng phạm vi bên phải. Dữ liệu liên hệ cá nhân được bảo vệ ở chế độ chỉ ghi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/khieu-nai-go-bo')}
            className="link-editorial text-xs font-semibold text-[#781F25] shrink-0"
          >
            Cần rút đồng ý / khiếu nại →
          </button>
        </div>
      </header>

      {/* Two-Column Sticky Editorial Intake */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
        {/* Sticky Left Column: 9 Principles */}
        <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="border-b border-[#201F1C]/12 pb-3">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              9 NGUYÊN TẮC XIN PHÉP
            </p>
            <h2 className="font-display text-2xl font-bold text-[#201F1C] mt-1">
              Quy chuẩn Khai thác Đúng phép tắc
            </h2>
          </div>

          <ol className="divide-y divide-[#201F1C]/10 border-b border-[#201F1C]/12">
            {NINE_PRINCIPLES.map((g) => (
              <li key={g.num} className="py-4 flex items-start gap-4">
                <span className="font-mono-tabular text-xs font-semibold text-[#A58A61] pt-0.5">
                  {g.num}
                </span>
                <div className="space-y-1">
                  <h3 className="font-display text-base font-semibold text-[#201F1C]">{g.title}</h3>
                  <p className="text-xs text-[#57524A] leading-relaxed">{g.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        {/* Right Column: Minimalist Grouped Form */}
        <section className="lg:col-span-7 bg-[#FBFAF7] border-y border-[#201F1C]/15 p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#201F1C]/12 pb-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
                Đơn đề nghị Sử dụng Tư liệu
              </h2>
              <p className="text-xs text-[#57524A] mt-1">
                Áp dụng giới hạn gửi chống spam và bảo mật thông tin người đề nghị.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/kiem-tra-quyen')}
              className="link-editorial text-xs font-semibold text-[#781F25] shrink-0"
            >
              Chẩn đoán quyền trước →
            </button>
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

          <form onSubmit={handleUsageSubmit} className="space-y-8 text-xs sm:text-sm">
            {/* Group 01 */}
            <div className="space-y-5">
              <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#781F25] font-semibold">
                01. Thông tin người yêu cầu
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    placeholder="Nguyễn Văn A"
                    className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#201F1C] mb-1">
                    Đơn vị / Trường học / Tổ chức *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Trường ĐH / Viện nghiên cứu / Cá nhân"
                    className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Email hoặc kênh liên hệ (Bảo mật chỉ ghi) *
                </label>
                <input
                  type="text"
                  required
                  minLength={4}
                  maxLength={200}
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="Email công việc hoặc học thuật"
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
            </div>

            {/* Group 02 */}
            <div className="space-y-5 pt-4 border-t border-[#201F1C]/12">
              <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#781F25] font-semibold">
                02. Tư liệu &amp; Phạm vi khai thác
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-[#201F1C] mb-1">
                    Mã định danh tư liệu *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    list="heritage-record-codes-usage"
                    value={recordIdentifier}
                    onChange={(e) => setRecordIdentifier(e.target.value)}
                    placeholder="Ví dụ DSS-J02-001"
                    className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                  />
                  <datalist id="heritage-record-codes-usage">
                    {records.map((r) => (
                      <option key={r.id} value={r.dcIdentifier}>
                        {r.dcTitle}
                      </option>
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block font-medium text-[#201F1C] mb-1">
                    Mục đích sử dụng *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={500}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block font-medium text-[#201F1C] mb-1">
                    Phạm vi đề nghị *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={300}
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#201F1C] mb-1">
                    Hình thức công bố *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={usageFormat}
                    onChange={(e) => setUsageFormat(e.target.value)}
                    className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#201F1C] mb-1">Thời hạn dự kiến *</label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#201F1C] mb-1">
                  Ghi chú bổ sung hoặc liên kết đề cương
                </label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Ghi rõ đề cương nghiên cứu hoặc yêu cầu trao đổi với đơn vị lưu giữ..."
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
            </div>

            {/* Group 03 */}
            <div className="space-y-5 pt-4 border-t border-[#201F1C]/12">
              <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#781F25] font-semibold">
                03. Cam kết tuân thủ
              </p>
              <label className="flex items-start gap-3 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={pledgeAccepted}
                  onChange={(e) => setPledgeAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-[#57524A] leading-relaxed">
                  Tôi cam kết không sử dụng tư liệu cho mục đích thương mại khi chưa có văn bản chấp thuận, ghi rõ nguồn gốc, phân biệt đúng loại bản và ngừng sử dụng ngay nếu chủ thể quyền rút lại sự đồng ý.
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3.5 bg-[#781F25] text-[#FBFAF7] text-xs sm:text-sm font-medium inline-flex items-center gap-2 hover:bg-[#5D171C] disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Đang gửi đơn...' : 'Gửi yêu cầu sử dụng hình ảnh'}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

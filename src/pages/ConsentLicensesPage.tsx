import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import { IMAGE_RIGHTS_STATUSES, PERMISSION_STATUSES } from '../data/officialSourcesAndLegal';

interface ConsentLicensesPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const CONSENT_STEPS = [
  {
    step: 'BƯỚC 01',
    title: 'Xác định đúng chủ thể có thẩm quyền đồng ý',
    detail:
      'Làm rõ người giữ bản gốc, đại diện gia đình/dòng họ hoặc cơ quan lưu giữ công lập — tách biệt người giữ hiện vật với tác giả ảnh chụp.',
  },
  {
    step: 'BƯỚC 02',
    title: 'Thiết lập phạm vi hẹp và thời hạn cụ thể',
    detail:
      'Mỗi văn bản đồng ý chỉ cấp cho phạm vi xác định (xem web, học tập, nghiên cứu phi lợi nhuận). Không mặc nhiên mở rộng sang in ấn hay thương mại.',
  },
  {
    step: 'BƯỚC 03',
    title: 'Cách ly tệp gốc và chứng từ đồng ý nhạy cảm',
    detail:
      'Tệp original_master và văn bản ký tên (rights_evidence) luôn lưu trữ tách biệt, không mở đường dẫn công khai để bảo vệ dữ liệu cá nhân.',
  },
  {
    step: 'BƯỚC 04',
    title: 'Gắn trạng thái quyền độc lập cho từng hình ảnh',
    detail:
      'Trong cùng một hồ sơ tư liệu, từng bức ảnh mang trạng thái riêng trong bộ 8 trạng thái. Ảnh chưa rõ nguồn hoặc thiếu phép tự động bị khóa.',
  },
  {
    step: 'BƯỚC 05',
    title: 'Bảo lưu quyền rút lại sự đồng ý bất kỳ lúc nào',
    detail:
      'Chủ sở hữu, gia đình hoặc tác giả có quyền gửi yêu cầu tạm ẩn hoặc rút lại sự đồng ý công bố qua cổng công khai mà không cần lý do thương mại.',
  },
];

export function ConsentLicensesPage({ onNavigate }: ConsentLicensesPageProps) {
  const { consentRecords, records } = useHeritage();

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      {/* Masthead */}
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-5">
          <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
            QUY TRÌNH XIN PHÉP &amp; SỰ ĐỒNG Ý · J02
          </p>
          <h1
            className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-4xl"
            style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
          >
            Sự Đồng ý &amp; Giấy phép Sử dụng Tư liệu
          </h1>
          <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
            Mọi sự đồng ý công bố hoặc khai thác phải ghi rõ tư cách pháp lý, phạm vi cho phép, thời hạn và căn cứ đối chiếu. Tuyệt đối không suy diễn từ ảnh xuất hiện trên Internet thành quyền tải xuống hay tái sử dụng.
          </p>
        </div>
      </header>

      {/* STEP-BY-STEP PROCESS */}
      <section className="py-16 sm:py-20 bg-[#FBFAF7] border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-24">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              01 / QUY TRÌNH THEO TỪNG BƯỚC
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
              5 Bước Thiết lập &amp; Kiểm soát Sự Đồng ý
            </h2>
            <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed">
              Quy trình chuẩn giúp gia đình, dòng họ và đơn vị lưu trữ chủ động kiểm soát phạm vi hiển thị ngay cả sau khi tư liệu đã số hóa.
            </p>
          </div>

          <ol className="lg:col-span-8 divide-y divide-[#201F1C]/12 border-t border-b border-[#201F1C]/12">
            {CONSENT_STEPS.map((s) => (
              <li key={s.step} className="py-7 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                <span className="sm:col-span-3 font-mono-tabular text-xs font-semibold text-[#781F25]">
                  {s.step}
                </span>
                <div className="sm:col-span-9 space-y-1.5">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#201F1C]">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#57524A] leading-relaxed">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* STATUS TAXONOMY — Clean Typographic Lists */}
      <section className="py-16 sm:py-20 border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                02 / PHÂN LOẠI QUYỀN ẢNH
              </p>
              <h2 className="font-display text-2xl font-bold text-[#201F1C] mt-1">
                8 Trạng thái Độc lập cho Từng Hình ảnh
              </h2>
            </div>
            <ol className="divide-y divide-[#201F1C]/10 border-t border-b border-[#201F1C]/12 text-xs sm:text-sm">
              {IMAGE_RIGHTS_STATUSES.map((st, idx) => (
                <li key={st} className="py-3 flex items-baseline gap-4">
                  <span className="font-mono-tabular text-xs text-[#781F25] font-semibold">
                    0{idx + 1}
                  </span>
                  <span className="text-[#201F1C] font-medium">{st}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                03 / TRẠNG THÁI QUYỀN HỒ SƠ
              </p>
              <h2 className="font-display text-2xl font-bold text-[#201F1C] mt-1">
                14 Trạng thái Quyền &amp; Đồng ý Chuẩn hóa
              </h2>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 divide-y sm:divide-y-0 border-t border-b border-[#201F1C]/12 py-2 text-xs">
              {PERMISSION_STATUSES.map((st, idx) => (
                <li key={st} className="py-2.5 border-b border-[#201F1C]/10 flex items-baseline gap-2.5">
                  <span className="font-mono-tabular text-[#A58A61]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[#201F1C]">{st}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* PUBLIC CONSENT LEDGER */}
      <section className="py-16 sm:py-20 bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#201F1C]/12 pb-4">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                04 / SỔ GHI NHẬN CÔNG KHAI
              </p>
              <h2 className="font-display text-2xl font-bold text-[#201F1C] mt-1">
                Tóm tắt Công khai Tình trạng Đồng ý ({consentRecords.length})
              </h2>
            </div>
            <span className="text-xs text-[#57524A] font-mono-tabular">
              Đối chiếu trên {records.length} hồ sơ công khai
            </span>
          </div>

          {consentRecords.length === 0 ? (
            <p className="text-xs sm:text-sm text-[#57524A] py-6">
              CHƯA CÓ DỮ LIỆU — Chưa có bản ghi sự đồng ý nào được công bố. Khi thiếu căn cứ hợp lệ, hình ảnh tư liệu ở trạng thái khóa hiển thị.
            </p>
          ) : (
            <div className="divide-y divide-[#201F1C]/12 border-b border-[#201F1C]/12">
              {consentRecords.map((c) => (
                <div key={c.id} className="py-6 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div>
                      <p className="font-display text-lg font-bold text-[#201F1C]">
                        {c.consenterName}{' '}
                        <span className="text-[#57524A] font-normal font-sans text-xs">
                          — {c.consenterRole}
                        </span>
                      </p>
                      <p className="text-[#57524A]">
                        Ngày ghi nhận: {c.consentDate} · Thời hạn: {c.expiryDate || 'Chưa xác định'}
                      </p>
                    </div>
                    <span className="font-mono-tabular font-semibold text-[#781F25] shrink-0">
                      {c.effectiveStatus}
                    </span>
                  </div>

                  <p className="text-[#201F1C]">
                    <strong>Phạm vi:</strong> {c.allowedScopes.join('; ')}
                  </p>
                  <p className="text-[#57524A]">
                    <strong>Điều kiện:</strong> {c.conditions || 'Không ghi chú thêm'}
                  </p>
                  <p className="text-[#57524A]">
                    <strong>Căn cứ đối chiếu:</strong> {c.evidenceSummary}
                  </p>
                  <p className="text-[#57524A] font-mono-tabular">
                    Áp dụng cho {c.recordIds.length} hồ sơ ({c.recordIds.join(', ')})
                  </p>

                  {c.withdrawnAt && (
                    <p className="pt-1 text-[#781F25] font-medium">
                      Đã rút lại lúc {c.withdrawnAt.slice(0, 16)}: {c.withdrawalReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <p className="font-display text-lg font-bold text-[#201F1C]">
                Kênh gửi yêu cầu sử dụng hoặc rút lại đồng ý / tạm ẩn hình ảnh
              </p>
              <p className="text-xs sm:text-sm text-[#57524A]">
                Mọi biểu mẫu công khai áp dụng chế độ chỉ ghi để bảo mật dữ liệu liên hệ cá nhân.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onNavigate('/yeu-cau-su-dung')}
                className="px-5 py-3 bg-[#781F25] text-[#FBFAF7] hover:bg-[#5D171C] inline-flex items-center gap-1.5"
              >
                <span>Gửi yêu cầu sử dụng</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/khieu-nai-go-bo')}
                className="px-5 py-3 border border-[#201F1C]/25 text-[#201F1C] hover:border-[#781F25]"
              >
                Tạm ẩn / Rút lại đồng ý
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import { HairlineRule } from '../components/RoyalMotifs';

interface AboutPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const { records, sources } = useHeritage();
  const verifiedCount = records.filter((r) => r.verificationLevel === 'Đã kiểm').length;
  const unverifiedCount = records.length - verifiedCount;

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      {/* Masthead */}
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-5">
          <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
            MANIFESTO &amp; COLOPHON · ĐỀ TÀI J02
          </p>
          <h1
            className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-4xl"
            style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
          >
            Giới thiệu Dự án Di Sản Số
          </h1>
          <p className="font-editorial italic text-xl sm:text-2xl text-[#57524A]">
            “Minh bạch quyền — Tôn trọng bản gốc — Khai thác di sản có trách nhiệm.”
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 space-y-20">
        {/* Clean Light-Paper Colophon Plaque */}
        <section className="bg-[#FBFAF7] border-y border-[#201F1C]/15 py-10 px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-2.5">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              THÔNG TIN TÁC GIẢ &amp; THỰC HIỆN
            </p>
            <h2 className="font-display text-3xl font-bold text-[#201F1C]">
              Trần Thanh Bình — PH61165
            </h2>
            <p className="text-sm text-[#57524A]">
              Nhóm: <strong className="text-[#201F1C]">Group 1</strong> · Mã đề tài:{' '}
              <strong className="font-mono-tabular text-[#781F25]">J02</strong>
            </p>
            <p className="text-sm text-[#57524A]">
              Chương trình:{' '}
              <strong className="text-[#201F1C]">
                Thực tập sinh Đợt 15 — IMTA TECH x FPT Polytechnic
              </strong>
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3 text-xs sm:text-sm text-[#57524A] border-t lg:border-t-0 lg:border-l border-[#201F1C]/12 pt-6 lg:pt-0 lg:pl-10">
            <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#781F25] font-semibold">
              CHỦ ĐỀ &amp; TÍNH CHẤT NỀN TẢNG
            </p>
            <p>
              <strong className="text-[#201F1C]">Nhóm chủ đề:</strong> Quyền sở hữu, bản sao và khai thác hình ảnh di sản
            </p>
            <p>
              <strong className="text-[#201F1C]">Tên đề tài:</strong> Quản lý quyền với tư liệu gia đình và dòng họ
            </p>
            <p className="leading-relaxed">
              <strong className="text-[#201F1C]">Tính chất:</strong> Nền tảng thông tin di sản công khai phi lợi nhuận — không bán tư liệu, không môi giới, không định giá hiện vật, không thu phí, không có khu vực quản trị nội bộ.
            </p>
          </div>
        </section>

        {/* Purpose & Scope */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-3">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              01 / LÝ DO HÌNH THÀNH
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
              Mục đích &amp; Lý do thực hiện
            </h2>
            <p className="text-sm sm:text-base text-[#57524A] leading-relaxed editorial-measure">
              Nhiều tư liệu gia đình, dòng họ (gia phả, sắc phong, thư từ, ảnh cổ, văn bia) khi đưa lên mạng thường mất thông tin người lưu giữ, nhầm lẫn giữa bản gốc và bản sao/bản chụp lại, hoặc bị sử dụng vượt phạm vi cho phép. Dự án xây dựng cổng tra cứu công khai minh bạch các lớp quyền để bảo vệ nguyên bản và quyền riêng tư của chủ thể.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              02 / ĐỐI TƯỢNG PHỤC VỤ
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
              Phạm vi &amp; Công chúng tra cứu
            </h2>
            <p className="text-sm sm:text-base text-[#57524A] leading-relaxed editorial-measure">
              Trọng tâm nghiệp vụ là tư liệu gia đình và dòng họ, đồng thời chuẩn hóa mô tả cho mộc bản, châu bản, văn bia, sắc phong, hoành phi, sách cổ và ảnh tư liệu. Phục vụ công chúng tra cứu tự do không cần đăng nhập: đại diện gia đình/dòng họ, cán bộ bảo tàng – lưu trữ, nhà nghiên cứu, sinh viên và cộng đồng.
            </p>
          </div>
        </section>

        <HairlineRule />

        {/* Methodology */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-2">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              03 / PHƯƠNG PHÁP CHUẨN HÓA
            </p>
            <h2 className="font-display text-2xl font-bold text-[#201F1C]">
              Kỷ luật Dữ liệu &amp; Bảo vệ Bản gốc
            </h2>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-[#57524A]">
            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-[#201F1C]">
                Mô tả Dublin Core &amp; Đối chiếu nguồn
              </h3>
              <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                <li>
                  Hiện có {records.length} hồ sơ tư liệu ({verifiedCount} hồ sơ đã xác minh đối chiếu nguồn UNESCO / Cục Di sản văn hóa / Cục Văn thư và Lưu trữ nhà nước; {unverifiedCount} hồ sơ ở trạng thái chưa xác minh để giữ nguyên tính trung thực).
                </li>
                <li>
                  Mọi thông tin thiếu bằng chứng hiển thị rõ trạng thái chưa xác minh, không tự điền thông tin phỏng đoán hoặc tạo ảnh AI giả hiện vật thật.
                </li>
                <li>
                  Mỗi hồ sơ gắn liên kết tới nguồn tham khảo kiểm chứng được tại Thư viện Nguồn ({sources.length} nguồn).
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-[#201F1C]">
                Phân tách 4 nhóm tệp &amp; Quyền độc lập
              </h3>
              <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                <li>
                  Mỗi tệp ảnh gắn độc lập 1 trong 8 trạng thái quyền cụ thể; ảnh chưa đủ căn cứ không tự động mở tải xuống.
                </li>
                <li>
                  Nhóm tệp chủ gốc (<code className="font-mono-tabular">original_master</code>) và bằng chứng quyền (<code className="font-mono-tabular">rights_evidence</code>) bị khóa khỏi truy cập công khai.
                </li>
                <li>
                  Công dân có kênh gửi Yêu cầu sử dụng và kênh Khiếu nại / Tạm ẩn / Gỡ bỏ độc lập với bảo vệ dữ liệu cá nhân.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <HairlineRule />

        {/* Honest Limitations */}
        <section className="space-y-6">
          <div>
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              04 / MINH BẠCH GIỚI HẠN TRIỂN KHAI
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#781F25] mt-1">
              Giới hạn Thực tế &amp; Nội dung Đợi Xác minh Ngoài Thực địa
            </h2>
          </div>

          <div className="divide-y divide-[#201F1C]/12 border-y border-[#201F1C]/12 text-xs sm:text-sm text-[#57524A]">
            <div className="py-5">
              <p className="leading-relaxed">
                <strong className="text-[#201F1C]">Bằng chứng đồng ý thực địa &amp; tải ảnh phân giải cao:</strong>{' '}
                Trong {records.length} hồ sơ hiện có, {verifiedCount} hồ sơ đã đối chiếu danh mục chính thức; {unverifiedCount} hồ sơ tư liệu gia đình/dòng họ giữ nguyên trạng thái chưa xác minh vì cần tiếp xúc trực tiếp hội đồng gia tộc hoặc xin chấp thuận bằng văn bản từ bảo tàng/cơ quan lưu trữ.
              </p>
            </div>
            <div className="py-5">
              <p className="leading-relaxed">
                <strong className="text-[#201F1C]">Đối chiếu văn bản dưới luật:</strong>{' '}
                Luật Di sản văn hóa số 45/2024/QH15 và VBHN 160/2026/VBHN-LQ-VPQH đã gắn liên kết đối chiếu cổng văn bản Chính phủ; các nghị định, thông tư hướng dẫn chi tiết được đánh dấu chờ đối chiếu toàn văn khi tra cứu chuyên sâu.
              </p>
            </div>
            <div className="py-5">
              <p className="leading-relaxed">
                <strong className="text-[#201F1C]">Giá trị tư vấn pháp lý:</strong>{' '}
                Công cụ kiểm tra quyền và trợ lý AI trên website chỉ hỗ trợ đối chiếu dữ liệu đã ghi nhận, không thay thế tư vấn pháp lý chính thức hay quyết định của cơ quan nhà nước có thẩm quyền.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onNavigate('/bao-cao-kiem-thu')}
              className="px-6 py-3 bg-[#781F25] text-[#FBFAF7] hover:bg-[#5D171C] transition-colors inline-flex items-center gap-2"
            >
              <span>Xem Báo cáo Tự kiểm tra Nghiệm thu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/tra-cuu')}
              className="link-editorial text-[#201F1C] py-3"
            >
              Tra cứu kho tư liệu ({records.length} hồ sơ) →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

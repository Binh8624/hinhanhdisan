import React, { useMemo } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import { AbstractArchivalPlate, HairlineRule } from '../components/RoyalMotifs';
import { EditorialReveal, SubtleParallax } from '../components/MotionPrimitives';
import { RecordCard } from '../components/RecordCard';

interface HomePageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const PUBLIC_CATEGORIES = new Set([
  'access_copy',
  'preservation_copy',
  'display_web',
  'copy_file',
]);

export function HomePage({ onNavigate }: HomePageProps) {
  const { records, recordFiles, sources, consentRecords, loading } = useHeritage();

  const stats = useMemo(() => {
    const total = records.length;
    const verified = records.filter((r) => r.verificationLevel === 'Đã kiểm').length;
    const unverified = records.filter((r) => r.verificationLevel !== 'Đã kiểm').length;
    const restrictedImages = records.filter((r) => !r.canDisplayImage).length;
    return { total, verified, unverified, restrictedImages };
  }, [records]);

  const clearedHeroMedia = useMemo(() => {
    for (const rec of records) {
      if (rec.visibilityStatus !== 'public' || !rec.canDisplayImage) continue;
      const match = recordFiles.find(
        (f) =>
          f.recordId === rec.id &&
          PUBLIC_CATEGORIES.has(f.fileCategory) &&
          f.displayAllowed &&
          f.isPubliclyReadable &&
          Boolean(f.mediaUrl)
      );
      if (match) return { record: rec, file: match };
    }
    return null;
  }, [records, recordFiles]);

  const featuredRecords = useMemo(
    () =>
      records
        .filter((r) => r.visibilityStatus === 'public' && r.verificationLevel === 'Đã kiểm')
        .slice(0, 4),
    [records]
  );

  const verifiedList = useMemo(
    () => records.filter((r) => r.verificationLevel === 'Đã kiểm').slice(0, 5),
    [records]
  );

  const unverifiedList = useMemo(
    () => records.filter((r) => r.verificationLevel !== 'Đã kiểm').slice(0, 5),
    [records]
  );

  const featuredSources = useMemo(() => sources.slice(0, 5), [sources]);

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      {/* HERO — Full-viewport-scale exhibition opening */}
      <section className="min-h-[82vh] flex items-center border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            {/* Left Exhibition Typography */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono-tabular uppercase tracking-[0.22em] text-[#57524A]">
                <span className="text-[#781F25] font-semibold">J02</span>
                <span>/</span>
                <span>Đề tài Nghiên cứu &amp; Lưu trữ Số</span>
                <span>/</span>
                <span>Việt Nam</span>
              </div>

              <h1
                className="font-display font-bold text-[#201F1C] leading-[1.06] tracking-tight"
                style={{ fontSize: 'clamp(2.45rem, 5.2vw, 4.65rem)' }}
              >
                DI SẢN ĐƯỢC LƯU GIỮ.
                <br />
                <span className="text-[#781F25]">QUYỀN ĐƯỢC TÔN TRỌNG.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#57524A] leading-relaxed editorial-measure">
                Không gian lưu trữ số và minh bạch quyền đối với tư liệu gia đình, dòng họ và di sản tư liệu. Phân tách rạch ròi giữa hiện vật gốc, bản sao, bản số hóa và sự đồng ý công bố hình ảnh.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/tra-cuu')}
                  className="px-7 py-3.5 bg-[#781F25] text-[#FBFAF7] text-xs sm:text-sm font-medium tracking-wide inline-flex items-center gap-2.5 hover:bg-[#5D171C] transition-colors"
                >
                  <span>Khám phá tư liệu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/quyen-so-huu')}
                  className="link-editorial text-xs sm:text-sm font-medium text-[#201F1C] py-1"
                >
                  Sơ đồ quan hệ quyền →
                </button>
              </div>

              <div className="pt-8 border-t border-[#201F1C]/12 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-[#57524A]">
                <span>Truy cập công khai không cần tài khoản</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/kiem-tra-quyen')}
                  className="link-editorial text-[#201F1C]"
                >
                  Kiểm tra phạm vi quyền ảnh
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/khieu-nai-go-bo')}
                  className="link-editorial text-[#781F25]"
                >
                  Cổng rút lại đồng ý &amp; tạm ẩn
                </button>
              </div>
            </div>

            {/* Right Exhibition Visual Plate — Authorized photo OR Abstract Registration Sculpture */}
            <div className="lg:col-span-5">
              <SubtleParallax>
                {clearedHeroMedia ? (
                  <figure className="space-y-3">
                    <div className="aspect-[4/5] bg-[#FBFAF7] border border-[#201F1C]/15 overflow-hidden">
                      <img
                        src={clearedHeroMedia.file.mediaUrl}
                        alt={clearedHeroMedia.file.caption || clearedHeroMedia.record.dcTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <figcaption className="flex items-start justify-between gap-4 text-[11px] text-[#57524A] border-t border-[#201F1C]/12 pt-2">
                      <span className="font-editorial italic">
                        {clearedHeroMedia.file.caption} — {clearedHeroMedia.file.sourceCredit}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('/tu-lieu', clearedHeroMedia.record.id)}
                        className="font-mono-tabular text-[#781F25] shrink-0 hover:underline"
                      >
                        {clearedHeroMedia.record.dcIdentifier}
                      </button>
                    </figcaption>
                  </figure>
                ) : (
                  <AbstractArchivalPlate
                    code="J02 / ARCHIVAL REGISTRATION"
                    caption="Vùng trưng bày ẩn ảnh mặc định khi tư liệu gia đình hoặc đơn vị lưu giữ chưa cấp phép công khai."
                    aspect="tall"
                  />
                )}
              </SubtleParallax>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01 — Vấn đề quyền đối với tư liệu + Open Typographic Census */}
      <section className="py-16 sm:py-24 border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16">
          <EditorialReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
                <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                  01 / VẤN ĐỀ QUYỀN ĐỐI VỚI TƯ LIỆU
                </p>
                <h2
                  className="font-display font-bold text-[#201F1C] leading-[1.14]"
                  style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)' }}
                >
                  Nắm giữ vật mang tin không đồng nghĩa sở hữu mọi quyền khai thác.
                </h2>
                <p className="text-sm sm:text-base text-[#57524A] leading-relaxed">
                  Một bức sắc phong, cuốn gia phả hay bản dập văn bia khi số hóa chịu sự chi phối đồng thời của nhiều lớp quyền độc lập. Di Sản Số minh bạch hóa ranh giới giữa lưu giữ vật lý và quyền công bố trên môi trường mạng.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/quyen-so-huu')}
                    className="link-editorial text-xs sm:text-sm font-semibold text-[#781F25] inline-flex items-center gap-1.5"
                  >
                    <span>Xem sơ đồ 7 chủ thể &amp; 9 lớp quyền</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 divide-y divide-[#201F1C]/12 border-t border-b border-[#201F1C]/12">
                {[
                  {
                    num: 'I',
                    title: 'Quyền sở hữu hiện vật & trách nhiệm bảo quản',
                    body: 'Phân biệt chủ sở hữu vật mang tin (gia đình, dòng họ, bảo tàng, lưu trữ quốc gia) với người đang trực tiếp bảo quản bản gốc.',
                  },
                  {
                    num: 'II',
                    title: 'Quyền tác giả nội dung & quyền của người chụp ảnh',
                    body: 'Tách biệt tác giả cổ văn hoặc người biên soạn gia phả đời sau với nhiếp ảnh gia chụp tư liệu và tổ chức thực hiện số hóa.',
                  },
                  {
                    num: 'III',
                    title: 'Phạm vi hiển thị & khóa tải độc lập từng hình ảnh',
                    body: 'Bản chủ bảo quản chất lượng cao tách khỏi tệp truy cập web. Mọi hình ảnh thiếu văn bản đồng ý đều tự động khóa hiển thị và tải.',
                  },
                  {
                    num: 'IV',
                    title: 'Riêng tư gia tộc & quyền rút lại sự đồng ý',
                    body: 'Ẩn địa chỉ nhà riêng, ẩn dữ liệu cá nhân người còn sống và tiếp nhận yêu cầu tạm ẩn, gỡ bỏ công khai bất kỳ lúc nào.',
                  },
                ].map((item) => (
                  <div key={item.num} className="py-7 flex items-start gap-6">
                    <span className="font-display text-2xl font-semibold text-[#A58A61] w-8 shrink-0">
                      {item.num}.
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-[#201F1C]">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#57524A] leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </EditorialReveal>

          {/* Open Typographic Census Strip (No cards, hairline rules only) */}
          <EditorialReveal delay={0.08}>
            <div className="pt-10 border-t border-[#201F1C]/12 grid grid-cols-2 lg:grid-cols-5 gap-8">
              <div>
                <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#57524A]">
                  Hồ sơ công khai
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold font-mono-tabular text-[#201F1C] mt-2">
                  {loading ? '—' : String(stats.total).padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#57524A]">
                  Đã kiểm nguồn
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold font-mono-tabular text-[#781F25] mt-2">
                  {loading ? '—' : String(stats.verified).padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#57524A]">
                  Chưa kiểm đủ
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold font-mono-tabular text-[#57524A] mt-2">
                  {loading ? '—' : String(stats.unverified).padStart(2, '0')}
                </p>
              </div>
              <div>
                <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#57524A]">
                  Khóa hiển thị ảnh
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold font-mono-tabular text-[#201F1C] mt-2">
                  {loading ? '—' : String(stats.restrictedImages).padStart(2, '0')}
                </p>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#57524A]">
                  Nguồn / Đồng ý
                </p>
                <p className="font-display text-4xl sm:text-5xl font-bold font-mono-tabular text-[#201F1C] mt-2">
                  {sources.length}/{consentRecords.length}
                </p>
              </div>
            </div>
          </EditorialReveal>
        </div>
      </section>

      {/* SECTION 02 — Giới thiệu các hồ sơ tư liệu (Unboxed Catalog Showcase) */}
      <section className="py-16 sm:py-24 bg-[#FBFAF7] border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#201F1C]/12 pb-6">
            <div className="space-y-2">
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                02 / GIỚI THIỆU CÁC HỒ SƠ TƯ LIỆU
              </p>
              <h2
                className="font-display font-bold text-[#201F1C]"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                Mục lục Trưng bày Di sản Tư liệu
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/tra-cuu')}
              className="link-editorial text-xs sm:text-sm font-semibold text-[#781F25] inline-flex items-center gap-1.5 shrink-0"
            >
              <span>Mở toàn bộ {records.length} hồ sơ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {featuredRecords.length === 0 ? (
            <p className="text-sm text-[#57524A] py-8">
              Đang đồng bộ danh mục tư liệu di sản xác thực...
            </p>
          ) : (
            <div className="border-t border-[#201F1C]/12">
              {featuredRecords.map((rec, idx) => (
                <RecordCard
                  key={rec.id}
                  record={rec}
                  files={recordFiles}
                  indexNumber={idx + 1}
                  onOpenDetail={(id) => onNavigate('/tu-lieu', id)}
                />
              ))}
            </div>
          )}

          {/* Verified vs Pending Verification Editorial Index */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#201F1C]/15 pb-3">
                <h3 className="font-display text-lg font-semibold text-[#201F1C]">
                  Hồ sơ đã đối chiếu nguồn ({stats.verified})
                </h3>
                <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#781F25]">
                  ĐÃ KIỂM
                </span>
              </div>
              <ul className="divide-y divide-[#201F1C]/10">
                {verifiedList.map((rec) => (
                  <li key={rec.id} className="py-3.5 flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-mono-tabular text-[11px] text-[#781F25] mr-2">
                        {rec.dcIdentifier}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('/tu-lieu', rec.id)}
                        className="text-sm font-medium text-[#201F1C] hover:text-[#781F25] text-left"
                      >
                        {rec.dcTitle}
                      </button>
                    </div>
                    <span className="text-[11px] font-mono-tabular text-[#57524A] shrink-0">
                      {rec.displayedVersionType}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-[#201F1C]/15 pb-3">
                <h3 className="font-display text-lg font-semibold text-[#201F1C]">
                  Hồ sơ đang chờ bổ sung căn cứ ({stats.unverified})
                </h3>
                <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#57524A]">
                  CHƯA KIỂM ĐỦ
                </span>
              </div>
              <ul className="divide-y divide-[#201F1C]/10">
                {unverifiedList.map((rec) => (
                  <li key={rec.id} className="py-3.5 flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-mono-tabular text-[11px] text-[#57524A] mr-2">
                        {rec.dcIdentifier}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('/tu-lieu', rec.id)}
                        className="text-sm font-medium text-[#201F1C] hover:text-[#781F25] text-left"
                      >
                        {rec.dcTitle}
                      </button>
                    </div>
                    <span className="text-[11px] text-[#781F25] shrink-0">
                      {rec.rightsStatus}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 — Giải thích bản gốc, bản sao và bản số hóa */}
      <section className="py-16 sm:py-24 border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                03 / GIẢI THÍCH BẢN GỐC, BẢN SAO VÀ BẢN SỐ HÓA
              </p>
              <h2
                className="font-display font-bold text-[#201F1C]"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                Mỗi phiên bản mang một lịch sử tạo lập và chủ thể quyền riêng
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/ban-goc-ban-sao')}
              className="link-editorial text-xs sm:text-sm font-semibold text-[#781F25] inline-flex items-center gap-1.5 shrink-0"
            >
              <span>Xem bảng đối chiếu 5 loại bản</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <EditorialReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 border-t border-[#201F1C]/12 pt-10">
              <div className="space-y-3">
                <span className="font-display text-4xl font-semibold text-[#A58A61]">01</span>
                <h3 className="font-display text-xl font-bold text-[#201F1C]">Bản gốc</h3>
                <p className="text-sm text-[#57524A] leading-relaxed">
                  Vật mang tin nguyên thủy bằng giấy dó, ván khắc gỗ, bia đá hoặc ảnh bạc muối. Quyền sở hữu thuộc gia đình, dòng họ hoặc đơn vị bảo tàng lưu giữ — không tự động chuyển giao sang web.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-display text-4xl font-semibold text-[#A58A61]">02</span>
                <h3 className="font-display text-xl font-bold text-[#201F1C]">Bản sao</h3>
                <p className="text-sm text-[#57524A] leading-relaxed">
                  Bản chép tay gia phả truyền chi nhánh, bản dập rập từ bia đá hay bản in lại có chú thích nguồn gốc. Mang giá trị bổ trợ lịch sử khi bản gốc suy thoái hoặc thất lạc.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-display text-4xl font-semibold text-[#781F25]">03</span>
                <h3 className="font-display text-xl font-bold text-[#201F1C]">Bản số hóa</h3>
                <p className="text-sm text-[#57524A] leading-relaxed">
                  Tệp ảnh hoặc bản quét tạo lập bởi đơn vị số hóa. Tệp gốc phân giải cao bảo lưu nội bộ; bản hiển thị công khai chỉ mở khi đủ chấp thuận của chủ giữ hiện vật và người chụp.
                </p>
              </div>
            </div>
          </EditorialReveal>
        </div>
      </section>

      {/* SECTION 04 — Quyền khai thác hình ảnh */}
      <section className="py-16 sm:py-24 bg-[#FBFAF7] border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              04 / QUYỀN KHAI THÁC HÌNH ẢNH
            </p>
            <h2
              className="font-display font-bold text-[#201F1C] leading-[1.16]"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              Không tự kết luận được phép tải xuống chỉ vì ảnh xuất hiện trên Internet.
            </h2>
            <p className="text-sm text-[#57524A] leading-relaxed">
              Mỗi hình ảnh trong Di Sản Số tuân thủ quy trình kiểm tra 12 điều kiện trước khi cho phép trích xuất hoặc dẫn lại. Người dùng có thể tự đối chiếu phạm vi trước khi gửi đề nghị sử dụng.
            </p>
            <div className="pt-3 flex flex-wrap gap-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onNavigate('/kiem-tra-quyen')}
                className="px-5 py-3 bg-[#781F25] text-[#FBFAF7] hover:bg-[#5D171C] transition-colors inline-flex items-center gap-2"
              >
                <span>Kiểm tra quyền hình ảnh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/yeu-cau-su-dung')}
                className="px-5 py-3 border border-[#201F1C]/25 text-[#201F1C] hover:border-[#781F25] transition-colors"
              >
                Gửi yêu cầu xin phép
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 divide-y divide-[#201F1C]/12 border-t border-b border-[#201F1C]/12">
            {[
              [
                '01',
                'Kiểm tra trạng thái ảnh & người cho phép',
                'Chỉ những ảnh có chủ thể quyền xác nhận rõ phạm vi (chỉ xem tại chỗ, học tập hay trích dẫn báo chí) mới được hiển thị công khai.',
              ],
              [
                '02',
                'Bảo vệ tệp chủ gốc & dữ liệu nhạy cảm',
                'Các tệp original_master và chứng từ đồng ý có chứa thông tin định danh cá nhân luôn lưu tách khỏi giao diện công cộng.',
              ],
              [
                '03',
                'Ghi nhận điều kiện sử dụng & cấm thương mại hóa trái phép',
                'Khi được chấp thuận sử dụng, người khai thác phải ghi đầy đủ nguồn, mã hồ sơ và tuyệt đối không làm sai lệch bối cảnh tư liệu.',
              ],
              [
                '04',
                'Cơ chế tiếp nhận khiếu nại & tạm ẩn tức thời',
                'Bất kỳ thành viên gia đình, dòng họ hoặc chủ sở hữu nào đều có quyền đề nghị rà soát hoặc rút lại đồng ý công bố.',
              ],
            ].map(([step, title, desc]) => (
              <div key={step} className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
                <span className="sm:col-span-2 font-mono-tabular text-xs font-semibold text-[#781F25]">
                  BƯỚC {step}
                </span>
                <div className="sm:col-span-10 space-y-1">
                  <h3 className="font-display text-base sm:text-lg font-semibold text-[#201F1C]">
                    {title}
                  </h3>
                  <p className="text-sm text-[#57524A] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05 — Nguồn tư liệu & Colophon J02 */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#201F1C]/12 pb-5">
              <div>
                <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                  05 / NGUỒN TƯ LIỆU ĐỐI CHIẾU
                </p>
                <h2
                  className="font-display font-bold text-[#201F1C] mt-1"
                  style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.25rem)' }}
                >
                  Thư mục Nguồn Chính thống ({sources.length} nguồn)
                </h2>
              </div>
              <div className="flex flex-wrap gap-6 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onNavigate('/nguon-tu-lieu')}
                  className="link-editorial text-[#781F25]"
                >
                  Thư mục nguồn đầy đủ →
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/cam-nang-phap-ly')}
                  className="link-editorial text-[#201F1C]"
                >
                  Cẩm nang pháp lý →
                </button>
              </div>
            </div>

            <ol className="divide-y divide-[#201F1C]/10 border-b border-[#201F1C]/10">
              {featuredSources.map((src, i) => (
                <li
                  key={src.id}
                  className="py-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-baseline"
                >
                  <span className="lg:col-span-1 font-mono-tabular text-xs text-[#A58A61]">
                    [{String(i + 1).padStart(2, '0')}]
                  </span>
                  <div className="lg:col-span-7 space-y-1">
                    <p className="font-display text-base font-semibold text-[#201F1C]">
                      {src.name}
                    </p>
                    <p className="text-xs text-[#57524A] leading-relaxed">
                      {src.usedContentSummary}
                    </p>
                  </div>
                  <div className="lg:col-span-4 lg:text-right space-y-1">
                    <p className="font-mono-tabular text-[11px] text-[#57524A]">
                      {src.organizationOrAuthor}
                    </p>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#781F25] hover:underline break-all"
                      >
                        <span>Liên kết tham chiếu</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <HairlineRule />

          {/* Colophon J02 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                COLOPHON / ĐỀ TÀI J02
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
                Quản lý quyền với tư liệu gia đình và dòng họ — Dự án xã hội phi lợi nhuận
              </h2>
              <p className="text-sm text-[#57524A] leading-relaxed editorial-measure">
                Xây dựng bởi <strong>Trần Thanh Bình</strong> (MSSV{' '}
                <span className="font-mono-tabular">PH61165</span>, Nhóm Group 1 — Thực tập sinh Đợt 15, IMTA TECH x FPT Polytechnic). Cam kết không tạo dữ liệu giả, không tự suy diễn quyền và không dùng ảnh AI thay thế hiện vật thật.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap lg:flex-col gap-4 lg:items-end">
              <button
                type="button"
                onClick={() => onNavigate('/gioi-thieu')}
                className="px-6 py-3 bg-[#201F1C] text-[#FBFAF7] text-xs font-medium hover:bg-[#781F25] transition-colors inline-flex items-center gap-2"
              >
                <span>Mục tiêu &amp; Giới hạn triển khai</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/bao-cao-kiem-thu')}
                className="link-editorial text-xs font-medium text-[#57524A] hover:text-[#201F1C]"
              >
                Xem báo cáo kiểm thử chấp nhận →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

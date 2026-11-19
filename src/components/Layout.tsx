import React, { useMemo, useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import {
  LEGAL_HANDBOOK_TOPICS,
  normalizeVietnameseSearch,
} from '../data/officialSourcesAndLegal';
import { BackToTopButton, ReadingProgressBar } from './RoyalMotifs';

interface LayoutProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute, recordId?: string) => void;
  children: React.ReactNode;
}

const PRIMARY_NAV: Array<{ route: AppRoute; label: string }> = [
  { route: '/tra-cuu', label: 'Kho tư liệu' },
  { route: '/quyen-so-huu', label: 'Quyền sở hữu' },
  { route: '/ban-goc-ban-sao', label: 'Bản gốc & Bản số' },
  { route: '/cam-nang-phap-ly', label: 'Pháp lý' },
  { route: '/nguon-tu-lieu', label: 'Nguồn đối chiếu' },
  { route: '/tro-ly-ai', label: 'Trợ lý AI' },
];

const SECONDARY_NAV: Array<{ route: AppRoute; label: string }> = [
  { route: '/', label: 'Trang chủ' },
  { route: '/su-dong-y', label: 'Sự đồng ý & Giấy phép' },
  { route: '/kiem-tra-quyen', label: 'Kiểm tra quyền hình ảnh' },
  { route: '/yeu-cau-su-dung', label: 'Yêu cầu sử dụng' },
  { route: '/khieu-nai-go-bo', label: 'Khiếu nại & Gỡ bỏ' },
  { route: '/gioi-thieu', label: 'Giới thiệu dự án J02' },
  { route: '/bao-cao-kiem-thu', label: 'Báo cáo kiểm thử' },
];

export function Layout({ currentRoute, onNavigate, children }: LayoutProps) {
  const { records, sources } = useHeritage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fontScale, setFontScale] = useState(1);

  const updateFontScale = (next: number) => {
    const clamped = Math.min(1.2, Math.max(0.9, Number(next.toFixed(2))));
    setFontScale(clamped);
    document.documentElement.style.setProperty('--font-scale', String(clamped));
  };

  const searchResults = useMemo(() => {
    const q = normalizeVietnameseSearch(searchTerm);
    if (!q) return { matchedRecords: [], matchedSources: [], matchedLegal: [] };
    return {
      matchedRecords: records
        .filter((r) =>
          normalizeVietnameseSearch(
            `${r.dcIdentifier} ${r.dcTitle} ${r.dcSubject} ${r.dcType} ${r.currentCustodyLocation}`
          ).includes(q)
        )
        .slice(0, 6),
      matchedSources: sources
        .filter((s) =>
          normalizeVietnameseSearch(`${s.name} ${s.organizationOrAuthor} ${s.url}`).includes(q)
        )
        .slice(0, 4),
      matchedLegal: LEGAL_HANDBOOK_TOPICS.filter((l) =>
        normalizeVietnameseSearch(`${l.topic} ${l.category} ${l.summaryPrinciple}`).includes(q)
      ).slice(0, 4),
    };
  }, [searchTerm, records, sources]);

  const handleNav = (route: AppRoute, recordId?: string) => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    onNavigate(route, recordId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA] text-[#201F1C]">
      <ReadingProgressBar />

      {/* Featherlight Transparent / Light Museum Header */}
      <header className="sticky top-0 z-40 bg-[#F4F1EA]/90 backdrop-blur-md border-b border-[#201F1C]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
          {/* Typographic Wordmark */}
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="text-left shrink-0 flex items-baseline gap-3 group focus-visible:outline-2 focus-visible:outline-[#781F25]"
          >
            <span className="font-display text-lg sm:text-xl font-bold tracking-[0.06em] text-[#201F1C] group-hover:text-[#781F25] transition-colors">
              DI SẢN SỐ
            </span>
            <span className="hidden md:inline font-mono-tabular text-[10px] tracking-[0.2em] uppercase text-[#57524A]">
              J02 ARCHIVE
            </span>
          </button>

          {/* Minimal Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-7 text-[13px] text-[#57524A]"
            aria-label="Điều hướng chính"
          >
            {PRIMARY_NAV.map((item) => {
              const active =
                currentRoute === item.route ||
                (item.route === '/tra-cuu' && currentRoute === '/tu-lieu');
              return (
                <button
                  key={item.route}
                  type="button"
                  onClick={() => handleNav(item.route)}
                  className={`link-editorial py-1 whitespace-nowrap transition-colors ${
                    active ? 'text-[#781F25] font-medium' : 'hover:text-[#201F1C]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Minimal Actions: Search Trigger + Mobile Menu Drawer */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm toàn hệ thống"
              className="inline-flex items-center gap-1.5 text-xs text-[#57524A] hover:text-[#201F1C] py-2 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Tìm nhanh</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Đóng danh mục' : 'Mở danh mục'}
              aria-expanded={mobileMenuOpen}
              className="w-10 h-10 flex items-center justify-center text-[#201F1C] hover:text-[#781F25] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Minimalist Index Drawer (all 14 public routes cleanly organized) */}
        {mobileMenuOpen && (
          <div className="bg-[#FBFAF7] border-t border-[#201F1C]/12 px-5 sm:px-8 py-8 max-h-[82vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#781F25] pb-2 border-b border-[#201F1C]/10">
                  01 / Triển lãm &amp; Tra cứu
                </p>
                {PRIMARY_NAV.map((item) => (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleNav(item.route)}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      currentRoute === item.route
                        ? 'text-[#781F25] font-semibold'
                        : 'text-[#201F1C] hover:text-[#781F25]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#57524A] pb-2 border-b border-[#201F1C]/10">
                  02 / Quyền, Yêu cầu &amp; Hồ sơ
                </p>
                {SECONDARY_NAV.map((item) => (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleNav(item.route)}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      currentRoute === item.route
                        ? 'text-[#781F25] font-semibold'
                        : 'text-[#201F1C] hover:text-[#781F25]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 text-xs text-[#57524A] md:border-l md:border-[#201F1C]/10 md:pl-8">
                <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#57524A]">
                  Thông tin xuất bản J02
                </p>
                <p className="font-editorial italic text-sm text-[#201F1C]">
                  “Di sản được lưu giữ. Quyền được tôn trọng.”
                </p>
                <p className="leading-relaxed">
                  Nền tảng tra cứu tư liệu gia đình và dòng họ công khai phi lợi nhuận. Không yêu cầu đăng nhập, không mua bán hiện vật và không tạo ảnh AI thay thế tư liệu thật.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Editorial Quick Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#201F1C]/65 flex items-start justify-center p-4 sm:pt-20"
          role="dialog"
          aria-modal="true"
          aria-label="Tìm kiếm toàn hệ thống"
        >
          <div className="w-full max-w-2xl bg-[#FBFAF7] border border-[#201F1C]/20 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#201F1C]/12 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-4 h-4 text-[#781F25] shrink-0" />
                <input
                  type="search"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm mã hồ sơ, nhan đề tư liệu, nơi lưu giữ hoặc chủ đề..."
                  className="w-full bg-transparent text-sm text-[#201F1C] placeholder:text-[#57524A]/65 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Đóng tìm kiếm"
                className="w-8 h-8 flex items-center justify-center text-[#57524A] hover:text-[#201F1C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
              {!searchTerm.trim() ? (
                <div className="space-y-3 text-xs text-[#57524A]">
                  <p className="font-mono-tabular uppercase tracking-widest text-[10px]">
                    Lối tắt tra cứu
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => handleNav('/tra-cuu')}
                      className="link-editorial text-[#201F1C] font-medium"
                    >
                      Kho tư liệu ({records.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('/kiem-tra-quyen')}
                      className="link-editorial text-[#781F25] font-medium"
                    >
                      Kiểm tra quyền hình ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('/khieu-nai-go-bo')}
                      className="link-editorial text-[#201F1C]"
                    >
                      Khiếu nại / Tạm ẩn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('/tro-ly-ai')}
                      className="link-editorial text-[#201F1C]"
                    >
                      Trợ lý tra cứu AI
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#781F25] mb-2">
                      Hồ sơ tư liệu ({searchResults.matchedRecords.length})
                    </h3>
                    {searchResults.matchedRecords.length === 0 ? (
                      <p className="text-xs text-[#57524A]">Không tìm thấy hồ sơ phù hợp.</p>
                    ) : (
                      <div className="divide-y divide-[#201F1C]/10 border-t border-[#201F1C]/10">
                        {searchResults.matchedRecords.map((rec) => (
                          <button
                            key={rec.id}
                            type="button"
                            onClick={() => handleNav('/tu-lieu', rec.id)}
                            className="w-full text-left py-3 hover:text-[#781F25] transition-colors"
                          >
                            <p className="text-[11px] font-mono-tabular text-[#57524A]">
                              {rec.dcIdentifier} · {rec.dcType}
                            </p>
                            <p className="text-sm font-medium text-[#201F1C] mt-0.5">
                              {rec.dcTitle}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {searchResults.matchedSources.length > 0 && (
                    <div>
                      <h3 className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#781F25] mb-2">
                        Nguồn tham khảo ({searchResults.matchedSources.length})
                      </h3>
                      <ul className="space-y-1.5 text-sm">
                        {searchResults.matchedSources.map((src) => (
                          <li key={src.id}>
                            <button
                              type="button"
                              onClick={() => handleNav('/nguon-tu-lieu')}
                              className="link-editorial text-left text-[#201F1C]"
                            >
                              {src.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {searchResults.matchedLegal.length > 0 && (
                    <div>
                      <h3 className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#781F25] mb-2">
                        Cẩm nang pháp lý ({searchResults.matchedLegal.length})
                      </h3>
                      <ul className="space-y-1.5 text-sm">
                        {searchResults.matchedLegal.map((l) => (
                          <li key={l.id}>
                            <button
                              type="button"
                              onClick={() => handleNav('/cam-nang-phap-ly')}
                              className="link-editorial text-left text-[#201F1C]"
                            >
                              {l.topic}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Exhibition Canvas */}
      <main className="flex-1 w-full">{children}</main>

      {/* Minimalist Museum Colophon Footer */}
      <footer className="border-t border-[#201F1C]/15 bg-[#F4F1EA]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#201F1C]/10">
            <div className="md:col-span-5 space-y-3">
              <p className="font-display text-xl font-bold tracking-wide text-[#201F1C]">
                DI SẢN SỐ
              </p>
              <p className="text-xs text-[#57524A] leading-relaxed max-w-sm">
                Đề tài J02: Quản lý quyền với tư liệu gia đình và dòng họ. Thực hiện bởi Trần Thanh Bình (PH61165 — Group 1 · IMTA TECH x FPT Polytechnic). Truy cập tự do không cần đăng nhập.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-[#57524A]">
              <div className="space-y-2">
                <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#201F1C]">
                  Triển lãm
                </p>
                <button type="button" onClick={() => handleNav('/tra-cuu')} className="block hover:text-[#781F25]">
                  Kho tư liệu
                </button>
                <button type="button" onClick={() => handleNav('/quyen-so-huu')} className="block hover:text-[#781F25]">
                  Quyền sở hữu
                </button>
                <button type="button" onClick={() => handleNav('/su-dong-y')} className="block hover:text-[#781F25]">
                  Sự đồng ý &amp; Giấy phép
                </button>
                <button type="button" onClick={() => handleNav('/ban-goc-ban-sao')} className="block hover:text-[#781F25]">
                  Bản gốc – Bản sao – Bản số
                </button>
              </div>

              <div className="space-y-2">
                <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#201F1C]">
                  Thủ tục
                </p>
                <button type="button" onClick={() => handleNav('/kiem-tra-quyen')} className="block hover:text-[#781F25]">
                  Kiểm tra quyền
                </button>
                <button type="button" onClick={() => handleNav('/yeu-cau-su-dung')} className="block hover:text-[#781F25]">
                  Yêu cầu sử dụng
                </button>
                <button type="button" onClick={() => handleNav('/khieu-nai-go-bo')} className="block hover:text-[#781F25]">
                  Khiếu nại &amp; Gỡ bỏ
                </button>
                <button type="button" onClick={() => handleNav('/tro-ly-ai')} className="block hover:text-[#781F25]">
                  Trợ lý AI
                </button>
              </div>

              <div className="space-y-2">
                <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#201F1C]">
                  Thư mục
                </p>
                <button type="button" onClick={() => handleNav('/nguon-tu-lieu')} className="block hover:text-[#781F25]">
                  Nguồn đối chiếu
                </button>
                <button type="button" onClick={() => handleNav('/cam-nang-phap-ly')} className="block hover:text-[#781F25]">
                  Cẩm nang pháp lý
                </button>
                <button type="button" onClick={() => handleNav('/gioi-thieu')} className="block hover:text-[#781F25]">
                  Giới thiệu đề tài J02
                </button>
                <button type="button" onClick={() => handleNav('/bao-cao-kiem-thu')} className="block hover:text-[#781F25]">
                  Báo cáo kiểm thử
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#57524A]">
            <p className="font-mono-tabular">
              {records.length} HỒ SƠ CÔNG KHAI · {sources.length} NGUỒN CHÍNH THỨC · KHÔNG YÊU CẦU ĐĂNG NHẬP
            </p>
            <div className="flex items-center gap-3" aria-label="Cỡ chữ đọc">
              <span>Cỡ chữ:</span>
              <button
                type="button"
                onClick={() => updateFontScale(fontScale - 0.1)}
                className="hover:text-[#781F25]"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => updateFontScale(1)}
                className="hover:text-[#781F25]"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => updateFontScale(fontScale + 0.1)}
                className="hover:text-[#781F25]"
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </footer>

      <BackToTopButton />
    </div>
  );
}

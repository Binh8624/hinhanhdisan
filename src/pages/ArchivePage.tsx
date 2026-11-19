import React, { useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { AppRoute, HeritageRecord } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import {
  ORIGINAL_CONDITIONS,
  RECORD_DOCUMENT_TYPES,
  VERIFICATION_LEVELS,
  VERSION_TYPES,
  normalizeVietnameseSearch,
} from '../data/officialSourcesAndLegal';
import { RecordCard } from '../components/RecordCard';

interface ArchivePageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const PAGE_SIZE = 10;

export function ArchivePage({ onNavigate }: ArchivePageProps) {
  const { records, recordFiles, loading, error } = useHeritage();

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCustody, setFilterCustody] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterVersion, setFilterVersion] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [filterDisplayPerm, setFilterDisplayPerm] = useState('all');
  const [filterDownloadPerm, setFilterDownloadPerm] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [sortBy, setSortBy] = useState<'id_asc' | 'title_asc' | 'date_asc'>('id_asc');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewRecord, setQuickViewRecord] = useState<HeritageRecord | null>(null);

  const custodyOptions = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.currentCustodyLocation).filter(Boolean)));
  }, [records]);

  const periodOptions = useMemo(() => {
    return Array.from(new Set(records.map((r) => r.dcDate).filter(Boolean)));
  }, [records]);

  const activeFilterCount = useMemo(() => {
    return [
      filterType,
      filterCustody,
      filterPeriod,
      filterVersion,
      filterCondition,
      filterDisplayPerm,
      filterDownloadPerm,
      filterVerification,
    ].filter((val) => val !== 'all').length;
  }, [
    filterType,
    filterCustody,
    filterPeriod,
    filterVersion,
    filterCondition,
    filterDisplayPerm,
    filterDownloadPerm,
    filterVerification,
  ]);

  const filteredRecords = useMemo(() => {
    const q = normalizeVietnameseSearch(searchText);
    const tokens = q.split(/\s+/).filter(Boolean);

    const matched = records.filter((rec) => {
      if (tokens.length > 0) {
        const haystack = normalizeVietnameseSearch(
          `${rec.dcIdentifier} ${rec.dcTitle} ${rec.dcSubject} ${rec.dcDescription} ${rec.dcCreator} ${rec.currentCustodyLocation} ${rec.dcCoverage} ${rec.dcType}`
        );
        if (!tokens.every((tk) => haystack.includes(tk))) return false;
      }

      if (filterType !== 'all' && rec.dcType !== filterType) return false;
      if (filterCustody !== 'all' && rec.currentCustodyLocation !== filterCustody) return false;
      if (filterPeriod !== 'all' && rec.dcDate !== filterPeriod) return false;
      if (filterVersion !== 'all' && rec.displayedVersionType !== filterVersion) return false;
      if (filterCondition !== 'all' && rec.originalCondition !== filterCondition) return false;
      if (filterDisplayPerm === 'allowed' && !rec.canDisplayImage) return false;
      if (filterDisplayPerm === 'restricted' && rec.canDisplayImage) return false;
      if (filterDownloadPerm === 'allowed' && !rec.canDownload) return false;
      if (filterDownloadPerm === 'restricted' && rec.canDownload) return false;
      if (filterVerification !== 'all' && rec.verificationLevel !== filterVerification) return false;

      return true;
    });

    const sorted = [...matched];
    if (sortBy === 'title_asc') {
      sorted.sort((a, b) => a.dcTitle.localeCompare(b.dcTitle, 'vi'));
    } else if (sortBy === 'date_asc') {
      sorted.sort((a, b) => a.dcDate.localeCompare(b.dcDate, 'vi'));
    } else {
      sorted.sort((a, b) => a.dcIdentifier.localeCompare(b.dcIdentifier, 'vi'));
    }
    return sorted;
  }, [
    records,
    searchText,
    filterType,
    filterCustody,
    filterPeriod,
    filterVersion,
    filterCondition,
    filterDisplayPerm,
    filterDownloadPerm,
    filterVerification,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedRecords = filteredRecords.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const resetFilters = () => {
    setSearchText('');
    setFilterType('all');
    setFilterCustody('all');
    setFilterPeriod('all');
    setFilterVersion('all');
    setFilterCondition('all');
    setFilterDisplayPerm('all');
    setFilterDownloadPerm('all');
    setFilterVerification('all');
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      {/* Monumental Exhibition Catalog Header */}
      <section className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
                EXHIBITION CATALOG · DUBLIN CORE ARCHIVE
              </p>
              <h1
                className="font-display font-bold text-[#201F1C] leading-[1.08]"
                style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.85rem)' }}
              >
                Kho Tư liệu Di sản
              </h1>
              <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
                Danh mục lưu trữ công khai theo chuẩn Dublin Core. Hỗ trợ tìm kiếm không dấu theo nhan đề, mã định danh, nơi lưu giữ và rà soát quyền công bố từng hồ sơ.
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right space-y-1">
              <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#57524A]">
                Tổng số hồ sơ phù hợp
              </p>
              <p className="font-display text-5xl sm:text-6xl font-bold font-mono-tabular text-[#781F25] leading-none">
                {String(filteredRecords.length).padStart(2, '0')}
                <span className="text-xl font-normal text-[#57524A]">
                  {' '}
                  / {String(records.length).padStart(2, '0')}
                </span>
              </p>
            </div>
          </div>

          {/* Minimalist Search Line & Collapsible Filters */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-[#201F1C]/25 pb-3">
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-[#781F25] shrink-0 mr-3" />
                <input
                  type="search"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Tìm nhan đề tư liệu, mã định danh, từ khóa không dấu hoặc nơi lưu giữ..."
                  className="w-full py-2 text-sm sm:text-base bg-transparent text-[#201F1C] placeholder:text-[#57524A]/65 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs shrink-0">
                <select
                  aria-label="Sắp xếp hồ sơ"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="py-1.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="id_asc">Sắp xếp: Mã định danh</option>
                  <option value="title_asc">Sắp xếp: Nhan đề A–Z</option>
                  <option value="date_asc">Sắp xếp: Niên đại</option>
                </select>

                <button
                  type="button"
                  onClick={() => setFiltersExpanded((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 font-medium text-[#201F1C] hover:text-[#781F25] transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#781F25]" />
                  <span>Bộ lọc ({activeFilterCount})</span>
                  {filtersExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {(activeFilterCount > 0 || searchText) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-[#781F25] font-medium hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Đặt lại</span>
                  </button>
                )}
              </div>
            </div>

            {filtersExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2 text-xs">
                <select
                  aria-label="Lọc theo loại tư liệu"
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 bg-transparent border-b border-[#201F1C]/20 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="all">Loại tư liệu: Tất cả</option>
                  {RECORD_DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Lọc theo nơi lưu giữ"
                  value={filterCustody}
                  onChange={(e) => {
                    setFilterCustody(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 bg-transparent border-b border-[#201F1C]/20 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="all">Nơi lưu giữ: Tất cả</option>
                  {custodyOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Lọc theo thời kỳ"
                  value={filterPeriod}
                  onChange={(e) => {
                    setFilterPeriod(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 bg-transparent border-b border-[#201F1C]/20 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="all">Thời kỳ / Niên đại: Tất cả</option>
                  {periodOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Lọc theo loại bản"
                  value={filterVersion}
                  onChange={(e) => {
                    setFilterVersion(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 bg-transparent border-b border-[#201F1C]/20 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="all">Loại bản: Tất cả</option>
                  {VERSION_TYPES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Lọc theo tình trạng bản gốc"
                  value={filterCondition}
                  onChange={(e) => {
                    setFilterCondition(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 bg-transparent border-b border-[#201F1C]/20 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="all">Tình trạng bản gốc: Tất cả</option>
                  {ORIGINAL_CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Lọc theo quyền công bố"
                  value={filterDisplayPerm}
                  onChange={(e) => {
                    setFilterDisplayPerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 bg-transparent border-b border-[#201F1C]/20 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="all">Quyền hiển thị ảnh: Tất cả</option>
                  <option value="allowed">Được phép hiển thị ảnh</option>
                  <option value="restricted">Chưa được phép hiển thị</option>
                </select>

                <select
                  aria-label="Lọc theo quyền tải xuống"
                  value={filterDownloadPerm}
                  onChange={(e) => {
                    setFilterDownloadPerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 bg-transparent border-b border-[#201F1C]/20 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="all">Quyền tải xuống: Tất cả</option>
                  <option value="allowed">Được phép tải theo phạm vi</option>
                  <option value="restricted">Khóa tải xuống</option>
                </select>

                <select
                  aria-label="Lọc theo mức kiểm chứng"
                  value={filterVerification}
                  onChange={(e) => {
                    setFilterVerification(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 bg-transparent border-b border-[#201F1C]/20 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                >
                  <option value="all">Trạng thái xác minh: Tất cả</option>
                  {VERIFICATION_LEVELS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Catalog Editorial List Stream */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-10">
        {loading && records.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#57524A]">
            Đang tải danh mục hồ sơ tư liệu...
          </div>
        ) : error && records.length === 0 ? (
          <div className="border-y border-[#781F25]/40 py-6 text-sm text-[#781F25]">
            {error}
          </div>
        ) : pagedRecords.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <h2 className="font-display text-2xl font-bold text-[#201F1C]">
              Không tìm thấy hồ sơ phù hợp tiêu chí lọc
            </h2>
            <p className="text-sm text-[#57524A] max-w-lg mx-auto leading-relaxed">
              Hãy nới lỏng điều kiện lọc hoặc đặt lại từ khóa tìm kiếm để hiển thị toàn bộ danh mục công khai.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-3 bg-[#781F25] text-[#FBFAF7] text-xs font-medium hover:bg-[#5D171C] transition-colors"
            >
              Xóa bộ lọc &amp; hiển thị tất cả
            </button>
          </div>
        ) : (
          <>
            <div className="border-t border-[#201F1C]/12">
              {pagedRecords.map((rec, idx) => (
                <RecordCard
                  key={rec.id}
                  record={rec}
                  files={recordFiles}
                  indexNumber={(safePage - 1) * PAGE_SIZE + idx + 1}
                  onOpenDetail={(id) => onNavigate('/tu-lieu', id)}
                  onQuickView={(r) => setQuickViewRecord(r)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 text-xs">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="link-editorial font-medium text-[#201F1C] disabled:opacity-35"
                >
                  ← Trang trước
                </button>
                <span className="font-mono-tabular text-[#57524A]">
                  Trang <strong className="text-[#201F1C]">{safePage}</strong> / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="link-editorial font-medium text-[#201F1C] disabled:opacity-35"
                >
                  Trang sau →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Editorial Quick View Drawer/Modal */}
      {quickViewRecord && (
        <div
          className="fixed inset-0 z-50 bg-[#201F1C]/65 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Xem tóm tắt hồ sơ tư liệu"
        >
          <div className="bg-[#FBFAF7] border border-[#201F1C]/20 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-10 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-[#201F1C]/12 pb-5">
              <div>
                <p className="text-xs font-mono-tabular text-[#781F25]">
                  {quickViewRecord.dcIdentifier} · {quickViewRecord.dcType}
                </p>
                <h2 className="font-display text-2xl font-bold text-[#201F1C] mt-1">
                  {quickViewRecord.dcTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setQuickViewRecord(null)}
                aria-label="Đóng xem tóm tắt"
                className="p-2 text-[#57524A] hover:text-[#201F1C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-[#57524A] leading-relaxed">
              {quickViewRecord.dcDescription}
            </p>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs border-y border-[#201F1C]/12 py-5">
              <div>
                <dt className="text-[#57524A]">Nơi lưu giữ hiện nay</dt>
                <dd className="font-semibold text-[#201F1C] mt-1">
                  {quickViewRecord.currentCustodyLocation}
                </dd>
              </div>
              <div>
                <dt className="text-[#57524A]">Loại bản &amp; Tình trạng gốc</dt>
                <dd className="font-semibold text-[#201F1C] mt-1">
                  {quickViewRecord.displayedVersionType} · {quickViewRecord.originalCondition}
                </dd>
              </div>
              <div>
                <dt className="text-[#57524A]">Người cho phép công bố</dt>
                <dd className="font-semibold text-[#781F25] mt-1">
                  {quickViewRecord.publicationAuthorizer}
                </dd>
              </div>
              <div>
                <dt className="text-[#57524A]">Phạm vi &amp; Kiểm chứng</dt>
                <dd className="font-semibold text-[#201F1C] mt-1">
                  {quickViewRecord.allowedScope} ({quickViewRecord.verificationLevel})
                </dd>
              </div>
            </dl>

            <div className="flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={() => setQuickViewRecord(null)}
                className="text-xs text-[#57524A] hover:text-[#201F1C]"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = quickViewRecord.id;
                  setQuickViewRecord(null);
                  onNavigate('/tu-lieu', id);
                }}
                className="px-6 py-2.5 text-xs font-medium bg-[#781F25] text-[#FBFAF7] hover:bg-[#5D171C] inline-flex items-center gap-1.5"
              >
                <span>Mở catalog chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

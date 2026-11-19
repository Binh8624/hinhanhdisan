import React, { useMemo, useState } from 'react';
import { ExternalLink, RefreshCw, Search } from 'lucide-react';
import type { AppRoute, SourceType } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import { normalizeVietnameseSearch } from '../data/officialSourcesAndLegal';

interface SourcesPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const SOURCE_TYPES: SourceType[] = [
  'Nguồn chính thống',
  'Nguồn lưu trữ',
  'Nguồn bảo tàng',
  'Nguồn học thuật',
  'Nguồn xuất bản',
  'Nguồn do người đang lưu giữ cung cấp',
];

export function SourcesPage(_props: SourcesPageProps) {
  const { sources, records } = useHeritage();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [liveResults, setLiveResults] = useState<
    Record<string, { status: string; detail: string }>
  >({});

  const filteredSources = useMemo(() => {
    const q = normalizeVietnameseSearch(searchTerm);
    return sources.filter((s) => {
      if (filterType !== 'all' && s.sourceType !== filterType) return false;
      if (!q) return true;
      return normalizeVietnameseSearch(
        `${s.name} ${s.organizationOrAuthor} ${s.url} ${s.usedContentSummary}`
      ).includes(q);
    });
  }, [sources, searchTerm, filterType]);

  const officialCount = useMemo(
    () => sources.filter((s) => s.isOfficialSource).length,
    [sources]
  );

  const handleCheckLink = async (sourceId: string, sourceUrl: string) => {
    if (!sourceUrl) {
      setLiveResults((prev) => ({
        ...prev,
        [sourceId]: { status: 'Không có URL', detail: 'Nguồn ngoại tuyến chưa có đường dẫn web.' },
      }));
      return;
    }
    setCheckingId(sourceId);
    try {
      const res = await fetch('/api/sources/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: sourceUrl }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        httpStatus?: number | null;
        latencyMs?: number;
        linkStatus?: 'Hoạt động' | 'Không truy cập được';
        message?: string;
        error?: string;
      };
      const nextStatus = data.linkStatus ?? (data.ok ? 'Hoạt động' : 'Không truy cập được');
      setLiveResults((prev) => ({
        ...prev,
        [sourceId]: {
          status: nextStatus,
          detail: data.httpStatus
            ? `HTTP ${data.httpStatus} (${data.latencyMs ?? 0}ms)`
            : data.message || data.error || 'Đã kiểm tra kết nối.',
        },
      }));
    } catch {
      setLiveResults((prev) => ({
        ...prev,
        [sourceId]: { status: 'Không truy cập được', detail: 'Lỗi kết nối máy chủ kiểm tra.' },
      }));
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      {/* Masthead */}
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
              DANH MỤC NGUỒN DẠNG THƯ MỤC · CITATION DIRECTORY
            </p>
            <h1
              className="font-display font-bold text-[#201F1C] leading-[1.08]"
              style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
            >
              Thư viện Nguồn Tư liệu
            </h1>
            <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
              Thư mục nguồn tham khảo phục vụ đối chiếu pháp lý, bảo tàng, lưu trữ và học thuật. Không coi nội dung AI là nguồn, không tự tạo URL con và chỉ xác nhận hoạt động sau kiểm tra thực tế.
            </p>
          </div>

          <div className="flex gap-10 lg:text-right shrink-0">
            <div>
              <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#57524A]">
                Tổng nguồn
              </p>
              <p className="font-display text-4xl font-bold font-mono-tabular text-[#201F1C] mt-1">
                {String(sources.length).padStart(2, '0')}
              </p>
            </div>
            <div>
              <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#57524A]">
                Chính thống
              </p>
              <p className="font-display text-4xl font-bold font-mono-tabular text-[#781F25] mt-1">
                {String(officialCount).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Search & Bibliography Directory */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 lg:py-16 space-y-10">
        <div className="flex flex-col md:flex-row gap-5 border-b border-[#201F1C]/25 pb-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-[#781F25] shrink-0 mr-3" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tra cứu tên nguồn, cơ quan ban hành hoặc tên miền..."
              className="w-full py-2 text-sm sm:text-base bg-transparent text-[#201F1C] placeholder:text-[#57524A]/65 focus:outline-none"
            />
          </div>
          <select
            aria-label="Lọc theo phân loại nguồn"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 bg-transparent border-b border-[#201F1C]/20 md:border-b-0 text-xs sm:text-sm text-[#201F1C] focus:outline-none"
          >
            <option value="all">Tất cả loại nguồn ({sources.length})</option>
            {SOURCE_TYPES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <ol className="divide-y divide-[#201F1C]/12 border-b border-[#201F1C]/12">
          {filteredSources.map((src, idx) => {
            const linkedRecords = records.filter((r) =>
              r.sourceReferenceIds.includes(src.id)
            );
            const live = liveResults[src.id];
            const displayStatus = live?.status || src.linkStatus;

            return (
              <li
                key={src.id}
                className="py-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-2 space-y-1">
                  <span className="font-display text-2xl font-semibold text-[#A58A61]">
                    [{String(idx + 1).padStart(2, '0')}]
                  </span>
                  <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#781F25]">
                    {src.sourceType}
                  </p>
                  <p className="font-mono-tabular text-[11px] text-[#57524A]">
                    {displayStatus}
                  </p>
                </div>

                <div className="lg:col-span-6 space-y-2">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#201F1C] leading-snug">
                    {src.name}
                  </h2>
                  <p className="text-xs font-medium text-[#201F1C]">
                    Cơ quan / Tác giả: {src.organizationOrAuthor}
                  </p>
                  <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed">
                    {src.usedContentSummary}
                  </p>
                  <p className="text-[11px] font-mono-tabular text-[#57524A]">
                    Ngày truy cập: {src.accessedDate} · Hồ sơ liên kết: {linkedRecords.length}
                  </p>
                  {live?.detail && (
                    <p className="text-xs font-mono-tabular text-[#781F25]">
                      Kiểm tra máy chủ: {live.detail}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-4 lg:text-right flex flex-col lg:items-end gap-3 text-xs">
                  {src.url ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-editorial text-[#781F25] font-medium inline-flex items-center gap-1 break-all"
                    >
                      <span>{src.url}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-[#57524A]">Nguồn lưu trữ trực tiếp / chưa có URL</span>
                  )}

                  {src.url && (
                    <button
                      type="button"
                      disabled={checkingId === src.id}
                      onClick={() => void handleCheckLink(src.id, src.url)}
                      className="px-4 py-2 border border-[#201F1C]/20 hover:border-[#781F25] inline-flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 ${checkingId === src.id ? 'animate-spin' : ''}`}
                      />
                      <span>
                        {checkingId === src.id ? 'Đang kiểm tra...' : 'Kiểm tra đường dẫn'}
                      </span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

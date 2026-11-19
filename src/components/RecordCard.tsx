import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { HeritageRecord, RecordFile } from '../types/heritage';

interface RecordCardProps {
  record: HeritageRecord;
  files: RecordFile[];
  indexNumber?: number;
  onOpenDetail: (recordId: string) => void;
  onQuickView?: (record: HeritageRecord) => void;
}

const PUBLIC_CATEGORIES = new Set(['access_copy', 'preservation_copy', 'display_web', 'copy_file']);

/**
 * Museum Editorial Catalog Entry (zero rectangular card-box clutter).
 * Renders authorized museum photography cleanly when cleared, or a light minimalist typographic plate.
 */
export function RecordCard({
  record,
  files,
  indexNumber,
  onOpenDetail,
  onQuickView,
}: RecordCardProps) {
  const filesForRecord = files.filter(
    (f) => f.recordId === record.id && PUBLIC_CATEGORIES.has(f.fileCategory)
  );

  const authorizedFile = filesForRecord.find(
    (f) => f.displayAllowed && f.isPubliclyReadable && Boolean(f.mediaUrl)
  );

  const canShowPhoto =
    record.visibilityStatus === 'public' &&
    record.canDisplayImage &&
    Boolean(authorizedFile?.mediaUrl);

  return (
    <article className="py-7 border-b border-[#201F1C]/12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start group">
      {/* Left: Index & Catalog Code */}
      <div className="lg:col-span-2 flex lg:flex-col justify-between lg:justify-start gap-2">
        {typeof indexNumber === 'number' && (
          <span className="font-display text-3xl sm:text-4xl font-semibold text-[#201F1C]/20 leading-none">
            {String(indexNumber).padStart(2, '0')}
          </span>
        )}
        <span className="font-mono-tabular text-xs font-medium text-[#781F25]">
          {record.dcIdentifier}
        </span>
      </div>

      {/* Center: Editorial Title, Date & Custody */}
      <div className="lg:col-span-6 space-y-2.5">
        <div className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#57524A] flex flex-wrap gap-x-3">
          <span>{record.dcType}</span>
          <span>·</span>
          <span>{record.dcDate}</span>
          <span>·</span>
          <span>{record.displayedVersionType}</span>
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#201F1C] leading-snug group-hover:text-[#781F25] transition-colors">
          <button
            type="button"
            onClick={() => onOpenDetail(record.id)}
            className="text-left"
          >
            {record.dcTitle}
          </button>
        </h3>

        <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed">
          <strong className="font-medium text-[#201F1C]">Lưu giữ:</strong>{' '}
          {record.currentCustodyLocation}
        </p>

        <div className="pt-1 flex flex-wrap items-center gap-5 text-xs">
          <button
            type="button"
            onClick={() => onOpenDetail(record.id)}
            className="link-editorial text-[#781F25] font-semibold inline-flex items-center gap-1.5"
          >
            <span>Mở catalog tư liệu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(record)}
              className="link-editorial text-[#57524A] hover:text-[#201F1C]"
            >
              Xem tóm tắt
            </button>
          )}
        </div>
      </div>

      {/* Right: Authorized Photo Plate OR Clean Typographic Status */}
      <div className="lg:col-span-4 space-y-2 lg:text-right">
        {canShowPhoto && authorizedFile ? (
          <figure className="space-y-1.5 text-left">
            <div className="aspect-[16/10] bg-[#FBFAF7] overflow-hidden border border-[#201F1C]/12">
              <img
                src={authorizedFile.mediaUrl}
                alt={authorizedFile.caption || record.dcTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="text-[11px] text-[#57524A] font-editorial italic line-clamp-1">
              {authorizedFile.caption} — {authorizedFile.sourceCredit}
            </figcaption>
          </figure>
        ) : (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#781F25]">{record.rightsStatus}</p>
            <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#57524A]">
              {record.verificationLevel} · Tải ảnh: {record.canDownload ? 'Theo phạm vi' : 'Khóa'}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

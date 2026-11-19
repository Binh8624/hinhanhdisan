import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Download,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Lock,
} from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import { VERSION_TYPES } from '../data/officialSourcesAndLegal';
import { HairlineRule, UnverifiedImageFrame } from '../components/RoyalMotifs';

interface RecordDetailPageProps {
  recordId: string | null;
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const PUBLIC_CATEGORIES = new Set([
  'access_copy',
  'preservation_copy',
  'display_web',
  'copy_file',
]);

export function RecordDetailPage({ recordId, onNavigate }: RecordDetailPageProps) {
  const {
    records,
    recordFiles,
    recordVersions,
    recordHolders,
    rightsHolders,
    permissions,
    sources,
    verificationLogs,
    consentRecords,
    recordRelationships,
  } = useHeritage();

  const record = useMemo(
    () => records.find((r) => r.id === recordId || r.dcIdentifier === recordId) ?? records[0] ?? null,
    [records, recordId]
  );

  const [viewMode, setViewMode] = useState<'all' | 'Toàn trang' | 'Cận cảnh'>('all');
  const [zoomedFileId, setZoomedFileId] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!record) {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 text-center space-y-5 bg-[#F4F1EA]">
        <h1 className="font-display text-3xl font-bold text-[#201F1C]">
          Không tìm thấy hồ sơ tư liệu được chọn
        </h1>
        <p className="text-sm text-[#57524A]">
          Vui lòng quay lại Kho Tư liệu để chọn hồ sơ trong danh mục công khai.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/tra-cuu')}
          className="px-6 py-3 bg-[#781F25] text-[#FBFAF7] text-xs font-medium"
        >
          Quay về Kho Tư liệu
        </button>
      </div>
    );
  }

  const publicFilesForRecord = recordFiles.filter((f) => {
    if (f.recordId !== record.id || !PUBLIC_CATEGORIES.has(f.fileCategory)) return false;
    if (viewMode === 'all') return true;
    return f.viewScope === viewMode;
  });

  const authorizedDisplayFiles = publicFilesForRecord.filter(
    (f) =>
      record.visibilityStatus === 'public' &&
      record.canDisplayImage &&
      f.displayAllowed &&
      f.isPubliclyReadable &&
      Boolean(f.mediaUrl)
  );

  const versionsForRecord = recordVersions.filter((v) => v.recordId === record.id);
  const holdersForRecord = recordHolders.filter((h) => h.recordId === record.id);
  const rightsHoldersForRecord = rightsHolders.filter((rh) => rh.recordId === record.id);
  const perm = permissions.find((p) => p.recordId === record.id);
  const linkedConsents = consentRecords.filter((c) => c.recordIds.includes(record.id));
  const linkedSources = sources.filter((s) => record.sourceReferenceIds.includes(s.id));
  const vLogs = verificationLogs.filter((v) => v.recordId === record.id);
  const rels = recordRelationships.filter(
    (rel) => rel.sourceRecordId === record.id || rel.targetRecordId === record.id
  );

  const handleDownloadAttempt = (fileUrl: string | undefined, fileAllowed: boolean) => {
    if (!record.canDownload || !fileAllowed || !perm?.allowsDownloadLimited) {
      setDownloadNotice(
        'KHÔNG ĐƯỢC PHÉP TẢI XUỐNG: Tệp ảnh này hiện chưa có văn bản cho phép tải xuống hoặc đang ở trạng thái khóa tải.'
      );
      return;
    }
    if (!fileUrl) {
      setDownloadNotice('Tệp hiển thị chưa có đường dẫn tải xuống hợp lệ.');
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = `${record.dcIdentifier}_access_copy.jpg`;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setDownloadNotice('Đã mở liên kết tải bản giới hạn đúng phạm vi cho phép.');
  };

  const zoomedFile = authorizedDisplayFiles.find((f) => f.id === zoomedFileId);

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      {/* Minimal Contextual Navigation Bar */}
      <div className="border-b border-[#201F1C]/12 bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/tra-cuu')}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#781F25] link-editorial"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kho Tư liệu Di sản</span>
          </button>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <button
              type="button"
              onClick={() => onNavigate('/kiem-tra-quyen')}
              className="link-editorial text-[#201F1C] font-medium"
            >
              Kiểm tra quyền sử dụng
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/yeu-cau-su-dung')}
              className="link-editorial text-[#201F1C]"
            >
              Xin phép sử dụng
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/khieu-nai-go-bo')}
              className="link-editorial text-[#781F25]"
            >
              Khiếu nại / Tạm ẩn
            </button>
          </div>
        </div>
      </div>

      {/* Exhibition Monograph Masthead */}
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-8">
          <div className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#57524A] flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[#781F25] font-semibold">{record.dcIdentifier}</span>
            <span>/</span>
            <span>{record.dcType}</span>
            <span>/</span>
            <span>{record.displayedVersionType}</span>
            <span>/</span>
            <span>Kiểm chứng: {record.verificationLevel}</span>
          </div>

          <h1
            className="font-display font-bold text-[#201F1C] leading-[1.12] max-w-5xl"
            style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.6rem)' }}
          >
            {record.dcTitle}
          </h1>

          <p className="text-base sm:text-lg text-[#57524A] leading-relaxed editorial-measure">
            {record.dcDescription}
          </p>

          {record.publicVerificationBasis && (
            <p className="text-xs sm:text-sm text-[#57524A] border-t border-[#201F1C]/10 pt-4 max-w-4xl leading-relaxed">
              <strong className="text-[#201F1C]">Căn cứ đối chiếu công khai:</strong>{' '}
              {record.publicVerificationBasis}
            </p>
          )}

          {/* Typographic 5-Stage Version Lineage */}
          <div className="pt-4">
            <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-[#57524A] mb-3">
              Định vị phiên bản đang trưng bày
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 border-y border-[#201F1C]/15 divide-y sm:divide-y-0 sm:divide-x divide-[#201F1C]/12">
              {VERSION_TYPES.map((vt, idx) => {
                const isActive = record.displayedVersionType === vt;
                return (
                  <div
                    key={vt}
                    className={`py-3 px-4 text-xs flex items-center justify-between ${
                      isActive ? 'text-[#781F25] font-semibold bg-[#FBFAF7]' : 'text-[#57524A]'
                    }`}
                  >
                    <span>
                      0{idx + 1}. {vt}
                    </span>
                    {isActive && <span className="font-mono-tabular text-[10px]">● HIỆN TẠI</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Monograph Chapters */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 space-y-20">
        {/* EXHIBITION PLATE (Hero display area for record) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#201F1C]/12 pb-4">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                BẢN TRƯNG BÀY HÌNH ẢNH
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C] mt-1">
                Vùng Hiển thị &amp; Kiểm soát Quyền Tệp
              </h2>
            </div>

            <div className="flex items-center gap-5 text-xs shrink-0">
              {(['all', 'Toàn trang', 'Cận cảnh'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`pb-1 border-b-2 transition-colors ${
                    viewMode === mode
                      ? 'border-[#781F25] text-[#781F25] font-semibold'
                      : 'border-transparent text-[#57524A] hover:text-[#201F1C]'
                  }`}
                >
                  {mode === 'all' ? 'Tất cả góc chụp' : mode}
                </button>
              ))}
            </div>
          </div>

          {downloadNotice && (
            <p className="text-xs font-medium text-[#781F25] border-y border-[#781F25]/35 py-3">
              {downloadNotice}
            </p>
          )}

          {publicFilesForRecord.length === 0 ? (
            <UnverifiedImageFrame
              code={record.dcIdentifier}
              reason={
                !record.canDisplayImage
                  ? `Hồ sơ hiện ở trạng thái "${record.rightsStatus}". Hệ thống ẩn vùng hiển thị ảnh khi chưa có văn bản cho phép công bố hợp lệ.`
                  : 'Chưa có tệp hiển thị công khai nào được gắn vào hồ sơ này.'
              }
            />
          ) : (
            <div className="space-y-12">
              {publicFilesForRecord.map((file, idx) => {
                const showMedia =
                  record.visibilityStatus === 'public' &&
                  record.canDisplayImage &&
                  file.displayAllowed &&
                  file.isPubliclyReadable &&
                  Boolean(file.mediaUrl);

                return (
                  <figure
                    key={file.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-[#201F1C]/12 pb-10"
                  >
                    <div className="lg:col-span-7">
                      {showMedia ? (
                        <div className="bg-[#FBFAF7] border border-[#201F1C]/12 p-4">
                          <img
                            src={file.mediaUrl}
                            alt={file.caption}
                            referrerPolicy="no-referrer"
                            className="w-full max-h-[480px] object-contain mx-auto"
                          />
                        </div>
                      ) : (
                        <UnverifiedImageFrame
                          code={`${record.dcIdentifier} · TỆP #${idx + 1}`}
                          reason={
                            file.rightsBasisSummary ||
                            `Trạng thái ảnh: ${file.imageStatus}. Không hiển thị công khai khi thiếu văn bản đồng ý hợp lệ.`
                          }
                        />
                      )}
                    </div>

                    <figcaption className="lg:col-span-5 space-y-4 text-xs sm:text-sm">
                      <div className="flex items-center justify-between border-b border-[#201F1C]/12 pb-2">
                        <span className="font-mono-tabular text-[11px] uppercase tracking-wider text-[#781F25]">
                          {file.fileCategory} · {file.versionType}
                        </span>
                        <span className="font-mono-tabular text-[11px] text-[#57524A]">
                          {file.imageStatus}
                        </span>
                      </div>

                      <p className="font-editorial italic text-base sm:text-lg text-[#201F1C] leading-snug">
                        {file.caption}
                      </p>

                      <dl className="space-y-2 text-xs text-[#57524A]">
                        <div>
                          <dt className="inline font-medium text-[#201F1C]">Nguồn ảnh: </dt>
                          <dd className="inline">{file.sourceCredit}</dd>
                        </div>
                        {file.allowedImageScope && (
                          <div>
                            <dt className="inline font-medium text-[#201F1C]">Phạm vi ảnh: </dt>
                            <dd className="inline">{file.allowedImageScope}</dd>
                          </div>
                        )}
                        {file.photographerOrProvider && (
                          <div>
                            <dt className="inline font-medium text-[#201F1C]">Người chụp / cung cấp: </dt>
                            <dd className="inline">{file.photographerOrProvider}</dd>
                          </div>
                        )}
                        {file.resolution && (
                          <div>
                            <dt className="inline font-medium text-[#201F1C]">Thông số: </dt>
                            <dd className="inline font-mono-tabular">{file.resolution}</dd>
                          </div>
                        )}
                      </dl>

                      <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
                        {showMedia && (
                          <button
                            type="button"
                            onClick={() => setZoomedFileId(file.id)}
                            className="px-4 py-2 border border-[#201F1C]/25 text-[#201F1C] hover:border-[#781F25] inline-flex items-center gap-1.5"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>Phóng to</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDownloadAttempt(file.mediaUrl, file.downloadAllowed)}
                          className={`px-4 py-2 inline-flex items-center gap-1.5 border ${
                            record.canDownload && file.downloadAllowed
                              ? 'bg-[#781F25] border-[#781F25] text-[#FBFAF7] hover:bg-[#5D171C]'
                              : 'border-[#201F1C]/20 text-[#57524A]'
                          }`}
                        >
                          {record.canDownload && file.downloadAllowed ? (
                            <Download className="w-3.5 h-3.5" />
                          ) : (
                            <Lock className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {record.canDownload && file.downloadAllowed
                              ? 'Tải bản giới hạn'
                              : 'Khóa tải xuống'}
                          </span>
                        </button>
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          )}
        </section>

        {/* CHƯƠNG I — Bối cảnh & 15 Trường Dublin Core */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-24">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              CHƯƠNG I
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
              Nhận diện Chuẩn Dublin Core
            </h2>
            <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed">
              15 trường lõi mô tả thư mục quốc tế và đặc tả vật lý được trích xuất theo đúng nguồn kiểm chứng.
            </p>
          </div>

          <dl className="lg:col-span-8 divide-y divide-[#201F1C]/12 border-t border-b border-[#201F1C]/12 text-xs sm:text-sm">
            {[
              ['1. Title (Nhan đề)', record.dcTitle],
              ['2. Creator (Người/cơ quan tạo)', record.dcCreator],
              ['3. Subject (Chủ đề)', record.dcSubject],
              ['4. Description (Mô tả)', record.dcDescription],
              ['5. Publisher (Nơi công bố bản số)', record.dcPublisher],
              ['6. Contributor (Người đóng góp)', record.dcContributor],
              ['7. Date (Niên đại/ngày tháng)', record.dcDate],
              ['8. Type (Loại tư liệu)', record.dcType],
              ['9. Format (Định dạng)', record.dcFormat],
              ['10. Identifier (Mã định danh)', record.dcIdentifier],
              ['11. Source (Nguồn)', record.dcSource],
              ['12. Language (Ngôn ngữ/chữ viết)', record.dcLanguage],
              ['13. Relation (Quan hệ)', record.dcRelation],
              ['14. Coverage (Không gian & thời gian)', record.dcCoverage],
              ['15. Rights (Quyền)', record.dcRights],
              [
                'Kích thước / Chất liệu',
                `${record.dimensions || 'CHƯA XÁC ĐỊNH'} · ${record.material || 'CHƯA XÁC ĐỊNH'}`,
              ],
              ['Đặc điểm nhận dạng', record.identifyingFeatures || 'CHƯA XÁC ĐỊNH'],
            ].map(([label, val]) => (
              <div key={label} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="font-medium text-[#57524A]">{label}</dt>
                <dd className="sm:col-span-2 text-[#201F1C] leading-relaxed">{val}</dd>
              </div>
            ))}
          </dl>
        </section>

        <HairlineRule />

        {/* CHƯƠNG II — Nơi lưu giữ & Phả hệ Phiên bản */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-24">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              CHƯƠNG II
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
              Nơi lưu giữ &amp; Phả hệ Phiên bản
            </h2>
            <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed">
              Tách biệt rõ địa danh hành chính công khai chung (ẩn địa chỉ nhà riêng), tình trạng bản gốc và nguồn gốc bản số.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-[#201F1C] border-b border-[#201F1C]/15 pb-2">
                Hiện trạng Bảo quản &amp; Lưu giữ
              </h3>
              <dl className="divide-y divide-[#201F1C]/10 text-xs sm:text-sm">
                <div className="py-3">
                  <dt className="text-[#57524A]">Nơi lưu giữ hiện nay (công khai chung)</dt>
                  <dd className="font-semibold text-[#201F1C] mt-1">
                    {record.currentCustodyLocation}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-[#57524A]">Địa danh tại thời điểm tư liệu</dt>
                  <dd className="text-[#201F1C] mt-1">{record.historicalCreationLocation}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-[#57524A]">Số đăng ký / tham khảo</dt>
                  <dd className="font-mono-tabular text-[#201F1C] mt-1">
                    {record.registrationNumber}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-[#57524A]">Tình trạng bản gốc</dt>
                  <dd className="font-semibold text-[#781F25] mt-1">{record.originalCondition}</dd>
                </div>
              </dl>

              {holdersForRecord.length > 0 && (
                <div className="pt-2 space-y-2 text-xs">
                  <p className="font-semibold text-[#781F25]">
                    Đơn vị / Dòng họ lưu giữ ({holdersForRecord.length})
                  </p>
                  {holdersForRecord.map((h) => (
                    <p key={h.id} className="text-[#57524A] border-l-2 border-[#A58A61] pl-3 py-1">
                      <strong className="text-[#201F1C]">{h.holderName}</strong> ({h.holderType}) —{' '}
                      {h.publicLocationGeneral}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-[#201F1C] border-b border-[#201F1C]/15 pb-2">
                Quan hệ Bản gốc &amp; Bản số hóa
              </h3>
              <dl className="divide-y divide-[#201F1C]/10 text-xs sm:text-sm">
                <div className="py-3">
                  <dt className="text-[#57524A]">Loại bản đang trình bày</dt>
                  <dd className="font-semibold text-[#781F25] mt-1">
                    {record.displayedVersionType}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-[#57524A]">Quan hệ bản gốc &amp; bản số</dt>
                  <dd className="text-[#201F1C] mt-1">{record.originalDigitalRelation}</dd>
                </div>
                <div className="py-3">
                  <dt className="text-[#57524A]">Đơn vị số hóa &amp; Thời gian</dt>
                  <dd className="text-[#201F1C] mt-1">
                    {record.digitizerName} · {record.digitizationDate}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-[#57524A]">Tệp chủ gốc (bảo quản tách biệt)</dt>
                  <dd className="font-mono-tabular text-xs text-[#201F1C] mt-1">
                    {record.originalFileInfo}
                  </dd>
                </div>
              </dl>

              {versionsForRecord.length > 0 && (
                <div className="pt-2 space-y-2 text-xs">
                  <p className="font-semibold text-[#781F25]">
                    Chuỗi phiên bản ({versionsForRecord.length})
                  </p>
                  {versionsForRecord.map((v) => (
                    <p key={v.id} className="text-[#57524A]">
                      <strong className="text-[#201F1C]">{v.versionType}</strong> ({v.createdDateLabel}) —{' '}
                      {v.derivedFromDescription}
                    </p>
                  ))}
                </div>
              )}

              {rels.length > 0 && (
                <div className="pt-2 space-y-1 text-xs text-[#57524A]">
                  {rels.map((rel) => (
                    <p key={rel.id}>
                      {rel.relationshipType}: {rel.sourceVersionType} → {rel.targetVersionType}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CHƯƠNG III — Dedicated Separated Zone for Ownership & Rights */}
        <section className="bg-[#FBFAF7] border-y border-[#201F1C]/15 -mx-5 sm:-mx-8 px-5 sm:px-8 py-14 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-[#201F1C]/12 pb-6">
            <div className="lg:col-span-8 space-y-2">
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                CHƯƠNG III · KHU VỰC TÁCH BIỆT VỀ QUYỀN &amp; SỰ ĐỒNG Ý
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
                Quyền sở hữu, Chủ thể quyền &amp; Giới hạn khai thác
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="font-mono-tabular text-xs font-semibold text-[#781F25]">
                {record.rightsStatus}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-[#201F1C]/12 pb-8 text-xs sm:text-sm">
            <div>
              <p className="text-[#57524A]">Chủ thể / Cơ quan cho phép công bố</p>
              <p className="font-semibold text-[#201F1C] mt-1">{record.publicationAuthorizer}</p>
              <p className="text-xs text-[#57524A] mt-0.5">Vai trò: {record.authorizerRole}</p>
            </div>
            <div>
              <p className="text-[#57524A]">Ngày đồng ý &amp; Thời hạn</p>
              <p className="font-semibold text-[#201F1C] mt-1">{record.consentDate}</p>
              <p className="text-xs text-[#57524A] mt-0.5">Thời hạn: {record.allowedDuration}</p>
            </div>
            <div>
              <p className="text-[#57524A]">Phạm vi khai thác cho phép</p>
              <p className="font-semibold text-[#781F25] mt-1">{record.allowedScope}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-xs sm:text-sm">
            <div className="space-y-2">
              <h3 className="font-display text-lg font-semibold text-[#201F1C]">
                Điều kiện sử dụng &amp; Hành vi bị cấm
              </h3>
              <p className="text-[#57524A] leading-relaxed">{record.usageConditions}</p>
              {perm?.prohibitedActs && (
                <p className="text-[#781F25] font-medium pt-1">
                  Hành vi bị cấm: {perm.prohibitedActs}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg font-semibold text-[#201F1C]">
                Phần không công bố &amp; Điểm cần bổ sung
              </h3>
              <p className="text-[#57524A] leading-relaxed">
                <strong className="text-[#201F1C]">Không công bố:</strong> {record.nonDisclosedParts}
              </p>
              <p className="text-[#57524A] leading-relaxed">
                <strong className="text-[#201F1C]">Điểm chưa rõ:</strong> {record.uncertainPoints}
              </p>
            </div>
          </div>

          {rightsHoldersForRecord.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#57524A]">
                Chủ thể quyền liên quan ({rightsHoldersForRecord.length})
              </h3>
              <div className="divide-y divide-[#201F1C]/10 border-y border-[#201F1C]/12">
                {rightsHoldersForRecord.map((rh) => (
                  <div key={rh.id} className="py-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <p className="font-semibold text-[#201F1C]">
                      {rh.subjectName} — <span className="text-[#781F25]">{rh.roleType}</span>
                    </p>
                    <p className="text-[#57524A]">Căn cứ: {rh.roleBasis}</p>
                    <p className="text-[#57524A]">
                      {rh.relatedRightsScope} · {rh.verificationStatus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {linkedConsents.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#57524A]">
                Văn bản đồng ý liên kết ({linkedConsents.length})
              </h3>
              <ul className="divide-y divide-[#201F1C]/10 border-y border-[#201F1C]/12">
                {linkedConsents.map((c) => (
                  <li key={c.id} className="py-3 text-xs space-y-1">
                    <p className="font-semibold text-[#201F1C]">
                      {c.consenterName} ({c.consenterRole}) ·{' '}
                      <span className="text-[#781F25]">{c.effectiveStatus}</span>
                    </p>
                    <p className="text-[#57524A]">
                      Ngày ghi nhận: {c.consentDate} · Phạm vi: {c.allowedScopes.join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* CHƯƠNG IV — Kiểm soát Tách biệt 4 Nhóm Tệp */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-2">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              CHƯƠNG IV
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C]">
              Phân tách 4 Nhóm Tệp &amp; Quyền từng ảnh
            </h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-[#201F1C]/12 pt-6 text-xs sm:text-sm">
            <div>
              <p className="font-mono-tabular text-[#781F25] font-semibold">1. original_master</p>
              <p className="text-[#57524A] mt-1 leading-relaxed">
                Tệp bảo quản độ phân giải cao gốc — khóa công khai hoàn toàn để bảo vệ quyền kiểm soát của gia đình/cơ quan giữ bản gốc.
              </p>
            </div>
            <div>
              <p className="font-mono-tabular text-[#781F25] font-semibold">2. preservation_copy</p>
              <p className="text-[#57524A] mt-1 leading-relaxed">
                Bản lưu dự phòng dài hạn cho công tác bảo tồn học thuật, không tự động cấp liên kết tải trực tiếp.
              </p>
            </div>
            <div>
              <p className="font-mono-tabular text-[#201F1C] font-semibold">3. access_copy</p>
              <p className="text-[#57524A] mt-1 leading-relaxed">
                Bản phục vụ tra cứu web — chỉ hiển thị khi đồng thời bật cờ <code>canDisplayImage</code> và tệp được gắn văn bản cho phép.
              </p>
            </div>
            <div>
              <p className="font-mono-tabular text-[#201F25] font-semibold">4. rights_evidence</p>
              <p className="text-[#57524A] mt-1 leading-relaxed">
                Chứng từ đồng ý hoặc biên bản xác minh — ẩn khỏi web công khai để tránh lộ thông tin cá nhân người ký.
              </p>
            </div>
          </div>
        </section>

        <HairlineRule />

        {/* CHƯƠNG V — Tài liệu tham khảo & Lịch sử quyền */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                CHƯƠNG V · TÀI LIỆU THAM KHẢO
              </p>
              <h2 className="font-display text-2xl font-bold text-[#201F1C] mt-1">
                Thư mục Nguồn Đối chiếu
              </h2>
            </div>
            <p className="text-xs text-[#57524A]">
              Mức kiểm chứng: <strong className="text-[#201F1C]">{record.verificationLevel}</strong> ·{' '}
              {record.verifierName} · Cập nhật: {record.verificationDate}
            </p>
            {linkedSources.length === 0 ? (
              <p className="text-xs text-[#781F25]">
                CHƯA KIỂM CHỨNG NGUỒN — Chưa liên kết đủ nguồn từ thư viện nguồn.
              </p>
            ) : (
              <ol className="divide-y divide-[#201F1C]/10 border-y border-[#201F1C]/12">
                {linkedSources.map((s, idx) => (
                  <li key={s.id} className="py-3.5 text-xs space-y-1">
                    <p className="font-semibold text-[#201F1C]">
                      [{idx + 1}] {s.name}
                    </p>
                    <p className="text-[#57524A]">
                      {s.organizationOrAuthor} · {s.sourceType} · {s.linkStatus}
                    </p>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#781F25] hover:underline inline-flex items-center gap-1 break-all"
                      >
                        <span>{s.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                LỊCH SỬ QUYỀN &amp; ĐÍNH CHÍNH
              </p>
              <h2 className="font-display text-2xl font-bold text-[#201F1C] mt-1">
                Diễn biến Trạng thái
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed">
              {record.rightsHistorySummary}
            </p>
            {vLogs.length > 0 && (
              <ul className="divide-y divide-[#201F1C]/10 border-y border-[#201F1C]/12 text-xs">
                {vLogs.map((v) => (
                  <li key={v.id} className="py-3">
                    <p className="font-medium text-[#201F1C]">
                      {v.previousLevel} → {v.newLevel} ({v.verifiedAt.slice(0, 10)})
                    </p>
                    <p className="text-[#57524A] mt-0.5">{v.notes}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/khieu-nai-go-bo')}
                className="link-editorial text-xs font-semibold text-[#781F25]"
              >
                Gửi yêu cầu tạm ẩn, gỡ bỏ hoặc đính chính thông tin hồ sơ này →
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox for authorized museum images */}
      {zoomedFile && (
        <div
          className="fixed inset-0 z-50 bg-[#201F1C]/92 flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Phóng to hình ảnh tư liệu"
        >
          <div className="max-w-5xl w-full flex items-center justify-between text-[#FBFAF7] pb-3">
            <p className="text-sm font-editorial italic">{zoomedFile.caption}</p>
            <button
              type="button"
              onClick={() => setZoomedFileId(null)}
              className="px-3.5 py-2 border border-[#A58A61] text-xs inline-flex items-center gap-1.5"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              <span>Thu gọn</span>
            </button>
          </div>
          <img
            src={zoomedFile.mediaUrl}
            alt={zoomedFile.caption}
            referrerPolicy="no-referrer"
            className="max-h-[80vh] max-w-full object-contain"
          />
          <p className="text-xs text-[#A58A61] pt-3">
            Nguồn: {zoomedFile.sourceCredit} · Bản hiển thị: {zoomedFile.versionType} ·{' '}
            {zoomedFile.imageStatus}
          </p>
        </div>
      )}
    </div>
  );
}

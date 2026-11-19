import React, { useMemo, useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  HelpCircle,
  Ban,
  ArrowRight,
} from 'lucide-react';
import type { AppRoute, RightsVerdict, VersionType } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import { RECORD_DOCUMENT_TYPES, VERSION_TYPES } from '../data/officialSourcesAndLegal';

interface RightsCheckerPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

interface DiagnosticResult {
  verdict: RightsVerdict;
  reasons: string[];
  matchedData: string[];
  existingEvidence: string[];
  allowedScopeList: string[];
  prohibitedScopeList: string[];
  nextSteps: string[];
  legalReferences: string[];
}

export function RightsCheckerPage({ onNavigate }: RightsCheckerPageProps) {
  const { records, permissions, consentRecords } = useHeritage();

  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [docType, setDocType] = useState(RECORD_DOCUMENT_TYPES[0]);
  const [custodyPlace, setCustodyPlace] = useState('Gia đình / Dòng họ');
  const [versionWanted, setVersionWanted] = useState<VersionType>('Bản số của bản gốc');
  const [purpose, setPurpose] = useState('Học tập / Nghiên cứu phi lợi nhuận');
  const [usageFormat, setUsageFormat] = useState('Minh họa trong báo cáo hoặc website học thuật');
  const [wantDownload, setWantDownload] = useState(false);
  const [wantEdit, setWantEdit] = useState(false);
  const [wantPrint, setWantPrint] = useState(false);
  const [isCommercial, setIsCommercial] = useState(false);
  const [hasConsentInput, setHasConsentInput] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [hasEvidenceInput, setHasEvidenceInput] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [scopeCoversPurpose, setScopeCoversPurpose] = useState<'yes' | 'no' | 'unknown'>('unknown');
  const [evaluated, setEvaluated] = useState(false);

  const selectedRecord = useMemo(
    () => records.find((r) => r.id === selectedRecordId) ?? null,
    [records, selectedRecordId]
  );

  const handleSelectRecord = (id: string) => {
    setSelectedRecordId(id);
    setEvaluated(false);
    const rec = records.find((r) => r.id === id);
    if (rec) {
      setDocType(rec.dcType);
      setCustodyPlace(rec.currentCustodyLocation);
      setVersionWanted(rec.displayedVersionType);
    }
  };

  const result: DiagnosticResult | null = useMemo(() => {
    if (!evaluated) return null;

    const matchedPerm = selectedRecord
      ? permissions.find((p) => p.recordId === selectedRecord.id)
      : undefined;
    const matchedConsents = selectedRecord
      ? consentRecords.filter((c) => c.recordIds.includes(selectedRecord.id))
      : [];

    const activeConsent = matchedConsents.find(
      (c) =>
        c.effectiveStatus !== 'Đã rút lại' &&
        c.effectiveStatus !== 'Hết hiệu lực' &&
        c.effectiveStatus !== 'Không cho phép sử dụng' &&
        c.effectiveStatus !== 'Chưa đủ bằng chứng'
    );
    const withdrawnConsent = matchedConsents.find(
      (c) => c.effectiveStatus === 'Đã rút lại'
    );

    const reasons: string[] = [];
    const matchedData: string[] = [];
    const existingEvidence: string[] = [];
    const allowedScopeList: string[] = [];
    const prohibitedScopeList: string[] = [];
    const nextSteps: string[] = [];
    const legalReferences = [
      'Luật Di sản văn hóa số 45/2024/QH15 (Chương IV, Điều 53–63 — Đã đối chiếu cổng CSDL Văn bản Chính phủ)',
      'Văn bản hợp nhất số 160/2026/VBHN-LQ-VPQH: Luật Sở hữu trí tuệ (CSDL Văn bản Chính phủ)',
      'Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (Bảo vệ thông tin cá nhân trong tư liệu)',
      'Quy chuẩn quản lý quyền và bản sao đề tài J02 — Di Sản Số',
    ];

    if (selectedRecord) {
      matchedData.push(
        `Hồ sơ: ${selectedRecord.dcIdentifier} — ${selectedRecord.dcTitle}`,
        `Loại bản trên hệ thống: ${selectedRecord.displayedVersionType} | Trạng thái quyền: ${selectedRecord.rightsStatus}`,
        `Người cho phép công bố: ${selectedRecord.publicationAuthorizer} (${selectedRecord.authorizerRole})`,
        `Mức kiểm chứng: ${selectedRecord.verificationLevel}`
      );
      if (activeConsent) {
        existingEvidence.push(
          `Bản ghi đồng ý ${activeConsent.id}: ${activeConsent.consenterName} (${activeConsent.consentDate}) — ${activeConsent.evidenceSummary}`
        );
      } else {
        existingEvidence.push('Chưa có văn bản đồng ý còn hiệu lực trong cơ sở dữ liệu.');
      }
    } else {
      matchedData.push(
        `Khai báo chẩn đoán: ${docType} · Lưu giữ tại: ${custodyPlace} · Bản sử dụng: ${versionWanted}`,
        `Mục đích: ${purpose} | Hình thức: ${usageFormat}`
      );
      existingEvidence.push(
        hasEvidenceInput === 'yes'
          ? 'Người tra cứu khai báo đang có văn bản đồng ý (cần đối chiếu trực tiếp bản gốc khi gửi yêu cầu).'
          : 'Chưa có bằng chứng văn bản được ghi nhận trong cơ sở dữ liệu công khai.'
      );
    }

    if (isCommercial) {
      prohibitedScopeList.push('Khai thác thương mại (bán tư liệu, quảng cáo, sản phẩm thu phí).');
      reasons.push(
        'Dự án Di Sản Số mang tính chất phi lợi nhuận và không tự động cấp phép mục đích thương mại. Nếu hồ sơ không có hợp đồng/chấp thuận thương mại riêng từ chủ thể quyền, hành vi này không được phép.'
      );
      if (selectedRecord && !matchedPerm?.allowsCommercial) {
        return {
          verdict: 'KHÔNG ĐƯỢC PHÉP',
          reasons,
          matchedData,
          existingEvidence,
          allowedScopeList: ['Xem thông tin mô tả công khai (nếu hồ sơ đang công bố).'],
          prohibitedScopeList,
          nextSteps: [
            'Không sử dụng hình ảnh cho mục đích thương mại.',
            'Nếu cần thỏa thuận bản quyền riêng ngoài phạm vi phi lợi nhuận, liên hệ trực tiếp chủ sở hữu hợp pháp.',
          ],
          legalReferences,
        };
      }
    }

    if (
      withdrawnConsent ||
      selectedRecord?.visibilityStatus === 'takedown_pending' ||
      selectedRecord?.rightsStatus === 'Đã rút lại' ||
      matchedPerm?.status === 'Không cho phép sử dụng' ||
      matchedPerm?.status === 'Đã rút lại'
    ) {
      reasons.push(
        'Hồ sơ đang ở trạng thái ĐÃ RÚT LẠI SỰ ĐỒNG Ý hoặc KHÔNG CHO PHÉP SỬ DỤNG. Mọi quyền hiển thị và khai thác đã bị đình chỉ.'
      );
      prohibitedScopeList.push('Hiển thị hình ảnh', 'Tải xuống', 'Chỉnh sửa', 'In ấn', 'Tái sử dụng');
      return {
        verdict: 'KHÔNG ĐƯỢC PHÉP',
        reasons,
        matchedData,
        existingEvidence,
        allowedScopeList: ['Không có phạm vi khai thác nào được chấp thuận.'],
        prohibitedScopeList,
        nextSteps: [
          'Ngừng ngay việc sử dụng hoặc sao chép hình ảnh liên quan.',
          'Theo dõi thông tin cập nhật công khai trên hồ sơ hoặc gửi yêu cầu đính chính tại trang Khiếu nại & Gỡ bỏ.',
        ],
        legalReferences,
      };
    }

    if (selectedRecord && matchedPerm) {
      if (wantEdit && !matchedPerm.allowsEdit) {
        prohibitedScopeList.push('Chỉnh sửa, cắt ghép hoặc làm sai lệch nội dung tư liệu.');
      }
      if (wantPrint && !matchedPerm.allowsPrint) {
        prohibitedScopeList.push('In ấn, xuất bản ấn phẩm giấy.');
      }
      if (wantDownload && !selectedRecord.canDownload && !matchedPerm.allowsDownloadLimited) {
        prohibitedScopeList.push('Tải xuống tệp ảnh.');
      }

      if (
        (wantEdit && !matchedPerm.allowsEdit) ||
        (wantPrint && !matchedPerm.allowsPrint)
      ) {
        if (matchedPerm.status === 'Chỉ cho phép xem') {
          reasons.push(
            'Hồ sơ hiện chỉ cho phép xem trên nền tảng, không cho phép tải xuống, chỉnh sửa hoặc in ấn.'
          );
          return {
            verdict: 'CHỈ ĐƯỢC XEM',
            reasons,
            matchedData,
            existingEvidence,
            allowedScopeList: ['Xem trực tuyến trên trang hồ sơ (không tải/sao chép).'],
            prohibitedScopeList,
            nextSteps: [
              'Chỉ tham khảo thông tin và hình ảnh trực tiếp trên website (nếu được phép hiển thị).',
              'Gửi đơn xin phép bổ sung nếu có nhu cầu in ấn hoặc sử dụng trong ấn phẩm.',
            ],
            legalReferences,
          };
        }
        reasons.push(
          'Hành vi dự kiến (chỉnh sửa hoặc in ấn) vượt quá phạm vi đang được phép trong dữ liệu quyền của hồ sơ.'
        );
        return {
          verdict: 'CẦN XIN PHÉP',
          reasons,
          matchedData,
          existingEvidence,
          allowedScopeList: [selectedRecord.allowedScope],
          prohibitedScopeList,
          nextSteps: [
            'Gửi mẫu yêu cầu xin phép bổ sung phạm vi sử dụng tại trang Yêu cầu sử dụng tư liệu.',
            'Liên hệ đúng chủ thể quyền (gia đình, dòng họ hoặc bảo tàng lưu giữ) để xin văn bản chấp thuận.',
          ],
          legalReferences,
        };
      }
    }

    if (selectedRecord) {
      const hasValidVerifier = selectedRecord.verificationLevel === 'Đã kiểm';
      const hasValidAuthorizer =
        Boolean(selectedRecord.publicationAuthorizer) &&
        !selectedRecord.publicationAuthorizer.toUpperCase().includes('CHƯA') &&
        !selectedRecord.publicationAuthorizer.toUpperCase().includes('KHÔNG');

      if (!hasValidVerifier || !hasValidAuthorizer || !activeConsent) {
        reasons.push(
          'Dữ liệu hiện có chưa đủ văn bản đồng ý hợp lệ hoặc chưa hoàn tất bước kiểm chứng đối chiếu nguồn.'
        );
        prohibitedScopeList.push('Hiển thị hình ảnh tự do', 'Tải xuống tệp độ phân giải cao', 'In ấn / xuất bản');
        return {
          verdict: 'CHƯA ĐỦ BẰNG CHỨNG',
          reasons,
          matchedData,
          existingEvidence,
          allowedScopeList: ['Xem siêu dữ liệu mô tả công khai (nếu hồ sơ công khai).'],
          prohibitedScopeList,
          nextSteps: [
            'Không tự ý suy đoán quyền sử dụng khi thiếu bằng chứng.',
            'Kiểm tra lại danh sách chủ thể quyền và gửi yêu cầu xin phép tới người đang lưu giữ/chủ sở hữu.',
          ],
          legalReferences,
        };
      }

      if (matchedPerm?.status === 'Chỉ cho phép xem' && wantDownload) {
        reasons.push(
          'Hồ sơ chỉ cấp quyền xem trực tuyến, không cho phép tải xuống tệp ảnh.'
        );
        return {
          verdict: 'CHỈ ĐƯỢC XEM',
          reasons,
          matchedData,
          existingEvidence,
          allowedScopeList: ['Xem hình ảnh hiển thị trên website kèm chú thích và nguồn.'],
          prohibitedScopeList: ['Tải xuống tệp ảnh', 'Chỉnh sửa', 'Khai thác thương mại'],
          nextSteps: [
            'Tham khảo trực tiếp trên website và trích dẫn đúng mã định danh.',
            'Nếu cần tải bản phục vụ nghiên cứu, gửi mẫu yêu cầu xin phép.',
          ],
          legalReferences,
        };
      }

      if (
        selectedRecord.canDisplayImage &&
        (!wantDownload || selectedRecord.canDownload) &&
        (!wantEdit || matchedPerm?.allowsEdit) &&
        (!wantPrint || matchedPerm?.allowsPrint) &&
        !isCommercial
      ) {
        reasons.push(
          'Hồ sơ đã được kiểm chứng, có văn bản đồng ý còn hiệu lực và mục đích sử dụng nằm trong phạm vi cho phép.'
        );
        allowedScopeList.push(selectedRecord.allowedScope);
        if (selectedRecord.canDownload) allowedScopeList.push('Tải bản hiển thị giới hạn');
        if (matchedPerm?.allowsStudy) allowedScopeList.push('Sử dụng trong học tập');
        if (matchedPerm?.allowsResearch) allowedScopeList.push('Sử dụng trong nghiên cứu');

        prohibitedScopeList.push('Sử dụng thương mại', 'Trình bày bản sao/bản số như bản gốc');
        return {
          verdict: 'ĐƯỢC PHÉP THEO PHẠM VI ĐÃ XÁC NHẬN',
          reasons,
          matchedData,
          existingEvidence,
          allowedScopeList,
          prohibitedScopeList,
          nextSteps: [
            `Ghi đầy đủ chú thích loại bản (${selectedRecord.displayedVersionType}), nguồn (${selectedRecord.dcSource}) và người cho phép (${selectedRecord.publicationAuthorizer}).`,
            'Tuân thủ mọi điều kiện đi kèm và ngừng sử dụng nếu chủ thể rút lại đồng ý.',
          ],
          legalReferences,
        };
      }
    }

    if (hasConsentInput === 'no' || scopeCoversPurpose === 'no') {
      reasons.push(
        'Chưa có sự đồng ý của người có thẩm quyền hoặc mục đích dự kiến chưa nằm trong phạm vi đã được đồng ý.'
      );
      return {
        verdict: 'CẦN XIN PHÉP',
        reasons,
        matchedData,
        existingEvidence,
        allowedScopeList: ['Chỉ tra cứu thông tin mô tả chung nếu đã công bố công khai.'],
        prohibitedScopeList: ['Đăng tải hình ảnh', 'Tải và phân phối lại', 'In ấn', 'Chỉnh sửa'],
        nextSteps: [
          'Xác định đúng chủ thể có quyền cho phép công bố (chủ sở hữu vật mang tin, đại diện dòng họ, hoặc bảo tàng).',
          'Gửi mẫu yêu cầu sử dụng hình ảnh tại trang Yêu cầu sử dụng tư liệu.',
        ],
        legalReferences,
      };
    }

    if (
      hasConsentInput === 'yes' &&
      hasEvidenceInput === 'yes' &&
      scopeCoversPurpose === 'yes' &&
      !isCommercial
    ) {
      reasons.push(
        'Theo thông tin bạn khai báo, đã có sự đồng ý, có bằng chứng văn bản và mục đích nằm trong phạm vi được phép. Tuy nhiên, nếu tư liệu chưa được nạp và xác minh trên Di Sản Số, kết quả này chỉ mang tính tự đối chiếu ban đầu.'
      );
      return {
        verdict: 'ĐƯỢC PHÉP THEO PHẠM VI ĐÃ XÁC NHẬN',
        reasons,
        matchedData,
        existingEvidence,
        allowedScopeList: [`Sử dụng theo đúng phạm vi ghi trong văn bản đồng ý (${purpose}).`],
        prohibitedScopeList: ['Mục đích thương mại ngoài văn bản đồng ý', 'Che giấu nguồn hoặc loại bản'],
        nextSteps: [
          'Lưu giữ bản sao văn bản đồng ý và trích dẫn rõ mã hồ sơ, nguồn cung cấp khi công bố.',
          'Ghi đầy đủ nguồn gốc, loại bản và chú thích bên dưới hình ảnh.',
        ],
        legalReferences,
      };
    }

    reasons.push(
      'Không đủ dữ liệu hoặc bằng chứng xác nhận (trạng thái sự đồng ý, bằng chứng hoặc phạm vi còn chưa rõ).'
    );
    return {
      verdict: 'CHƯA ĐỦ BẰNG CHỨNG',
      reasons,
      matchedData,
      existingEvidence,
      allowedScopeList: ['Chưa thể xác nhận phạm vi được phép.'],
      prohibitedScopeList: ['Đăng tải công khai hoặc khai thác hình ảnh khi chưa đủ căn cứ.'],
      nextSteps: [
        'Thu thập thêm văn bản đồng ý, biên bản họp họ hoặc công văn từ đơn vị lưu giữ.',
        'Tham khảo mục Yêu cầu sử dụng tư liệu để chuẩn bị hồ sơ liên hệ.',
      ],
      legalReferences,
    };
  }, [
    evaluated,
    selectedRecord,
    permissions,
    consentRecords,
    docType,
    custodyPlace,
    versionWanted,
    purpose,
    usageFormat,
    wantDownload,
    wantEdit,
    wantPrint,
    isCommercial,
    hasConsentInput,
    hasEvidenceInput,
    scopeCoversPurpose,
  ]);

  const verdictIcon = (v: RightsVerdict) => {
    switch (v) {
      case 'ĐƯỢC PHÉP THEO PHẠM VI ĐÃ XÁC NHẬN':
        return <ShieldCheck className="w-6 h-6 text-[#201F1C]" />;
      case 'CẦN XIN PHÉP':
        return <AlertTriangle className="w-6 h-6 text-[#781F25]" />;
      case 'CHỈ ĐƯỢC XEM':
        return <Eye className="w-6 h-6 text-[#57524A]" />;
      case 'CHƯA ĐỦ BẰNG CHỨNG':
        return <HelpCircle className="w-6 h-6 text-[#57524A]" />;
      case 'KHÔNG ĐƯỢC PHÉP':
        return <Ban className="w-6 h-6 text-[#781F25]" />;
    }
  };

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-5">
          <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
            BÀN ĐỐI CHIẾU CHUYÊN MÔN · 12 TIÊU CHÍ
          </p>
          <h1
            className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-4xl"
            style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
          >
            Kiểm tra Quyền Sử dụng Hình ảnh Di sản
          </h1>
          <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
            Đối chiếu nhu cầu khai thác của bạn với dữ liệu quyền sở hữu, loại bản và văn bản đồng ý hiện có. Công cụ hỗ trợ rà soát nghiệp vụ, không thay thế kết luận của cơ quan nhà nước có thẩm quyền.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Underline-styled 12 Parameters */}
        <section className="lg:col-span-5 space-y-6">
          <h2 className="font-display text-2xl font-bold text-[#201F1C] border-b border-[#201F1C]/12 pb-3">
            Thông số Nhu cầu Sử dụng
          </h2>

          <div className="space-y-5 text-xs sm:text-sm">
            <div>
              <label className="block font-medium text-[#201F1C] mb-1">
                Bước 1. Chọn hồ sơ tư liệu trong CSDL (nếu đã nạp)
              </label>
              <select
                value={selectedRecordId}
                onChange={(e) => handleSelectRecord(e.target.value)}
                className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
              >
                <option value="">-- Tự kiểm tra theo kịch bản khai báo bên dưới --</option>
                {records.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.dcIdentifier} — {r.dcTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">Loại tư liệu</label>
                <select
                  value={docType}
                  onChange={(e) => {
                    setDocType(e.target.value);
                    setEvaluated(false);
                  }}
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C]"
                >
                  {RECORD_DOCUMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">Nơi lưu giữ</label>
                <input
                  type="text"
                  value={custodyPlace}
                  onChange={(e) => {
                    setCustodyPlace(e.target.value);
                    setEvaluated(false);
                  }}
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">Bản muốn sử dụng</label>
                <select
                  value={versionWanted}
                  onChange={(e) => {
                    setVersionWanted(e.target.value as VersionType);
                    setEvaluated(false);
                  }}
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C]"
                >
                  {VERSION_TYPES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium text-[#201F1C] mb-1">Mục đích sử dụng</label>
                <select
                  value={purpose}
                  onChange={(e) => {
                    setPurpose(e.target.value);
                    setEvaluated(false);
                  }}
                  className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C]"
                >
                  <option value="Học tập / Nghiên cứu phi lợi nhuận">
                    Học tập / Nghiên cứu phi lợi nhuận
                  </option>
                  <option value="Trưng bày / Triển lãm văn hóa cộng đồng">
                    Trưng bày / Triển lãm văn hóa cộng đồng
                  </option>
                  <option value="Xuất bản sách / Báo chí">Xuất bản sách / Báo chí</option>
                  <option value="Lưu trữ nội bộ gia đình / dòng họ">
                    Lưu trữ nội bộ gia đình / dòng họ
                  </option>
                  <option value="Khai thác thương mại">Khai thác thương mại</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#201F1C] mb-1">
                Hình thức sử dụng cụ thể
              </label>
              <input
                type="text"
                value={usageFormat}
                onChange={(e) => {
                  setUsageFormat(e.target.value);
                  setEvaluated(false);
                }}
                className="w-full py-2.5 bg-transparent border-b border-[#201F1C]/25 text-[#201F1C] focus:outline-none focus:border-[#781F25]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#201F1C]/12">
              {[
                { label: 'Muốn tải ảnh?', state: wantDownload, set: setWantDownload },
                { label: 'Muốn chỉnh sửa?', state: wantEdit, set: setWantEdit },
                { label: 'Muốn in ấn?', state: wantPrint, set: setWantPrint },
                { label: 'Mục đích thương mại?', state: isCommercial, set: setIsCommercial },
              ].map((item) => (
                <label key={item.label} className="flex items-center gap-2.5 py-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={item.state}
                    onChange={(e) => {
                      item.set(e.target.checked);
                      setEvaluated(false);
                    }}
                  />
                  <span className="text-[#201F1C]">{item.label}</span>
                </label>
              ))}
            </div>

            {!selectedRecord && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#201F1C]/12">
                <div>
                  <label className="block text-xs font-medium mb-1">Đã có đồng ý?</label>
                  <select
                    value={hasConsentInput}
                    onChange={(e) => {
                      setHasConsentInput(e.target.value as typeof hasConsentInput);
                      setEvaluated(false);
                    }}
                    className="w-full py-2 text-xs bg-transparent border-b border-[#201F1C]/25"
                  >
                    <option value="unknown">Chưa rõ</option>
                    <option value="yes">Đã có</option>
                    <option value="no">Chưa có</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Có bằng chứng?</label>
                  <select
                    value={hasEvidenceInput}
                    onChange={(e) => {
                      setHasEvidenceInput(e.target.value as typeof hasEvidenceInput);
                      setEvaluated(false);
                    }}
                    className="w-full py-2 text-xs bg-transparent border-b border-[#201F1C]/25"
                  >
                    <option value="unknown">Chưa rõ</option>
                    <option value="yes">Có văn bản</option>
                    <option value="no">Không có</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Phạm vi bao gồm?</label>
                  <select
                    value={scopeCoversPurpose}
                    onChange={(e) => {
                      setScopeCoversPurpose(e.target.value as typeof scopeCoversPurpose);
                      setEvaluated(false);
                    }}
                    className="w-full py-2 text-xs bg-transparent border-b border-[#201F1C]/25"
                  >
                    <option value="unknown">Chưa rõ</option>
                    <option value="yes">Có bao gồm</option>
                    <option value="no">Không bao gồm</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setEvaluated(true)}
              className="w-full py-3.5 bg-[#781F25] text-[#FBFAF7] text-xs sm:text-sm font-medium hover:bg-[#5D171C] transition-colors"
            >
              Đối chiếu &amp; Chẩn đoán Quyền Sử dụng
            </button>
          </div>
        </section>

        {/* Right: Monumental Diagnostic Verdict Panel */}
        <section className="lg:col-span-7 bg-[#FBFAF7] border-y border-[#201F1C]/15 p-6 sm:p-10 space-y-6">
          {!result ? (
            <div className="py-16 text-center space-y-3">
              <ShieldCheck className="w-9 h-9 text-[#A58A61] mx-auto" />
              <h2 className="font-display text-2xl font-bold text-[#201F1C]">
                Sẵn sàng đối chiếu điều kiện quyền
              </h2>
              <p className="text-xs sm:text-sm text-[#57524A] max-w-md mx-auto leading-relaxed">
                Chọn hồ sơ tư liệu (hoặc khai báo thông số bên trái) và nhấn “Đối chiếu &amp; Chẩn đoán Quyền Sử dụng” để nhận kết luận 7 phần kèm căn cứ.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-[#781F25]/35 pb-5 flex items-start gap-4">
                {verdictIcon(result.verdict)}
                <div>
                  <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#57524A]">
                    KẾT LUẬN ĐỐI CHIẾU
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#781F25] mt-0.5">
                    {result.verdict}
                  </h2>
                </div>
              </div>

              <div className="space-y-5 text-xs sm:text-sm">
                <div>
                  <h3 className="font-semibold text-[#201F1C] mb-1">1. Vì sao có kết quả này</h3>
                  <ul className="list-disc pl-4 space-y-1 text-[#57524A]">
                    {result.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[#201F1C] mb-1">
                    2. Dữ liệu được dùng để đối chiếu
                  </h3>
                  <ul className="list-disc pl-4 space-y-1 text-[#57524A]">
                    {result.matchedData.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[#201F1C] mb-1">3. Bằng chứng đang có</h3>
                  <ul className="list-disc pl-4 space-y-1 text-[#57524A]">
                    {result.existingEvidence.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-y border-[#201F1C]/12 py-4">
                  <div>
                    <h4 className="font-semibold text-[#201F1C] mb-1">4. Phạm vi được phép</h4>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-[#57524A]">
                      {result.allowedScopeList.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#781F25] mb-1">5. Phạm vi chưa được phép</h4>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-[#57524A]">
                      {result.prohibitedScopeList.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#201F1C] mb-1">
                    6. Người dùng cần làm gì tiếp theo
                  </h3>
                  <ul className="list-disc pl-4 space-y-1 text-[#57524A]">
                    {result.nextSteps.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[#201F1C] mb-1">
                    7. Nguồn &amp; điều khoản tham chiếu
                  </h3>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-[#57524A]">
                    {result.legalReferences.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#201F1C]/12 flex flex-wrap gap-5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => onNavigate('/yeu-cau-su-dung')}
                    className="link-editorial text-[#781F25] inline-flex items-center gap-1"
                  >
                    <span>Đi tới trang Yêu cầu sử dụng</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/khieu-nai-go-bo')}
                    className="link-editorial text-[#201F1C]"
                  >
                    Khiếu nại / Gỡ bỏ
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('/tro-ly-ai')}
                    className="link-editorial text-[#57524A]"
                  >
                    Tra cứu thêm với AI học thuật
                  </button>
                </div>

                <p className="text-[11px] text-[#57524A] italic">
                  Lưu ý: Kết quả hỗ trợ tra cứu dựa trên dữ liệu đã ghi nhận, không thay thế tư vấn pháp lý chính thức hoặc kết luận của cơ quan nhà nước có thẩm quyền.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';
import { HairlineRule } from '../components/RoyalMotifs';

interface RightsManagementPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const NINE_DISTINCT_RIGHTS = [
  {
    name: '01. Quyền sở hữu vật mang tin',
    detail:
      'Quyền đối với hiện vật vật lý (cuốn gia phả giấy, sắc phong, ảnh gốc). Không mặc nhiên bao gồm quyền tác giả hay quyền công bố số.',
  },
  {
    name: '02. Quyền quản lý hoặc lưu giữ',
    detail:
      'Trách nhiệm bảo quản, trông nom tư liệu (trưởng họ, bảo tàng, trung tâm lưu trữ). Người lưu giữ không tự ý thương mại hóa tư liệu nếu thiếu sự đồng thuận.',
  },
  {
    name: '03. Quyền tác giả đối với nội dung',
    detail:
      'Quyền của người trực tiếp biên soạn, ghi chép, sáng tác nội dung văn bản hoặc tác phẩm.',
  },
  {
    name: '04. Quyền của người chụp ảnh',
    detail:
      'Quyền phát sinh đối với bố cục và bản chụp ảnh tư liệu, tách biệt với quyền của chủ sở hữu hiện vật được chụp.',
  },
  {
    name: '05. Quyền đối với bản sao',
    detail:
      'Quyền liên quan đến bản chép lại, bản dập văn bia, bản in rập hoặc bản phục dựng; luôn phải ghi rõ nguồn tạo từ bản gốc.',
  },
  {
    name: '06. Quyền đối với bản số hóa',
    detail:
      'Quyền quản lý tệp quét/ảnh số hóa độ phân giải cao và tệp hiển thị web, ghi nhận người và đơn vị thực hiện số hóa.',
  },
  {
    name: '07. Quyền cho phép công bố',
    detail:
      'Thẩm quyền quyết định có được phép đưa thông tin hoặc hình ảnh tư liệu lên môi trường công khai hay không.',
  },
  {
    name: '08. Quyền khai thác và sử dụng hình ảnh',
    detail:
      'Phạm vi sử dụng cụ thể đối với từng tệp ảnh: chỉ xem, công bố, tải giới hạn, học tập, nghiên cứu, in ấn hay không cho phép khai thác.',
  },
  {
    name: '09. Quyền riêng tư và dữ liệu cá nhân',
    detail:
      'Bảo vệ thông tin người còn sống, địa chỉ nhà riêng, số điện thoại và nội dung nhạy cảm trong gia phả, thư từ, nhật ký.',
  },
];

const SEVEN_CORE_ROLES = [
  {
    role: 'Chủ sở hữu hiện vật',
    meaning:
      'Cá nhân, gia đình, dòng họ hoặc Nhà nước/cơ quan có quyền sở hữu hợp pháp đối với vật mang tin gốc.',
  },
  {
    role: 'Người lưu giữ',
    meaning:
      'Người hoặc đơn vị đang trực tiếp trông nom, bảo quản vật mang tin (trưởng họ, bảo tàng, trung tâm lưu trữ).',
  },
  {
    role: 'Người tạo lập tư liệu',
    meaning:
      'Cá nhân, tác giả cổ hoặc cơ quan hành chính đã lập nên nội dung văn bản/tư liệu gốc ban đầu.',
  },
  {
    role: 'Chủ sở hữu quyền tác giả',
    meaning:
      'Chủ thể nắm giữ quyền nhân thân/tài sản theo Luật Sở hữu trí tuệ nếu tác phẩm còn trong thời hạn bảo hộ.',
  },
  {
    role: 'Người chụp ảnh',
    meaning:
      'Tác giả của bức ảnh chụp hiện vật/di sản; quyền ảnh chụp độc lập với quyền sở hữu hiện vật.',
  },
  {
    role: 'Chủ thể có quyền cho phép công bố',
    meaning:
      'Người hoặc cơ quan có thẩm quyền ký văn bản chấp thuận đưa thông tin/hình ảnh lên nền tảng công khai.',
  },
  {
    role: 'Người được ủy quyền khai thác',
    meaning:
      'Cá nhân/đơn vị được chủ thể quyền ủy quyền bằng văn bản để thực hiện số hóa, trưng bày hoặc phổ biến theo phạm vi xác định.',
  },
];

interface DiagramNode {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  relatedRoles: number[];
  relatedRights: number[];
  principle: string;
}

const DIAGRAM_NODES: DiagramNode[] = [
  {
    id: 'carrier',
    code: 'NÚT 01',
    title: 'Vật mang tin (Bản gốc)',
    subtitle: 'Gia phả giấy, sắc phong, bia đá, mộc bản',
    relatedRoles: [0, 2],
    relatedRights: [0, 2],
    principle:
      'Sở hữu vật mang tin xác định quyền định đoạt hiện vật vật lý, nhưng tách biệt khỏi quyền sao chụp hoặc phát hành ảnh trên Internet.',
  },
  {
    id: 'custodian',
    code: 'NÚT 02',
    title: 'Người lưu giữ & Bảo quản',
    subtitle: 'Gia đình, trưởng họ, bảo tàng, trung tâm lưu trữ',
    relatedRoles: [1],
    relatedRights: [1, 8],
    principle:
      'Đơn vị lưu giữ chịu trách nhiệm an toàn hiện vật và bảo mật vị trí nhà riêng; không tự mặc định giữ toàn quyền khai thác thương mại.',
  },
  {
    id: 'photographer',
    code: 'NÚT 03',
    title: 'Người chụp ảnh & Bản sao',
    subtitle: 'Nhiếp ảnh gia, đơn vị dập thác bản, sao chép',
    relatedRoles: [3, 4],
    relatedRights: [3, 4],
    principle:
      'Bức ảnh chụp hiện vật làm phát sinh quyền tác giả ảnh của người chụp, song hành cùng quyền của chủ sở hữu hiện vật được chụp.',
  },
  {
    id: 'digitization',
    code: 'NÚT 04',
    title: 'Bản số hóa & Tệp chủ',
    subtitle: 'original_master, preservation_copy, access_copy',
    relatedRoles: [6],
    relatedRights: [5, 7],
    principle:
      'Mỗi tệp ảnh mang trạng thái quyền độc lập; bản gốc phân giải cao (original_master) bị khóa khỏi giao diện công cộng.',
  },
  {
    id: 'authorizer',
    code: 'NÚT 05',
    title: 'Quyền cho phép công bố',
    subtitle: 'Văn bản đồng ý, phạm vi, quyền rút lại',
    relatedRoles: [5],
    relatedRights: [6, 8],
    principle:
      'Chỉ công bố khi có văn bản đồng ý hợp lệ nêu rõ phạm vi; bảo lưu quyền tạm ẩn và rút lại đồng ý của chủ thể quyền.',
  },
];

export function RightsManagementPage({ onNavigate }: RightsManagementPageProps) {
  const { records, rightsHolders } = useHeritage();
  const [selectedRecordId, setSelectedRecordId] = useState<string>('all');
  const [activeNodeId, setActiveNodeId] = useState<string>('carrier');

  const activeNode =
    DIAGRAM_NODES.find((n) => n.id === activeNodeId) ?? DIAGRAM_NODES[0];

  const visibleHolders = useMemo(() => {
    if (selectedRecordId === 'all') return rightsHolders;
    return rightsHolders.filter((rh) => rh.recordId === selectedRecordId);
  }, [rightsHolders, selectedRecordId]);

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      {/* Masthead */}
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-5">
          <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
            NGHIỆP VỤ CỐT LÕI J02 · SƠ ĐỒ QUAN HỆ QUYỀN
          </p>
          <h1
            className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-4xl"
            style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
          >
            Quản lý Quyền Sở hữu &amp; Chủ thể Quyền
          </h1>
          <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
            Một tư liệu di sản thường đồng thời gắn với nhiều chủ thể có vai trò độc lập nhau. Sơ đồ quan hệ quyền bên dưới phân tách 7 nhóm chủ thể và 9 lớp quyền cốt lõi.
          </p>
        </div>
      </header>

      {/* INTERACTIVE RELATIONAL RIGHTS DIAGRAM */}
      <section className="py-14 sm:py-20 bg-[#FBFAF7] border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#201F1C]/12 pb-5">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                01 / SƠ ĐỒ QUAN HỆ QUYỀN TƯƠNG TÁC
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C] mt-1">
                Chuỗi tách biệt quyền từ Vật mang tin đến Công bố số
              </h2>
            </div>
            <p className="text-xs text-[#57524A]">
              Chọn từng nút trong sơ đồ để đối chiếu chủ thể và lớp quyền tương ứng
            </p>
          </div>

          {/* 5-Node Interactive Chain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border-y border-[#201F1C]/15 divide-y sm:divide-y-0 sm:divide-x divide-[#201F1C]/12">
            {DIAGRAM_NODES.map((node, index) => {
              const isSelected = node.id === activeNode.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeId(node.id)}
                  className={`text-left p-5 transition-colors flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#201F1C] text-[#FBFAF7]'
                      : 'bg-transparent text-[#201F1C] hover:bg-[#F4F1EA]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-tabular uppercase tracking-widest">
                    <span className={isSelected ? 'text-[#A58A61]' : 'text-[#781F25]'}>
                      {node.code}
                    </span>
                    <span className="opacity-60">
                      {index < DIAGRAM_NODES.length - 1 ? '→' : '●'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold leading-snug">
                      {node.title}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? 'text-[#FBFAF7]/75' : 'text-[#57524A]'
                      }`}
                    >
                      {node.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Node Relational Inspection Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-2 items-start">
            <div className="lg:col-span-5 space-y-3">
              <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#781F25]">
                PHÂN TÍCH {activeNode.code}
              </p>
              <h3 className="font-display text-2xl font-bold text-[#201F1C]">
                {activeNode.title}
              </h3>
              <p className="text-sm text-[#57524A] leading-relaxed">{activeNode.principle}</p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 border-t lg:border-t-0 lg:border-l border-[#201F1C]/12 pt-6 lg:pt-0 lg:pl-10">
              <div className="space-y-3">
                <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#57524A]">
                  Chủ thể liên quan trực tiếp
                </p>
                {activeNode.relatedRoles.map((rIdx) => {
                  const role = SEVEN_CORE_ROLES[rIdx];
                  return (
                    <div key={role.role} className="space-y-1 border-b border-[#201F1C]/10 pb-3">
                      <p className="font-display text-base font-semibold text-[#781F25]">
                        {role.role}
                      </p>
                      <p className="text-xs text-[#57524A] leading-relaxed">{role.meaning}</p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <p className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#57524A]">
                  Lớp quyền điều chỉnh
                </p>
                {activeNode.relatedRights.map((rightIdx) => {
                  const right = NINE_DISTINCT_RIGHTS[rightIdx];
                  return (
                    <div key={right.name} className="space-y-1 border-b border-[#201F1C]/10 pb-3">
                      <p className="font-display text-base font-semibold text-[#201F1C]">
                        {right.name}
                      </p>
                      <p className="text-xs text-[#57524A] leading-relaxed">{right.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL REFERENCE: 7 ROLES & 9 RIGHTS (Unboxed Editorial Columns) */}
      <section className="py-16 sm:py-20 border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                02 / HỆ THỐNG CHỦ THỂ
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C] mt-1">
                7 Vai trò Chủ thể Quyền
              </h2>
            </div>

            <ol className="divide-y divide-[#201F1C]/12 border-t border-b border-[#201F1C]/12">
              {SEVEN_CORE_ROLES.map((item, idx) => (
                <li key={item.role} className="py-4 flex items-start gap-4">
                  <span className="font-mono-tabular text-xs font-semibold text-[#A58A61] pt-0.5 shrink-0">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#201F1C]">
                      {item.role}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#57524A] mt-0.5 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                03 / PHÂN LỚP PHÁP LÝ &amp; KỸ THUẬT
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C] mt-1">
                9 Lớp Quyền Độc lập đối với Tư liệu Di sản
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 border-t border-[#201F1C]/12 pt-6">
              {NINE_DISTINCT_RIGHTS.map((item) => (
                <div key={item.name} className="space-y-1.5 pb-4 border-b border-[#201F1C]/10">
                  <h3 className="font-display text-base font-semibold text-[#781F25]">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#57524A] leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PUBLIC RIGHTS HOLDERS LEDGER */}
      <section className="py-16 sm:py-20 bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#201F1C]/12 pb-5">
            <div>
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                04 / DANH MỤC ĐỐI CHIẾU CÔNG KHAI
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C] mt-1">
                Chủ thể Quyền theo Hồ sơ ({visibleHolders.length})
              </h2>
              <p className="text-xs text-[#57524A] mt-1 max-w-2xl">
                Tuân thủ bảo vệ dữ liệu cá nhân: ẩn số điện thoại, địa chỉ nhà riêng và tệp bằng chứng nhạy cảm.
              </p>
            </div>
            <select
              aria-label="Lọc chủ thể theo hồ sơ tư liệu"
              value={selectedRecordId}
              onChange={(e) => setSelectedRecordId(e.target.value)}
              className="py-2 bg-transparent border-b border-[#201F1C]/25 text-xs text-[#201F1C] focus:outline-none focus:border-[#781F25]"
            >
              <option value="all">Tất cả hồ sơ ({records.length})</option>
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.dcIdentifier} — {r.dcTitle}
                </option>
              ))}
            </select>
          </div>

          {visibleHolders.length === 0 ? (
            <p className="py-8 text-sm text-[#57524A]">
              Chưa có chủ thể quyền công khai khớp với bộ lọc hồ sơ đã chọn.
            </p>
          ) : (
            <div className="divide-y divide-[#201F1C]/12 border-b border-[#201F1C]/12">
              {visibleHolders.map((rh) => {
                const rec = records.find((r) => r.id === rh.recordId);
                return (
                  <div
                    key={rh.id}
                    className="py-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start text-xs"
                  >
                    <div className="lg:col-span-4 space-y-1">
                      <p className="font-mono-tabular text-[#781F25] font-semibold">
                        {rec ? rec.dcIdentifier : rh.recordId}
                      </p>
                      <p className="font-display text-base font-bold text-[#201F1C]">
                        {rh.subjectName}
                      </p>
                      <p className="text-[#57524A]">{rh.roleType}</p>
                    </div>
                    <div className="lg:col-span-6 space-y-1 text-[#57524A]">
                      <p>
                        <strong className="text-[#201F1C]">Căn cứ:</strong> {rh.roleBasis}
                      </p>
                      <p>
                        <strong className="text-[#201F1C]">Phạm vi:</strong> {rh.relatedRightsScope}
                      </p>
                      <p>
                        <strong className="text-[#201F1C]">Tóm tắt bằng chứng:</strong>{' '}
                        {rh.evidenceSummary}
                      </p>
                    </div>
                    <div className="lg:col-span-2 flex flex-col lg:items-end gap-2">
                      <span className="font-mono-tabular font-semibold text-[#781F25]">
                        {rh.verificationStatus}
                      </span>
                      {rec && (
                        <button
                          type="button"
                          onClick={() => onNavigate('/tu-lieu', rec.id)}
                          className="link-editorial text-[#201F1C] font-semibold"
                        >
                          Mở hồ sơ →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <HairlineRule />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <p className="font-display text-lg font-bold text-[#201F1C]">
                Cần gửi đề nghị sử dụng hoặc đính chính thông tin chủ thể quyền?
              </p>
              <p className="text-xs sm:text-sm text-[#57524A]">
                Tiếp nhận công khai không cần đăng nhập và bảo mật toàn bộ thông tin liên hệ.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onNavigate('/yeu-cau-su-dung')}
                className="px-5 py-3 bg-[#781F25] text-[#FBFAF7] hover:bg-[#5D171C] inline-flex items-center gap-1.5"
              >
                <span>Yêu cầu sử dụng</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/khieu-nai-go-bo')}
                className="px-5 py-3 border border-[#201F1C]/25 text-[#201F1C] hover:border-[#781F25]"
              >
                Khiếu nại / Đính chính
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

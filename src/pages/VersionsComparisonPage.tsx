import React, { useState } from 'react';
import type { AppRoute } from '../types/heritage';
import { useHeritage } from '../context/HeritageContext';

interface VersionsComparisonPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

const VERSION_CONCEPTS = [
  {
    num: '01',
    title: 'Bản gốc',
    badge: 'Vật mang tin ban đầu',
    points: [
      'Là vật mang tin hình thành trực tiếp trong quá trình lịch sử/gia đình (mộc bản, châu bản, sắc phong, gia phả viết tay gốc, bia đá).',
      'Phải ghi rõ cơ quan/gia đình lưu giữ hiện nay, số đăng ký (nếu có) và tình trạng bảo quản.',
      'Với hiện vật gia đình/dòng họ quý, chỉ công bố địa danh hành chính chung để bảo đảm an toàn vật lý.',
    ],
  },
  {
    num: '02',
    title: 'Bản sao',
    badge: 'Sao chép hoặc nhân bản từ bản gốc',
    points: [
      'Bao gồm bản dập thác bản văn bia, bản in rập mộc bản, bản chép tay hoặc bản sao chứng thực lưu trữ.',
      'Bắt buộc ghi rõ nguồn tạo: sao từ bản gốc nào, ai hoặc cơ quan nào thực hiện sao chép và thời điểm sao.',
      'Tuyệt đối KHÔNG được mô tả hay gán nhãn bản sao như thể đó là bản gốc.',
    ],
  },
  {
    num: '03',
    title: 'Bản số hóa',
    badge: 'Tệp quét / số hóa kỹ thuật số',
    points: [
      'Tệp ảnh chụp kỹ thuật số hoặc tệp quét thực hiện từ bản gốc hoặc từ bản sao (luôn ghi rõ nguồn gốc số hóa).',
      'Tách biệt 4 nhóm lưu trữ: tệp chủ gốc (original_master), bản bảo quản (preservation_copy), bản xem web (access_copy) và bằng chứng quyền (rights_evidence).',
      'Quyền đối với bản số hóa tồn tại độc lập với quyền sở hữu vật mang tin gốc.',
    ],
  },
  {
    num: '04',
    title: 'Ảnh chụp',
    badge: 'Tác phẩm nhiếp ảnh hiện vật / di tích',
    points: [
      'Ảnh chụp hiện trường di tích, hiện vật trưng bày tại bảo tàng hoặc tư liệu gia đình do phóng viên, nhà nghiên cứu hoặc người thân chụp.',
      'Phát sinh quyền tác giả của người chụp ảnh bên cạnh quyền của chủ sở hữu hiện vật và quy chế nơi trưng bày.',
      'Ảnh nhìn thấy trên Internet không mặc nhiên cho phép tải xuống hay tái sử dụng nếu thiếu chấp thuận rõ ràng.',
    ],
  },
  {
    num: '05',
    title: 'Tư liệu phái sinh',
    badge: 'Phục dựng, trích xuất, chú giải, cắt ghép',
    points: [
      'Bao gồm bản phục dựng chữ mờ, bản dịch chú, bản vẽ lại, hoặc ảnh chụp lại từ sách, tạp chí và triển lãm đã xuất bản.',
      'Phải công bố minh bạch mức độ can thiệp, không dùng thay thế bằng chứng gốc và tôn trọng quyền của đơn vị xuất bản.',
    ],
  },
];

export function VersionsComparisonPage({ onNavigate }: VersionsComparisonPageProps) {
  const { records, recordVersions, recordRelationships } = useHeritage();
  const [selectedConceptIdx, setSelectedConceptIdx] = useState(0);
  const currentConcept = VERSION_CONCEPTS[selectedConceptIdx];

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      {/* Masthead */}
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-5">
          <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
            CHUẨN HÓA PHẢ HỆ TƯ LIỆU · J02
          </p>
          <h1
            className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-5xl"
            style={{ fontSize: 'clamp(2.1rem, 4.1vw, 3.6rem)' }}
          >
            Bản gốc, Bản sao, Bản số hóa, Ảnh chụp &amp; Phái sinh
          </h1>
          <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
            Hệ thống phân định 5 loại phiên bản tư liệu cùng cơ chế tách biệt tệp chủ gốc và tệp hiển thị công khai, bảo đảm cộng đồng không đánh đồng bản sao hay ảnh chụp lại với hiện vật gốc.
          </p>
        </div>
      </header>

      {/* INTERACTIVE 5-VERSION FOLIO SWITCHER */}
      <section className="py-16 sm:py-20 bg-[#FBFAF7] border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left selector index */}
          <div className="lg:col-span-4 border-t border-[#201F1C]/15 divide-y divide-[#201F1C]/12">
            {VERSION_CONCEPTS.map((item, idx) => {
              const active = idx === selectedConceptIdx;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => setSelectedConceptIdx(idx)}
                  className={`w-full py-4 px-2 text-left flex items-baseline justify-between gap-4 transition-colors ${
                    active ? 'text-[#781F25]' : 'text-[#201F1C] hover:text-[#781F25]'
                  }`}
                >
                  <div>
                    <span className="font-mono-tabular text-xs mr-3 opacity-65">{item.num}</span>
                    <span className="font-display text-lg font-bold">{item.title}</span>
                  </div>
                  <span className="text-[11px] font-mono-tabular">
                    {active ? '● ĐANG XEM' : '→'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right open folio showcase */}
          <div className="lg:col-span-8 space-y-6 lg:border-l lg:border-[#201F1C]/12 lg:pl-12">
            <div className="space-y-2 border-b border-[#201F1C]/12 pb-5">
              <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
                LOẠI BẢN {currentConcept.num} · {currentConcept.badge}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#201F1C]">
                {currentConcept.title}
              </h2>
            </div>

            <ul className="space-y-4 text-sm sm:text-base text-[#57524A] leading-relaxed">
              {currentConcept.points.map((pt, i) => (
                <li key={pt} className="flex items-start gap-4">
                  <span className="font-mono-tabular text-xs text-[#A58A61] pt-1">
                    0{i + 1}
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Architecture 4 buckets note */}
            <div className="pt-6 border-t border-[#201F1C]/12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <p className="font-mono-tabular font-semibold text-[#781F25]">
                  original_master &amp; rights_evidence
                </p>
                <p className="text-[#57524A] mt-1 leading-relaxed">
                  Bản chủ phân giải cao và văn bản đồng ý chứa thông tin cá nhân — luôn tách riêng và khóa truy cập công khai.
                </p>
              </div>
              <div>
                <p className="font-mono-tabular font-semibold text-[#201F1C]">
                  preservation_copy &amp; access_copy
                </p>
                <p className="text-[#57524A] mt-1 leading-relaxed">
                  Bản bảo tồn học thuật và bản xem web giới hạn — kiểm soát hiển thị và tải theo 8 trạng thái độc lập.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLEAN HAIRLINE COMPARATIVE MATRIX */}
      <section className="py-16 sm:py-20 border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-6">
          <div>
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              ĐỐI CHIẾU TIÊU CHUẨN
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C] mt-1">
              Bảng Phân định giữa 5 Loại Phiên bản
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[820px]">
              <thead>
                <tr className="border-y border-[#201F1C] text-[#201F1C] font-semibold">
                  <th className="py-3.5 pr-4">Tiêu chí</th>
                  <th className="py-3.5 px-3">Bản gốc</th>
                  <th className="py-3.5 px-3">Bản sao</th>
                  <th className="py-3.5 px-3">Bản số hóa</th>
                  <th className="py-3.5 px-3">Ảnh chụp</th>
                  <th className="py-3.5 pl-3">Tư liệu phái sinh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201F1C]/12 text-[#57524A]">
                <tr>
                  <td className="py-4 pr-4 font-semibold text-[#201F1C]">Bản chất</td>
                  <td className="py-4 px-3">Vật mang tin ban đầu</td>
                  <td className="py-4 px-3">Tạo lại / dập rập / chép từ gốc</td>
                  <td className="py-4 px-3">Tệp quét / tệp số kỹ thuật số</td>
                  <td className="py-4 px-3">Bức ảnh chụp hiện vật / hiện trường</td>
                  <td className="py-4 pl-3">Bản phục dựng, dịch chú, trích từ sách</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold text-[#201F1C]">Yêu cầu nguồn tạo</td>
                  <td className="py-4 px-3">Nơi lưu giữ &amp; số đăng ký</td>
                  <td className="py-4 px-3">Ghi rõ sao từ bản gốc nào, ai sao</td>
                  <td className="py-4 px-3">Ghi rõ số từ gốc hay từ sao, đơn vị số hóa</td>
                  <td className="py-4 px-3">Ghi rõ người chụp, thời điểm, bối cảnh</td>
                  <td className="py-4 pl-3">Ghi rõ tư liệu gốc &amp; nguồn xuất bản</td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold text-[#201F1C]">Quyền độc lập</td>
                  <td className="py-4 px-3">Quyền sở hữu vật lý &amp; lưu giữ</td>
                  <td className="py-4 px-3">Quyền quản lý bản sao + tôn trọng bản gốc</td>
                  <td className="py-4 px-3 text-[#781F25] font-medium">
                    8 trạng thái quyền riêng theo từng tệp
                  </td>
                  <td className="py-4 px-3 text-[#781F25] font-medium">
                    Quyền tác giả người chụp + chủ hiện vật
                  </td>
                  <td className="py-4 pl-3 text-[#781F25] font-medium">
                    Chịu ràng buộc kép với nguồn gốc
                  </td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-semibold text-[#201F1C]">Nguyên tắc hiển thị</td>
                  <td className="py-4 px-3">Bảo mật vị trí nhà riêng nhạy cảm</td>
                  <td className="py-4 px-3 text-[#781F25] font-medium">
                    Không trình bày như bản gốc
                  </td>
                  <td className="py-4 px-3">Chỉ mở access_copy khi được phép</td>
                  <td className="py-4 px-3">Ghi chú tác giả ảnh &amp; phạm vi</td>
                  <td className="py-4 pl-3">Công bố rõ phần can thiệp / biên tập</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* VERSION LINEAGE & RELATIONSHIPS */}
      <section className="py-16 sm:py-20 bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-10">
          <div className="border-b border-[#201F1C]/12 pb-4">
            <p className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-[#781F25]">
              PHẢ HỆ GHI NHẬN TRONG CSDL
            </p>
            <h2 className="font-display text-2xl font-bold text-[#201F1C] mt-1">
              Phiên bản &amp; Quan hệ ({recordVersions.length} phiên bản ·{' '}
              {recordRelationships.length} liên kết)
            </h2>
          </div>

          {recordVersions.length === 0 && recordRelationships.length === 0 ? (
            <p className="text-sm text-[#57524A]">
              CHƯA CÓ DỮ LIỆU — Chưa có lịch sử phiên bản hoặc liên kết quan hệ nào được ghi nhận.
            </p>
          ) : (
            <div className="space-y-10">
              <div className="divide-y divide-[#201F1C]/10 border-b border-[#201F1C]/12">
                {recordVersions.map((v) => {
                  const rec = records.find((r) => r.id === v.recordId);
                  return (
                    <div
                      key={v.id}
                      className="py-4 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-baseline"
                    >
                      <div className="md:col-span-3 font-mono-tabular font-semibold text-[#781F25]">
                        {rec ? rec.dcIdentifier : v.recordId} · {v.versionType}
                      </div>
                      <div className="md:col-span-7 space-y-0.5 text-[#57524A]">
                        <p className="text-[#201F1C] font-medium">
                          Nguồn tạo: {v.derivedFromDescription}
                        </p>
                        <p>
                          Thực hiện: {v.creatorOrDigitizer} ({v.createdDateLabel})
                          {v.notes ? ` · ${v.notes}` : ''}
                        </p>
                      </div>
                      <div className="md:col-span-2 md:text-right">
                        {rec && (
                          <button
                            type="button"
                            onClick={() => onNavigate('/tu-lieu', rec.id)}
                            className="link-editorial text-[#781F25] font-semibold"
                          >
                            Mở hồ sơ →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {recordRelationships.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-[#201F1C]">
                    Liên kết quan hệ giữa các hồ sơ ({recordRelationships.length})
                  </h3>
                  <div className="divide-y divide-[#201F1C]/10 border-t border-b border-[#201F1C]/12 text-xs">
                    {recordRelationships.map((rel) => {
                      const src = records.find((r) => r.id === rel.sourceRecordId);
                      const tgt = records.find((r) => r.id === rel.targetRecordId);
                      return (
                        <div key={rel.id} className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-2">
                          <span className="md:col-span-3 font-semibold text-[#781F25]">
                            {rel.relationshipType}
                          </span>
                          <span className="md:col-span-5 text-[#201F1C]">
                            {src ? `${src.dcIdentifier} (${rel.sourceVersionType})` : rel.sourceRecordId}{' '}
                            → {tgt ? `${tgt.dcIdentifier} (${rel.targetVersionType})` : rel.targetRecordId}
                          </span>
                          <span className="md:col-span-4 text-[#57524A]">{rel.notes}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import type { AppRoute } from '../types/heritage';
import { LEGAL_HANDBOOK_TOPICS } from '../data/officialSourcesAndLegal';

interface LegalHandbookPageProps {
  onNavigate: (route: AppRoute, recordId?: string) => void;
}

export function LegalHandbookPage({ onNavigate }: LegalHandbookPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(
    new Set(LEGAL_HANDBOOK_TOPICS.map((t) => t.category))
  );

  const visibleTopics =
    selectedCategory === 'all'
      ? LEGAL_HANDBOOK_TOPICS
      : LEGAL_HANDBOOK_TOPICS.filter((t) => t.category === selectedCategory);

  return (
    <div className="bg-[#F4F1EA] text-[#201F1C]">
      <header className="border-b border-[#201F1C]/12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 space-y-5">
          <p className="font-mono-tabular text-[11px] uppercase tracking-[0.22em] text-[#781F25]">
            BỐ CỤC ĐỌC TÀI LIỆU · LEGAL REFERENCE HANDBOOK
          </p>
          <h1
            className="font-display font-bold text-[#201F1C] leading-[1.08] max-w-4xl"
            style={{ fontSize: 'clamp(2.2rem, 4.3vw, 3.7rem)' }}
          >
            Cẩm nang Pháp lý Di sản Tư liệu
          </h1>
          <p className="text-sm sm:text-base text-[#57524A] editorial-measure leading-relaxed">
            Tổng hợp các chủ đề pháp lý trọng tâm từ đề tài J02. Mọi văn bản và số điều được liệt kê để đối chiếu tại Công báo/CSDL Văn bản Chính phủ, không tự suy diễn điều luật.
          </p>
        </div>
      </header>

      {/* Long-form Document Reader Layout: Sticky Left TOC + 64ch Reading Column */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Sticky Document TOC */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-3 border-b border-[#201F1C]/12 pb-4">
            <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#781F25]">
              MỤC LỤC CHỦ ĐỀ
            </p>
            <div className="flex flex-col items-start gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`text-left py-1 transition-colors ${
                  selectedCategory === 'all'
                    ? 'text-[#781F25] font-semibold underline'
                    : 'text-[#57524A] hover:text-[#201F1C]'
                }`}
              >
                Tất cả chủ đề ({LEGAL_HANDBOOK_TOPICS.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left py-1 transition-colors ${
                    selectedCategory === cat
                      ? 'text-[#781F25] font-semibold underline'
                      : 'text-[#57524A] hover:text-[#201F1C]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <ol className="space-y-2 text-xs text-[#57524A]">
            {visibleTopics.map((item, idx) => (
              <li key={item.id}>
                <a
                  href={`#topic-${item.id}`}
                  className="hover:text-[#781F25] transition-colors flex items-baseline gap-2"
                >
                  <span className="font-mono-tabular text-[#A58A61]">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span>{item.topic}</span>
                </a>
              </li>
            ))}
          </ol>

          <div className="pt-4 border-t border-[#201F1C]/12">
            <button
              type="button"
              onClick={() => onNavigate('/kiem-tra-quyen')}
              className="link-editorial text-xs font-semibold text-[#781F25]"
            >
              Chạy công cụ kiểm tra quyền →
            </button>
          </div>
        </aside>

        {/* Right Long-Form Reading Column */}
        <div className="lg:col-span-8 bg-[#FBFAF7] border-y border-[#201F1C]/15 p-6 sm:p-10 space-y-12">
          <div className="border-b border-[#781F25]/35 pb-5 flex items-start gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4 text-[#781F25] shrink-0 mt-1" />
            <p className="text-[#57524A] leading-relaxed">
              <strong className="text-[#201F1C]">Nguyên tắc trung thực văn bản pháp lý:</strong> Nội dung chưa đối chiếu trực tiếp toàn văn nguyên gốc từ Công báo Chính phủ mang nhãn{' '}
              <strong className="text-[#781F25]">“ĐANG CHỜ ĐỐI CHIẾU VĂN BẢN GỐC”</strong> kèm liên kết tới đầu mối chính thức.
            </p>
          </div>

          <div className="divide-y divide-[#201F1C]/15">
            {visibleTopics.map((item, idx) => (
              <article
                key={item.id}
                id={`topic-${item.id}`}
                className="py-10 first:pt-0 last:pb-0 space-y-5 editorial-measure"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-tabular uppercase tracking-widest">
                  <span className="text-[#781F25] font-semibold">
                    CHƯƠNG {String(idx + 1).padStart(2, '0')} · {item.category}
                  </span>
                  <span className="text-[#57524A]">{item.verificationStatus}</span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201F1C] leading-snug">
                  {item.topic}
                </h2>

                <p className="text-sm sm:text-base text-[#201F1C] leading-relaxed">
                  {item.summaryPrinciple}
                </p>

                <div className="space-y-4 pt-2 border-l-2 border-[#A58A61] pl-5 text-xs sm:text-sm">
                  <div>
                    <p className="font-semibold text-[#201F1C] mb-1">
                      Văn bản &amp; chuẩn tham chiếu
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[#57524A]">
                      {item.referencedDocuments.map((doc) => (
                        <li key={doc}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-[#201F1C] mb-1">
                      Hướng dẫn thực hành trên nền tảng
                    </p>
                    <p className="text-[#57524A] leading-relaxed">{item.practicalGuidance}</p>
                  </div>
                </div>

                <div className="pt-2 text-xs">
                  <a
                    href={item.officialCheckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-editorial text-[#781F25] font-medium inline-flex items-center gap-1.5 break-all"
                  >
                    <span>Đối chiếu nguyên văn: {item.officialCheckUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

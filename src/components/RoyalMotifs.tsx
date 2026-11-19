import React, { useEffect, useState } from 'react';
import { ArrowUp, Lock, ShieldAlert } from 'lucide-react';

/**
 * Contemporary Abstract Archival Sculpture — proportional Swiss/museum editorial geometry.
 * Replaces decorative traditional motifs; strictly abstract and never mimics an authentic artifact.
 */
export function AbstractArchivalPlate({
  code = 'J02 / ARCHIVE SPECIMEN',
  caption = 'Không gian trưng bày mặc định ẩn ảnh hiện vật khi chưa có văn bản đồng ý công bố hợp lệ.',
  aspect = 'tall',
}: {
  code?: string;
  caption?: string;
  aspect?: 'tall' | 'wide';
}) {
  return (
    <figure className="space-y-3">
      <div
        className={`relative bg-[#FBFAF7] border border-[#201F1C]/15 overflow-hidden flex flex-col justify-between p-6 sm:p-8 ${
          aspect === 'tall' ? 'min-h-[340px] sm:min-h-[420px]' : 'min-h-[220px]'
        }`}
      >
        {/* Minimalist architectural registration lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 400"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="0" y1="120" x2="400" y2="120" stroke="#201F1C" strokeOpacity="0.08" strokeWidth="1" />
          <line x1="0" y1="280" x2="400" y2="280" stroke="#201F1C" strokeOpacity="0.08" strokeWidth="1" />
          <line x1="140" y1="0" x2="140" y2="400" stroke="#201F1C" strokeOpacity="0.08" strokeWidth="1" />
          <line x1="280" y1="0" x2="280" y2="400" stroke="#201F1C" strokeOpacity="0.08" strokeWidth="1" />
          <circle cx="280" cy="120" r="56" fill="none" stroke="#781F25" strokeOpacity="0.35" strokeWidth="1" />
          <rect x="76" y="180" width="128" height="100" fill="none" stroke="#A58A61" strokeOpacity="0.5" strokeWidth="1" />
          <line x1="76" y1="280" x2="204" y2="180" stroke="#A58A61" strokeOpacity="0.35" strokeWidth="0.8" />
        </svg>

        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-[0.18em] text-[#57524A]">
          <span>{code}</span>
          <span className="text-[#781F25]">RIGHTS-GATED PLATE</span>
        </div>

        <div className="relative z-10 max-w-xs space-y-2 pt-16">
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#201F1C] leading-tight">
            Tư liệu chỉ hiển thị khi có căn cứ đồng ý.
          </p>
          <p className="text-xs text-[#57524A] leading-relaxed">
            Tuyệt đối không dùng ảnh AI giả lập hiện vật hay tự suy đoán quyền từ Internet.
          </p>
        </div>
      </div>

      <figcaption className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#57524A] border-t border-[#201F1C]/12 pt-2">
        <span className="font-editorial italic">{caption}</span>
        <span className="font-mono-tabular uppercase tracking-wider text-[#A58A61]">
          MINH BẠCH TRẠNG THÁI
        </span>
      </figcaption>
    </figure>
  );
}

export function HairlineRule({ className = '' }: { className?: string }) {
  return <hr className={`border-0 border-t border-[#201F1C]/12 my-0 ${className}`} />;
}

export function UnverifiedImageFrame({
  reason,
  compact = false,
  code,
}: {
  reason?: string;
  compact?: boolean;
  code?: string;
}) {
  return (
    <div
      className={`relative w-full bg-[#FBFAF7] border border-[#201F1C]/15 flex flex-col justify-between overflow-hidden ${
        compact ? 'min-h-[190px] p-5' : 'min-h-[300px] p-7 sm:p-9'
      }`}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 240"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="0" y1="80" x2="400" y2="80" stroke="#201F1C" strokeOpacity="0.06" strokeWidth="1" />
        <line x1="120" y1="0" x2="120" y2="240" stroke="#201F1C" strokeOpacity="0.06" strokeWidth="1" />
        <line x1="300" y1="0" x2="300" y2="240" stroke="#A58A61" strokeOpacity="0.25" strokeWidth="1" />
      </svg>

      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-widest text-[#57524A]">
        <span>{code || 'TƯ LIỆU HẠN CHẾ HIỂN THỊ'}</span>
        <Lock className="w-3.5 h-3.5 text-[#781F25]" />
      </div>

      <div className="relative z-10 max-w-md pt-6 space-y-1.5">
        <p className="font-display text-base sm:text-lg font-semibold text-[#201F1C]">
          Chưa có hình ảnh được phép công bố công khai
        </p>
        <p className="text-xs text-[#57524A] leading-relaxed">
          {reason ||
            'Hệ thống tự động giữ vùng trưng bày ở trạng thái trung lập khi chưa có văn bản đồng ý công bố hợp lệ.'}
        </p>
      </div>
    </div>
  );
}

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[#781F25] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Quay lại đầu trang"
      className="fixed bottom-5 right-5 z-40 w-10 h-10 bg-[#201F1C] text-[#FBFAF7] flex items-center justify-center hover:bg-[#781F25] transition-colors"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}

export function VerificationAlertBanner({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="border-y border-[#781F25]/35 py-4 flex items-start gap-3">
      <ShieldAlert className="w-4 h-4 text-[#781F25] shrink-0 mt-1" />
      <div className="text-xs sm:text-sm">
        <p className="font-semibold text-[#201F1C]">{title}</p>
        <p className="text-[#57524A] mt-0.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

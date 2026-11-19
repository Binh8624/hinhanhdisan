import React from 'react';

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Đã xảy ra lỗi không mong muốn trong quá trình hiển thị.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F1EA] text-[#201F1C] flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-[#FBFAF7] border-y border-[#201F1C]/20 p-8 sm:p-10 space-y-4">
            <p className="font-mono-tabular text-xs uppercase tracking-widest text-[#781F25] font-semibold">
              Thông báo hệ thống Di Sản Số
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#201F1C]">
              Không thể hiển thị nội dung này
            </h1>
            <p className="text-sm text-[#57524A] leading-relaxed">
              Hệ thống vừa ghi nhận một sự cố kỹ thuật hoặc hạn chế quyền truy cập dữ liệu. Vui lòng tải lại trang hoặc quay về Trang chủ.
            </p>
            <pre className="text-xs font-mono-tabular bg-[#F4F1EA] border border-[#201F1C]/15 p-3 overflow-x-auto text-[#57524A]">
              {this.state.errorMessage}
            </pre>
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="px-6 py-3 bg-[#781F25] text-[#FBFAF7] text-xs sm:text-sm font-medium hover:bg-[#5D171C] transition-colors"
            >
              Quay về Trang chủ
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

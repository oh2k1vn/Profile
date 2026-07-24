import React from 'react';
import { AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface DashboardAccessDeniedProps {
  onNavigatePlayground: () => void;
  onNavigateHome: () => void;
}

export const DashboardAccessDenied: React.FC<DashboardAccessDeniedProps> = ({
  onNavigatePlayground,
  onNavigateHome,
}) => {
  return (
    <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-10 border border-white/20 shadow-2xl text-center space-y-6 w-full">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold font-sans text-white">Yêu Cầu Đăng Nhập Quản Trị</h1>
          <p className="text-xs font-sans text-slate-300 leading-relaxed max-w-md mx-auto">
            Khu vực Dashboard dành riêng cho Quản trị viên. Để bảo mật, ứng dụng không dùng nút Đăng nhập UI. Hãy chuyển sang không gian CLI Terminal và gõ câu lệnh <code className="text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded font-mono">login</code> để đăng nhập bằng Google.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { audioService.playClick(); onNavigatePlayground(); }}
            className="liquid-glass-accent-btn px-6 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck size={16} />
            Mở CLI Terminal để Login
          </button>
          <button
            onClick={() => { audioService.playClick(); onNavigateHome(); }}
            className="liquid-glass-pill px-6 py-3 rounded-2xl text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Về Trang Chủ
          </button>
        </div>
      </div>
    </main>
  );
};

import React from 'react';
import { ShieldAlert, Terminal, ArrowLeft, Lock } from 'lucide-react';
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
    <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 flex flex-col items-center justify-center">
      <div className="liquid-glass-card rounded-3xl p-8 sm:p-10 border border-white/20 shadow-2xl text-center space-y-6 w-full relative overflow-hidden">
        {/* Specular Highlight Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"></div>

        {/* macOS Top Window Buttons */}
        <div className="flex items-center space-x-2 absolute top-4 left-5">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
        </div>

        {/* VisionOS Lock Icon Container */}
        <div className="pt-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-sky-400/30 text-sky-400 flex items-center justify-center mx-auto shadow-2xl shadow-sky-500/20 relative group">
            <Lock size={34} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center">
              <ShieldAlert size={10} className="text-slate-950" />
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold font-sans text-white tracking-tight">
            Yêu Cầu Xác Thực Quyền Quản Trị
          </h1>
          <p className="text-xs font-sans text-slate-300 leading-relaxed max-w-md mx-auto">
            Hệ thống Dashboard yêu cầu tài khoản đã được cấp quyền. Vui lòng mở CLI Terminal và chạy câu lệnh{' '}
            <code className="text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-lg font-mono font-bold border border-sky-400/30">
              login
            </code>{' '}
            để thực hiện xác thực với Firebase Google OAuth.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              audioService.playClick();
              onNavigatePlayground();
            }}
            className="liquid-glass-accent-btn px-6 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform"
          >
            <Terminal size={16} />
            Mở CLI Terminal để Auth
          </button>
          <button
            onClick={() => {
              audioService.playClick();
              onNavigateHome();
            }}
            className="liquid-glass-pill px-6 py-3.5 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform"
          >
            <ArrowLeft size={15} />
            Quay Về Trang Chủ
          </button>
        </div>
      </div>
    </main>
  );
};

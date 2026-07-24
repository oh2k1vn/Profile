import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const GlitchAlert: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center space-y-4 text-center p-6 pointer-events-none select-none">
      <div className="p-4 rounded-full bg-rose-500/20 border border-rose-500/40 backdrop-blur-md">
        <ShieldAlert size={56} className="text-rose-400 animate-bounce" />
      </div>
      <h2 className="text-2xl font-bold text-rose-400 uppercase tracking-wide">Phát Hiện Lệnh Sudo: Đang Format Root</h2>
      <p className="text-sm text-slate-300 max-w-md font-mono">Cảnh báo: Tệp tin cốt lõi bị unlinked. Điện thế quá tải. Đang tiến hành chuẩn hóa lại luồng máy chủ...</p>
      <div className="w-56 h-2.5 bg-slate-900 border border-rose-500/50 rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-linear-to-r from-rose-500 to-amber-500 animate-[pulse_0.4s_infinite]" style={{ width: '85%' }} />
      </div>
    </div>
  );
};

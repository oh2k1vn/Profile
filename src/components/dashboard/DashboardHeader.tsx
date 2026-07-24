import React from 'react';
import type { User } from 'firebase/auth';
import { UserCheck, ExternalLink, LogOut } from 'lucide-react';
import type { UserProfileData } from '../../services/profileService';
import { audioService } from '../../services/audioService';

interface DashboardHeaderProps {
  user: User;
  profile: UserProfileData;
  onNavigateHome: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  profile,
  onNavigateHome,
  onLogout,
}) => {
  return (
    <div className="liquid-glass rounded-3xl p-6 border border-white/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <img
          src={user.photoURL || profile.avatarUrl || '/images/avatar.webp'}
          alt={user.displayName || 'Admin'}
          className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-400/40 shadow-md"
        />
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold font-sans text-white">{user.displayName || 'Quản Trị Viên'}</h1>
            <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <UserCheck size={10} /> Verified Admin
            </span>
          </div>
          <p className="text-xs font-sans text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button
          onClick={() => { audioService.playClick(); onNavigateHome(); }}
          className="liquid-glass-pill px-4 py-2 rounded-2xl text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <ExternalLink size={13} />
          Xem Website
        </button>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-2xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut size={13} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

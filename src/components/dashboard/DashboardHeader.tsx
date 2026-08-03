import React from 'react';
import type { User } from 'firebase/auth';
import {
  ExternalLink,
  LogOut,
  Sparkles,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Tags,
  Users,
} from 'lucide-react';
import type { UserProfileData } from '../../services/profileService';
import { audioService } from '../../services/audioService';

interface DashboardHeaderProps {
  user: User;
  profile: UserProfileData | null;
  activeTab?: string;
  onNavigateHome: () => void;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user: _user,
  profile: _profile,
  activeTab = 'profile',
  onNavigateHome,
  onLogout,
}) => {
  const getTabInfo = (tab: string) => {
    switch (tab) {
      case 'profile':
        return {
          title: 'Thông Tin Profile',
          desc: 'Quản lý thông tin cá nhân, chức danh chuyên môn và các liên kết mạng xã hội',
          icon: LayoutDashboard,
        };
      case 'blog':
        return {
          title: 'Quản Lý Bài Viết Blog',
          desc: 'Soạn thảo, xuất bản và cập nhật các bài viết chia sẻ kiến thức',
          icon: BookOpen,
        };
      case 'categories':
        return {
          title: 'Quản Lý Danh Mục',
          desc: 'Tổ chức chủ đề, phân loại các bài viết blog và kiến thức',
          icon: Tags,
        };
      case 'projects':
        return {
          title: 'Quản Lý Dự Án',
          desc: 'Cập nhật danh sách sản phẩm, công nghệ sử dụng và đường dẫn demo',
          icon: FolderKanban,
        };
      case 'users':
        return {
          title: 'Quản Lý Người Dùng',
          desc: 'Phân quyền tài khoản quản trị và theo dõi danh sách thành viên',
          icon: Users,
        };
      default:
        return {
          title: 'Tổng Quan Hệ Thống',
          desc: 'Bảng điều khiển quản trị trang cá nhân',
          icon: LayoutDashboard,
        };
    }
  };

  const tabInfo = getTabInfo(activeTab);
  const TabIcon = tabInfo.icon;

  return (
    <div className="liquid-glass rounded-3xl p-5 sm:p-6 border border-white/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
      {/* Top Specular Highlight Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

      {/* Left Column: Breadcrumbs & Dynamic Tab Title */}
      <div className="space-y-1.5">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs font-sans text-slate-400">
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles size={12} className="text-sky-400" />
            Dashboard
          </span>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="text-sky-300 font-medium">{tabInfo.title}</span>
        </div>

        {/* Header Title with Tab Icon */}
        <div className="flex items-center space-x-3 pt-0.5">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0 shadow-inner">
            <TabIcon size={20} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold font-sans text-white tracking-tight">
              {tabInfo.title}
            </h1>
            <p className="text-xs font-sans text-slate-400 line-clamp-1">{tabInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* Right Column: Status Badge & Mobile-only Quick Actions */}
      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
        {/* Firestore Sync Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-slate-900/60 border border-white/10 text-[11px] text-slate-300 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]"></span>
          <span className="font-mono text-emerald-300">Firestore Live</span>
        </div>

        {/* Mobile-Only Quick Actions (Shown on small screens where sidebar is hidden) */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => {
              audioService.playClick();
              onNavigateHome();
            }}
            className="liquid-glass-pill px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Xem Website"
          >
            <ExternalLink size={13} className="text-sky-400" />
            <span>Web</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Đăng xuất"
          >
            <LogOut size={13} />
            <span>Thoát</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import type { User } from 'firebase/auth';
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Tags,
  Users,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { UserProfileData } from '../../services/profileService';
import { audioService } from '../../services/audioService';

export type DashboardTab = 'profile' | 'blog' | 'categories' | 'projects' | 'users';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  user: User;
  profile: UserProfileData | null;
  isAdmin: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  blogCount?: number;
  projectCount?: number;
  onNavigateHome: () => void;
  onLogout: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  setActiveTab,
  user,
  profile,
  isAdmin,
  isCollapsed,
  onToggleCollapse,
  blogCount = 0,
  projectCount = 0,
  onNavigateHome,
  onLogout,
}) => {
  const navItems = [
    {
      id: 'profile' as DashboardTab,
      label: 'Thông Tin Profile',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'blog' as DashboardTab,
      label: 'Quản Lý Blog',
      icon: BookOpen,
      badge: blogCount,
      adminOnly: false,
    },
    {
      id: 'categories' as DashboardTab,
      label: 'Quản Lý Danh Mục',
      icon: Tags,
      badge: null,
      adminOnly: false,
    },
    {
      id: 'projects' as DashboardTab,
      label: 'Quản Lý Dự Án',
      icon: FolderKanban,
      badge: projectCount,
      adminOnly: false,
    },
    {
      id: 'users' as DashboardTab,
      label: 'Quản Lý User',
      icon: Users,
      badge: null,
      adminOnly: true,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between transition-all duration-300 ease-in-out liquid-glass-dark rounded-3xl p-4 border border-white/15 shadow-2xl relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => {
          audioService.playClick();
          onToggleCollapse();
        }}
        className="absolute -right-3.5 top-8 bg-slate-900/90 text-slate-300 hover:text-white p-1.5 rounded-full border border-white/20 shadow-lg cursor-pointer transition-all hover:scale-110 z-20"
        title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2 py-2 border-b border-white/10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-500 p-0.5 shrink-0 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles size={18} className="text-sky-400 animate-pulse" />
            </div>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold font-sans text-white tracking-wide truncate">
                Admin CMS
              </h2>
              <p className="text-[10px] font-mono text-sky-400/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                v2.5 Liquid Glass
              </p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;

            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  audioService.playClick();
                  setActiveTab(item.id);
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
                } py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 via-white/15 to-indigo-500/10 text-sky-300 border border-white/20 shadow-lg shadow-sky-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    size={18}
                    className={`shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active side indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-400 rounded-r-full shadow-[0_0_10px_#38bdf8]"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-1'}`}>
          <img
            src={user.photoURL || profile?.avatarUrl || '/images/avatar.webp'}
            alt={user.displayName || 'User'}
            className="w-9 h-9 rounded-xl object-cover border border-white/20 shrink-0 shadow-md"
          />
          {!isCollapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user.displayName || 'Quản Trị Viên'}
              </p>
              <div className="flex items-center space-x-1 mt-0.5">
                {isAdmin ? (
                  <span className="text-[9px] font-mono text-amber-300 bg-amber-500/15 border border-amber-400/30 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shrink-0">
                    <ShieldAlert size={8} /> Admin
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-sky-300 bg-sky-500/15 border border-sky-400/30 px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shrink-0">
                    <UserCheck size={8} /> User
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className={`flex items-center gap-1.5 ${isCollapsed ? 'flex-col' : 'justify-between'}`}>
          <button
            onClick={() => {
              audioService.playClick();
              onNavigateHome();
            }}
            title="Xem Trang Chủ"
            className="flex-1 py-2 px-2.5 rounded-xl text-[11px] font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink size={13} />
            {!isCollapsed && <span>Xem Web</span>}
          </button>
          <button
            onClick={onLogout}
            title="Đăng xuất"
            className="py-2 px-2.5 rounded-xl text-[11px] font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};

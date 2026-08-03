import React from 'react';
import { BookOpen, FolderKanban, Tags, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import type { DashboardTab } from './DashboardSidebar';
import { audioService } from '../../services/audioService';

interface DashboardStatsProps {
  blogCount: number;
  projectCount: number;
  categoriesCount?: number;
  isAdmin: boolean;
  onSelectTab: (tab: DashboardTab) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  blogCount,
  projectCount,
  categoriesCount = 4,
  isAdmin,
  onSelectTab,
}) => {
  const stats = [
    {
      id: 'blog' as DashboardTab,
      title: 'Bài Viết Blog',
      value: blogCount,
      subtitle: 'Nội dung chia sẻ kỹ thuật',
      icon: BookOpen,
      color: 'from-sky-500/20 to-blue-600/10 text-sky-400 border-sky-400/30',
      badge: 'Firestore Live',
    },
    {
      id: 'projects' as DashboardTab,
      title: 'Dự Án Portfolio',
      value: projectCount,
      subtitle: 'Sản phẩm demo & thực tế',
      icon: FolderKanban,
      color: 'from-indigo-500/20 to-purple-600/10 text-indigo-400 border-indigo-400/30',
      badge: 'Showcase',
    },
    {
      id: 'categories' as DashboardTab,
      title: 'Danh Mục Bài Viết',
      value: categoriesCount,
      subtitle: 'Phân loại chuyên mục',
      icon: Tags,
      color: 'from-purple-500/20 to-pink-600/10 text-purple-400 border-purple-400/30',
      badge: 'Taxonomy',
    },
    {
      id: 'profile' as DashboardTab,
      title: 'Quyền Truy Cập',
      value: isAdmin ? 'Admin' : 'User',
      subtitle: isAdmin ? 'Toàn quyền hệ thống' : 'Quản lý nội dung tạo bởi bạn',
      icon: ShieldCheck,
      color: isAdmin
        ? 'from-amber-500/20 to-emerald-600/10 text-amber-400 border-amber-400/30'
        : 'from-emerald-500/20 to-teal-600/10 text-emerald-400 border-emerald-400/30',
      badge: isAdmin ? 'Full Access' : 'User Mode',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            onClick={() => {
              audioService.playClick();
              onSelectTab(stat.id);
            }}
            className="liquid-glass-card rounded-3xl p-5 border border-white/14 shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          >
            {/* Background Ambient Glow */}
            <div
              className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-40 blur-2xl group-hover:opacity-70 transition-opacity`}
            ></div>

            <div className="flex items-center justify-between mb-3 relative z-10">
              <div
                className={`w-11 h-11 rounded-2xl bg-slate-900/60 backdrop-blur-xl border flex items-center justify-center shadow-inner ${stat.color}`}
              >
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-300 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full flex items-center gap-1 group-hover:border-sky-400/40 group-hover:text-sky-300 transition-colors">
                <Sparkles size={10} className="text-sky-400" />
                {stat.badge}
              </span>
            </div>

            <div className="space-y-1 relative z-10">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight">
                  {stat.value}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </div>
              <p className="text-xs font-semibold text-slate-200">{stat.title}</p>
              <p className="text-[11px] font-sans text-slate-400 truncate">{stat.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

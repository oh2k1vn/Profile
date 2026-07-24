import React, { useState, useEffect } from 'react';
import { FolderGit2, Inbox, Loader2 } from 'lucide-react';
import { PROJECTS_DATA } from '../../constants/projects';
import { fetchProjectsFromFirestore } from '../../services/projectService';
import type { Project } from '../../types/project';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const fetched = await fetchProjectsFromFirestore();
        if (fetched && fetched.length > 0) {
          setProjects(fetched);
        } else {
          setProjects(PROJECTS_DATA);
        }
      } catch (err) {
        console.error('Error loading projects from Firestore:', err);
        setProjects(PROJECTS_DATA);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const getVietnameseCategory = (cat: string) => {
    if (cat === 'All') return 'Tất Cả';
    if (cat === 'Game Engine') return 'Công Cụ Game';
    if (cat === 'UI Components') return 'Thành Phần UI';
    if (cat === 'Design System') return 'Hệ Thống Thiết Kế';
    return cat;
  };

  return (
    <section id="projects" className="space-y-6 scroll-mt-24">
      <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400">
          <FolderGit2 size={20} />
        </div>
        <h2 className="text-xl font-bold font-sans text-white tracking-wide">Kho dự án tiêu biểu</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-sky-400 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-10 sm:p-14 border border-white/15 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
            <Inbox size={36} className="animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">Chưa có dữ liệu hiển thị</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-relaxed">
              Dữ liệu dự án đang được cập nhật. Vui lòng quay lại sau!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="liquid-glass-card rounded-3xl p-6 border border-white/15 hover:border-sky-400/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 relative"
            >
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-sky-300 bg-sky-500/15 border border-sky-400/25 mb-3">
                  {getVietnameseCategory(p.category)}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                  {p.shortDesc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                {p.tech?.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-white/5 border border-white/10 text-[10px] font-mono text-slate-200 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

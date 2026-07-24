import React, { useState } from 'react';
import { Plus, Loader2, Trash2, Save } from 'lucide-react';
import type { Project } from '../../types/project';
import type { CreateProjectInput } from '../../services/projectService';
import { audioService } from '../../services/audioService';
import { Drawer } from '../common/Drawer';
import { ProjectForm } from './ProjectForm';

interface ProjectsTabProps {
  projects: Project[];
  loadingProjects: boolean;
  onDeleteProject: (id: string) => void;
  onCreateProject: (input: CreateProjectInput, techText: string) => Promise<void>;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  loadingProjects,
  onDeleteProject,
  onCreateProject,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSaveProject = async (input: CreateProjectInput, techText: string) => {
    await onCreateProject(input, techText);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-sans text-white">Quản Lý Dự Án Portfolio (Firestore)</h2>
          <p className="text-xs font-sans text-slate-400">Thêm và cập nhật danh sách sản phẩm nổi bật của bạn.</p>
        </div>

        <button
          onClick={() => { audioService.playClick(); setIsDrawerOpen(true); }}
          className="liquid-glass-accent-btn px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={14} />
          Thêm Dự Án Mới
        </button>
      </div>

      {loadingProjects ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="text-sky-400 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-10 text-center text-slate-400 text-xs">
          Chưa có dự án nào lưu trên Firestore. Nhấn nút "Thêm Dự Án Mới" để bắt đầu!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="liquid-glass rounded-2xl p-5 border border-white/12 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-400/20 px-2 py-0.5 rounded-full">{proj.category}</span>
                <button
                  onClick={() => onDeleteProject(proj.id)}
                  className="p-1.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg cursor-pointer transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <h3 className="text-sm font-bold text-white">{proj.title}</h3>
              <p className="text-xs text-slate-300 line-clamp-2">{proj.shortDesc}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {proj.tech?.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 bg-white/10 rounded-md text-slate-300">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3-LAYOUT DRAWER FOR PROJECTS */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Thêm Dự Án Mới"
        subtitle="Cập nhật dự án mới vào Firestore"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="liquid-glass-pill px-5 py-2 rounded-2xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              form="project-drawer-form"
              className="liquid-glass-accent-btn px-6 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              Lưu Dự Án
            </button>
          </>
        }
      >
        <ProjectForm
          formId="project-drawer-form"
          onSave={handleSaveProject}
          onCancel={() => setIsDrawerOpen(false)}
        />
      </Drawer>
    </div>
  );
};

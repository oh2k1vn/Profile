import React, { useState } from 'react';
import { Plus, Loader2, Trash2, Save, User as UserIcon } from 'lucide-react';
import type { Project } from '../../types/project';
import type { CreateProjectInput } from '../../services/projectService';
import { audioService } from '../../services/audioService';
import { Drawer } from '../common/Drawer';
import { ConfirmModal } from '../common/ConfirmModal';
import { ProjectForm } from './ProjectForm';
import { useProfile } from '../../contexts/ProfileContext';
import { canManageResource } from '../../utils/authUtils';

interface ProjectsTabProps {
  projects: Project[];
  loadingProjects: boolean;
  onDeleteProject: (id: string) => void;
  onCreateProject: (input: CreateProjectInput, techText: string) => Promise<void>;
  isAdmin?: boolean;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  loadingProjects,
  onDeleteProject,
  onCreateProject,
  isAdmin: propIsAdmin,
}) => {
  const { user, isAdmin: contextIsAdmin, profile } = useProfile();
  const isAdmin = propIsAdmin ?? contextIsAdmin;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const canCreate = !!user;

  const handleSaveProject = async (input: CreateProjectInput, techText: string) => {
    if (!user) return;
    const authorName = profile?.displayName || user.displayName || user.email?.split('@')[0] || 'Tác giả';
    const enrichedInput: CreateProjectInput = {
      ...input,
      authorId: user.uid,
      authorName,
    };
    await onCreateProject(enrichedInput, techText);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-sans text-white">Quản Lý Dự Án Portfolio</h2>
          <p className="text-xs font-sans text-slate-400">Thêm và cập nhật danh sách sản phẩm nổi bật của bạn.</p>
        </div>

        {canCreate && (
          <button
            onClick={() => { audioService.playClick(); setIsDrawerOpen(true); }}
            className="liquid-glass-accent-btn px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Plus size={14} />
            Thêm Dự Án Mới
          </button>
        )}
      </div>

      {loadingProjects ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="text-sky-400 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-10 text-center text-slate-400 text-xs">
          Chưa có dự án nào lưu trên Firestore.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const canManage = canManageResource(user, isAdmin, proj.authorId);
            return (
              <div key={proj.id} className="liquid-glass rounded-2xl p-5 border border-white/12 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 border border-purple-400/20 px-2 py-0.5 rounded-full">{proj.category}</span>
                    {proj.authorName && (
                      <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <UserIcon size={10} className="text-sky-400" />
                        {proj.authorName}
                      </span>
                    )}
                  </div>
                  {canManage && (
                    <button
                      onClick={() => { audioService.playClick(); setProjectToDelete(proj); }}
                      className="p-1.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg cursor-pointer transition-all"
                      title="Xoá dự án"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{proj.shortDesc}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.tech?.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-white/10 rounded-md text-slate-300">{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3-LAYOUT DRAWER FOR PROJECTS */}
      {canCreate && (
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
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={async () => {
          if (projectToDelete) {
            await onDeleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }
        }}
        title="Xác Nhận Xoá Dự Án"
        message={
          <>
            Bạn có chắc chắn muốn xoá dự án <strong className="text-white font-semibold">"{projectToDelete?.title}"</strong> không? Hành động này sẽ xoá dự án khỏi hệ thống Firestore.
          </>
        }
      />
    </div>
  );
};

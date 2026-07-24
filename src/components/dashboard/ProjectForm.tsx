import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import type { CreateProjectInput } from '../../services/projectService';

interface ProjectFormProps {
  formId?: string;
  onSave: (input: CreateProjectInput, techText: string) => Promise<void>;
  onCancel: () => void;
  renderFooter?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  formId,
  onSave,
  onCancel,
  renderFooter = false,
}) => {
  const [projectInput, setProjectInput] = useState<CreateProjectInput>({
    title: '',
    category: 'Web App',
    shortDesc: '',
    longDesc: '',
    tech: [],
    github: 'https://github.com/oh2k1vn',
    demoUrl: '',
    simulationType: 'particles',
  });
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectInput.title.trim() || !projectInput.shortDesc.trim()) return;
    setSaving(true);
    try {
      await onSave(projectInput, techInput);
      setProjectInput({
        title: '',
        category: 'Web App',
        shortDesc: '',
        longDesc: '',
        tech: [],
        github: 'https://github.com/oh2k1vn',
        demoUrl: '',
        simulationType: 'particles',
      });
      setTechInput('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Tên dự án</label>
          <input
            type="text"
            required
            value={projectInput.title}
            onChange={e => setProjectInput({ ...projectInput, title: e.target.value })}
            placeholder="Nhập tên dự án..."
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Phân loại</label>
          <input
            type="text"
            value={projectInput.category}
            onChange={e => setProjectInput({ ...projectInput, category: e.target.value })}
            placeholder="Ví dụ: Mobile App, Web App, Mini App"
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Mô tả ngắn</label>
        <input
          type="text"
          required
          value={projectInput.shortDesc}
          onChange={e => setProjectInput({ ...projectInput, shortDesc: e.target.value })}
          placeholder="Mô tả tóm tắt dự án..."
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Công nghệ áp dụng (Phân cách bằng dấu phẩy)</label>
        <input
          type="text"
          value={techInput}
          onChange={e => setTechInput(e.target.value)}
          placeholder="Ví dụ: Flutter, Dart, Firebase, React, Tailwind CSS"
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Link GitHub Repository</label>
          <input
            type="text"
            value={projectInput.github}
            onChange={e => setProjectInput({ ...projectInput, github: e.target.value })}
            placeholder="https://github.com/username/repo"
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Link Live Demo (Không bắt buộc)</label>
          <input
            type="text"
            value={projectInput.demoUrl || ''}
            onChange={e => setProjectInput({ ...projectInput, demoUrl: e.target.value })}
            placeholder="https://demo.example.com"
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Mô tả chi tiết dự án</label>
        <textarea
          rows={5}
          value={projectInput.longDesc}
          onChange={e => setProjectInput({ ...projectInput, longDesc: e.target.value })}
          placeholder="Nhập mô tả chi tiết bài toán, giải pháp và kiến trúc của dự án..."
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white resize-none"
        />
      </div>

      {renderFooter && (
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="liquid-glass-pill px-5 py-2.5 rounded-2xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="liquid-glass-accent-btn px-6 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Lưu Dự Án
          </button>
        </div>
      )}
    </form>
  );
};

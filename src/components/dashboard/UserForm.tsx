import React, { useState } from 'react';
import { Save, Loader2, User, Crown } from 'lucide-react';
import type { UserProfileData } from '../../services/profileService';
import { audioService } from '../../services/audioService';

interface UserFormProps {
  user: UserProfileData;
  formId?: string;
  onSave: (updatedData: Partial<UserProfileData>) => Promise<void>;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  formId = 'user-drawer-form',
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<UserProfileData>({ ...user });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    audioService.playClick();
    setSaving(true);

    try {
      const skillsArray = (formData.skillsText || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload: Partial<UserProfileData> = {
        ...formData,
        skills: skillsArray,
      };

      await onSave(payload);
    } catch (err) {
      console.error('Error saving user profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-6">
      {/* Role Selection Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/12 space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>Vai Trò Hệ Thống (Role) *</span>
          <span className="text-[10px] font-mono text-amber-400 font-normal">Quyền hạn truy cập Dashboard</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { audioService.playClick(); setFormData({ ...formData, role: 'user' }); }}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              formData.role !== 'admin'
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40 shadow-lg'
                : 'bg-slate-800/50 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <User size={15} />
            User (Thành Viên)
          </button>

          <button
            type="button"
            onClick={() => { audioService.playClick(); setFormData({ ...formData, role: 'admin' }); }}
            className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              formData.role === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-lg'
                : 'bg-slate-800/50 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <Crown size={15} className="text-amber-400" />
            Admin (Quản Trị Viên)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Họ và Tên *</label>
          <input
            type="text"
            required
            value={formData.displayName || ''}
            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="Nguyễn Văn A"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Email *</label>
          <input
            type="email"
            required
            value={formData.email || ''}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="user@example.com"
          />
        </div>

        {/* Job Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Chức Danh Chuyên Môn</label>
          <input
            type="text"
            value={formData.jobTitle || ''}
            onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="Software Engineer"
          />
        </div>

        {/* Headline */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Headline / Slogan</label>
          <input
            type="text"
            value={formData.headline || ''}
            onChange={e => setFormData({ ...formData, headline: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="Đam mê phát triển ứng dụng web..."
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Số Điện Thoại</label>
          <input
            type="text"
            value={formData.phone || ''}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="+84 901 234 567"
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Địa Chỉ / Tỉnh Thành</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="TP. Hồ Chí Minh"
          />
        </div>

        {/* Avatar Image URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
          <input
            type="text"
            value={formData.avatarUrl || formData.photoURL || ''}
            onChange={e => setFormData({ ...formData, avatarUrl: e.target.value, photoURL: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://..."
          />
        </div>

        {/* CV Link */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Link CV / Resume (PDF)</label>
          <input
            type="text"
            value={formData.cvUrl || ''}
            onChange={e => setFormData({ ...formData, cvUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://drive.google.com/..."
          />
        </div>

        {/* GitHub URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">GitHub URL</label>
          <input
            type="text"
            value={formData.githubUrl || ''}
            onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://github.com/..."
          />
        </div>

        {/* LinkedIn URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">LinkedIn URL</label>
          <input
            type="text"
            value={formData.linkedinUrl || ''}
            onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        {/* Facebook URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Facebook URL</label>
          <input
            type="text"
            value={formData.facebookUrl || ''}
            onChange={e => setFormData({ ...formData, facebookUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://facebook.com/..."
          />
        </div>

        {/* Website URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Website Personal URL</label>
          <input
            type="text"
            value={formData.websiteUrl || ''}
            onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Skills Text */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Danh Sách Kỹ Năng (Phân cách bằng dấu phẩy)</label>
        <input
          type="text"
          value={formData.skillsText || ''}
          onChange={e => setFormData({ ...formData, skillsText: e.target.value })}
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          placeholder="React, TypeScript, Flutter, Tailwind CSS"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Tiểu Sử / Bio Ngắn</label>
        <textarea
          rows={3}
          value={formData.bio || ''}
          onChange={e => setFormData({ ...formData, bio: e.target.value })}
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white resize-none"
          placeholder="Mô tả thông tin chi tiết..."
        />
      </div>

      {/* Form Buttons */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => { audioService.playClick(); onCancel(); }}
          className="liquid-glass-pill px-5 py-2.5 rounded-2xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
        >
          Huỷ Bỏ
        </button>

        <button
          type="submit"
          disabled={saving}
          className="liquid-glass-accent-btn px-6 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Lưu Thay Đổi
        </button>
      </div>
    </form>
  );
};

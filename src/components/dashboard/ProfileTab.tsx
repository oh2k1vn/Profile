import React from 'react';
import { CheckCircle2, Loader2, Save } from 'lucide-react';
import type { UserProfileData } from '../../services/profileService';

interface ProfileTabProps {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData>>;
  savingProfile: boolean;
  profileSuccess: boolean;
  onSaveProfile: (e: React.FormEvent) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  setProfile,
  savingProfile,
  profileSuccess,
  onSaveProfile,
}) => {
  return (
    <form onSubmit={onSaveProfile} className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6 shadow-2xl">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-base font-bold font-sans text-white">Cấu Hình Thông Tin Cá Nhân (Firestore Sync)</h2>
        <p className="text-xs font-sans text-slate-400">Các thông tin được cập nhật sẽ đồng bộ trực tiếp lên hệ thống.</p>
      </div>

      {profileSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={16} />
          Cập nhật hồ sơ thành công vào Firestore!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Họ và tên</label>
          <input
            type="text"
            value={profile.displayName}
            onChange={e => setProfile({ ...profile, displayName: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="Nguyễn Minh Hiếu"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Chức danh chuyên môn</label>
          <input
            type="text"
            value={profile.jobTitle || ''}
            onChange={e => setProfile({ ...profile, jobTitle: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="Middle Frontend & Mobile Developer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Email liên hệ</label>
          <input
            type="email"
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="email@domain.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Địa chỉ / Tỉnh thành</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={e => setProfile({ ...profile, location: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="TP. Hồ Chí Minh"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
          <input
            type="text"
            value={profile.avatarUrl || ''}
            onChange={e => setProfile({ ...profile, avatarUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="/images/avatar.webp"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">GitHub Repository URL</label>
          <input
            type="text"
            value={profile.githubUrl || ''}
            onChange={e => setProfile({ ...profile, githubUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://github.com/username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Danh sách kỹ năng (Phân cách bằng dấu phẩy)</label>
        <input
          type="text"
          value={profile.skillsText || ''}
          onChange={e => setProfile({ ...profile, skillsText: e.target.value })}
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          placeholder="React, TypeScript, Flutter, Zalo Mini App, Tailwind CSS"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Tiểu sử ngắn (Bio)</label>
        <textarea
          rows={3}
          value={profile.bio || ''}
          onChange={e => setProfile({ ...profile, bio: e.target.value })}
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white resize-none"
          placeholder="Mô tả định hướng và kinh nghiệm thực chiến..."
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={savingProfile}
          className="liquid-glass-accent-btn px-6 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Lưu Thông Tin Profile
        </button>
      </div>
    </form>
  );
};

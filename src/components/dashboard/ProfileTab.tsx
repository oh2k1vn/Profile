import React from 'react';
import { CheckCircle2, Loader2, Save, ShieldAlert, UserCheck } from 'lucide-react';
import type { UserProfileData } from '../../services/profileService';

interface ProfileTabProps {
  profile: UserProfileData;
  setProfile: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
  savingProfile: boolean;
  profileSuccess: boolean;
  onSaveProfile: (e: React.FormEvent) => void;
  isAdmin?: boolean;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  setProfile,
  savingProfile,
  profileSuccess,
  onSaveProfile,
  isAdmin = true,
}) => {
  return (
    <form onSubmit={onSaveProfile} className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6 shadow-2xl">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-sans text-white">Cấu Hình Thông Tin Cá Nhân (Firestore Sync)</h2>
          <p className="text-xs font-sans text-slate-400">Các thông tin được cập nhật sẽ đồng bộ trực tiếp lên hệ thống.</p>
        </div>
        {!isAdmin ? (
          <span className="px-3 py-1.5 rounded-full text-xs font-medium text-sky-300 bg-sky-500/15 border border-sky-400/25 flex items-center gap-1.5 shrink-0">
            <UserCheck size={14} /> Quyền Thành Viên (User Role)
          </span>
        ) : (
          <span className="px-3 py-1.5 rounded-full text-xs font-medium text-amber-300 bg-amber-500/15 border border-amber-400/25 flex items-center gap-1.5 shrink-0">
            <ShieldAlert size={14} /> Quyền Quản Trị Viên (Admin Role)
          </span>
        )}
      </div>

      {profileSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 size={16} />
          Cập nhật hồ sơ thành công vào Firestore!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Họ và tên *</label>
          <input
            type="text"
            required
            value={profile.displayName || ''}
            onChange={e => setProfile({ ...profile, displayName: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="Họ và tên của bạn"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Chức danh chuyên môn</label>
          <input
            type="text"
            value={profile.jobTitle || ''}
            onChange={e => setProfile({ ...profile, jobTitle: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="Frontend / Mobile Developer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Slogan / Headline ngắn</label>
          <input
            type="text"
            value={profile.headline || ''}
            onChange={e => setProfile({ ...profile, headline: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="Mô tả công việc hoặc định hướng ngắn gọn"
          />
        </div>

        {/* Email is a protected important field: disabled for non-admins */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Email liên hệ *</label>
            {!isAdmin && <span className="text-[10px] text-amber-400/80 font-mono">(Chỉ Admin sửa)</span>}
          </div>
          <input
            type="email"
            required
            disabled={!isAdmin}
            value={profile.email || ''}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white disabled:opacity-60 disabled:cursor-not-allowed"
            placeholder="email@domain.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Số điện thoại</label>
          <input
            type="text"
            value={profile.phone || ''}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="+84 901 234 567"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Địa chỉ / Tỉnh thành</label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={e => setProfile({ ...profile, location: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="TP. Hồ Chí Minh, Việt Nam"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Avatar Image URL</label>
          <input
            type="text"
            value={profile.avatarUrl || profile.photoURL || ''}
            onChange={e => setProfile({ ...profile, avatarUrl: e.target.value, photoURL: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Link CV / Resume (PDF)</label>
          <input
            type="text"
            value={profile.cvUrl || ''}
            onChange={e => setProfile({ ...profile, cvUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">GitHub URL</label>
          <input
            type="text"
            value={profile.githubUrl || ''}
            onChange={e => setProfile({ ...profile, githubUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://github.com/username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">LinkedIn URL</label>
          <input
            type="text"
            value={profile.linkedinUrl || ''}
            onChange={e => setProfile({ ...profile, linkedinUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Facebook URL</label>
          <input
            type="text"
            value={profile.facebookUrl || ''}
            onChange={e => setProfile({ ...profile, facebookUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://facebook.com/username"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">Website URL</label>
          <input
            type="text"
            value={profile.websiteUrl || ''}
            onChange={e => setProfile({ ...profile, websiteUrl: e.target.value })}
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            placeholder="https://yourwebsite.com"
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
          placeholder="React, TypeScript, Flutter, Tailwind CSS, Firebase"
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

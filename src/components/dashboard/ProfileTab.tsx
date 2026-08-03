import React from 'react';
import {
  CheckCircle2,
  Loader2,
  Save,
  ShieldAlert,
  UserCheck,
  User,
  Briefcase,
  Share2,
  Sparkles,
  FileText,
  Phone,
  MapPin,
  Mail,
  Globe,
  Radio,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { UserProfileData } from '../../services/profileService';
import { usePresence } from '../../hooks/usePresence';

// Custom Feather/Lucide styled Brand SVG Icons (lucide-react removed brand icons in recent versions)
const Github: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Facebook: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

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
  const { activeVisitors, ownerStatus, updateStatusText } = usePresence();
  const [realtimeStatusInput, setRealtimeStatusInput] = React.useState(ownerStatus.statusText);
  const [updatingStatus, setUpdatingStatus] = React.useState(false);

  React.useEffect(() => {
    if (ownerStatus.statusText) {
      setRealtimeStatusInput(ownerStatus.statusText);
    }
  }, [ownerStatus.statusText]);

  const handleUpdateStatus = async () => {
    if (!realtimeStatusInput.trim()) return;
    setUpdatingStatus(true);
    try {
      await updateStatusText(realtimeStatusInput);
      toast.success('Đã cập nhật trạng thái Realtime thành công!');
    } catch {
      toast.error('Lỗi cập nhật trạng thái!');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <form onSubmit={onSaveProfile} className="space-y-6">
      {/* Top Banner Card */}
      <div className="liquid-glass rounded-3xl p-6 border border-white/15 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <User size={18} className="text-sky-400" />
            <h2 className="text-base font-bold font-sans text-white">Cấu Hình Thông Tin Cá Nhân</h2>
          </div>
          <p className="text-xs font-sans text-slate-400 mt-1">
            Chỉnh sửa thông tin xuất hiện trên trang cá nhân, thẻ giới thiệu và các kênh liên hệ.
          </p>
        </div>

        {!isAdmin ? (
          <span className="px-3.5 py-1.5 rounded-full text-xs font-medium text-sky-300 bg-sky-500/15 border border-sky-400/30 flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <UserCheck size={14} /> Quyền Thành Viên (User)
          </span>
        ) : (
          <span className="px-3.5 py-1.5 rounded-full text-xs font-medium text-amber-300 bg-amber-500/15 border border-amber-400/30 flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <ShieldAlert size={14} /> Quyền Admin (Full Access)
          </span>
        )}
      </div>

      {/* Success Notification */}
      {profileSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium flex items-center gap-3 shadow-lg animate-fade-in">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>Đã đồng bộ và lưu thông tin profile thành công vào Firestore!</span>
        </div>
      )}

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Specs (1 Column) */}
        <div className="space-y-6">
          {/* Avatar Preview Card */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <img
                src={profile.avatarUrl || profile.photoURL || '/images/avatar.webp'}
                alt={profile.displayName || 'Avatar'}
                className="w-28 h-28 rounded-3xl object-cover border-4 border-sky-400/40 shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-3xl bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Sparkles size={20} className="text-sky-300" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{profile.displayName || 'Chưa cập nhật tên'}</h3>
              <p className="text-xs text-sky-400 font-medium">{profile.jobTitle || 'Developer'}</p>
            </div>

            <div className="w-full space-y-2 pt-2 border-t border-white/10">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 text-left">
                <Globe size={12} className="text-sky-400" />
                Avatar Image URL
              </label>
              <input
                type="text"
                value={profile.avatarUrl || profile.photoURL || ''}
                onChange={e => setProfile({ ...profile, avatarUrl: e.target.value, photoURL: e.target.value })}
                className="glass-input w-full px-3.5 py-2 rounded-2xl text-xs text-white"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Resume & Portfolio Links Card */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <FileText size={16} className="text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Hồ Sơ CV & Web</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Link CV / Resume (PDF)</label>
                <input
                  type="text"
                  value={profile.cvUrl || ''}
                  onChange={e => setProfile({ ...profile, cvUrl: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-2xl text-xs text-white"
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Website Cá Nhân</label>
                <input
                  type="text"
                  value={profile.websiteUrl || ''}
                  onChange={e => setProfile({ ...profile, websiteUrl: e.target.value })}
                  className="glass-input w-full px-3.5 py-2 rounded-2xl text-xs text-white"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Card: Realtime Database Status & Active Visitors */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <Radio size={16} className="text-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Trạng Thái Realtime DB</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <Users size={14} className="text-sky-400" />
                  <span>Độc giả đang trực tuyến:</span>
                </div>
                <span className="font-mono text-xs font-bold text-sky-300 bg-sky-500/15 border border-sky-400/30 px-2.5 py-0.5 rounded-full">
                  {activeVisitors} Online
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Dòng trạng thái công việc (Live Status)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={realtimeStatusInput}
                    onChange={(e) => setRealtimeStatusInput(e.target.value)}
                    placeholder="Đang làm việc / Sẵn sàng nhận dự án..."
                    className="glass-input flex-1 px-3.5 py-2 rounded-2xl text-xs text-white"
                  />
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={handleUpdateStatus}
                    className="liquid-glass-pill px-3 py-2 rounded-2xl text-xs font-semibold text-sky-300 hover:text-white cursor-pointer disabled:opacity-50"
                  >
                    {updatingStatus ? <Loader2 size={14} className="animate-spin" /> : 'Lưu'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Primary Details, Socials & Bio (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Main Info */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <Briefcase size={16} className="text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Thông Tin Định Danh</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Chức danh chuyên môn</label>
                <input
                  type="text"
                  value={profile.jobTitle || ''}
                  onChange={e => setProfile({ ...profile, jobTitle: e.target.value })}
                  className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
                  placeholder="Frontend / Mobile Developer"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Slogan / Headline ngắn</label>
                <input
                  type="text"
                  value={profile.headline || ''}
                  onChange={e => setProfile({ ...profile, headline: e.target.value })}
                  className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
                  placeholder="Mô tả công việc hoặc định hướng ngắn gọn"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Mail size={12} className="text-slate-400" /> Email liên hệ *
                  </label>
                  {!isAdmin && <span className="text-[10px] text-amber-400 font-mono">(Chỉ Admin sửa)</span>}
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Phone size={12} className="text-slate-400" /> Số điện thoại
                </label>
                <input
                  type="text"
                  value={profile.phone || ''}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
                  placeholder="+84 901 234 567"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" /> Địa chỉ / Tỉnh thành
                </label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
                  placeholder="TP. Hồ Chí Minh, Việt Nam"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Social Media */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
              <Share2 size={16} className="text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Kênh Mạng Xã Hội</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Github size={13} className="text-slate-300" /> GitHub URL
                </label>
                <input
                  type="text"
                  value={profile.githubUrl || ''}
                  onChange={e => setProfile({ ...profile, githubUrl: e.target.value })}
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl text-xs text-white"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Linkedin size={13} className="text-sky-400" /> LinkedIn URL
                </label>
                <input
                  type="text"
                  value={profile.linkedinUrl || ''}
                  onChange={e => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl text-xs text-white"
                  placeholder="https://linkedin.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Facebook size={13} className="text-blue-400" /> Facebook URL
                </label>
                <input
                  type="text"
                  value={profile.facebookUrl || ''}
                  onChange={e => setProfile({ ...profile, facebookUrl: e.target.value })}
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl text-xs text-white"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>

          {/* Card 3: Skills & Bio */}
          <div className="liquid-glass-card rounded-3xl p-6 border border-white/15 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Danh sách kỹ năng chính (Phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={profile.skillsText || ''}
                onChange={e => setProfile({ ...profile, skillsText: e.target.value })}
                className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white font-mono"
                placeholder="React, TypeScript, Tailwind CSS, Firebase, Next.js"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tiểu sử ngắn (Bio)</label>
              <textarea
                rows={3}
                value={profile.bio || ''}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white resize-none"
                placeholder="Mô tả ngắn gọn về kinh nghiệm, phong cách lập trình và định hướng..."
              />
            </div>
          </div>

          {/* Submit CTA Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="liquid-glass-accent-btn px-8 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-sky-500/20"
            >
              {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Lưu & Đồng Bộ Profile
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

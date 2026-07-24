import React, { useState } from 'react';
import { User, ChevronRight, MapPin, Mail, Code, Globe, ExternalLink, Briefcase } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { useProfile } from '../../contexts/ProfileContext';

export const AboutSection: React.FC = () => {
  const { profile } = useProfile();
  const [aboutTab, setAboutTab] = useState<'story' | 'setup' | 'philosophy'>('story');

  const name = profile?.displayName || '';
  const jobTitle = profile?.jobTitle || '';
  const location = profile?.location || '';
  const bio = profile?.bio || '';
  const skillsList = profile?.skillsText
    ? profile.skillsText.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <section id="about" className="space-y-6 scroll-mt-24">
      <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
        <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
          <User size={20} />
        </div>
        <h2 className="text-xl font-bold font-sans text-white tracking-wide">Hồ Sơ Giới Thiệu</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* iOS Segmented Control Tabs */}
        <div className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
          {(['story', 'setup', 'philosophy'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { audioService.playClick(); setAboutTab(tab); }}
              className={`px-5 py-3 text-xs font-semibold text-center md:text-left rounded-2xl transition-all duration-200 cursor-pointer whitespace-nowrap md:whitespace-normal border ${
                aboutTab === tab
                  ? 'bg-white/15 border-white/25 text-sky-300 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-xl'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'story' ? 'Con Đường / Tiểu Sử' : tab === 'setup' ? 'Hệ Thống / Thiết Bị' : 'Triết Lý Thiết Kế'}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="md:col-span-8 liquid-glass rounded-3xl p-6 sm:p-8 text-sm text-slate-300 leading-relaxed font-sans border border-white/15">
          {aboutTab === 'story' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <ChevronRight size={18} className="text-sky-400" />
                    {name || 'Chưa cập nhật tên'}
                  </h3>
                  {jobTitle && <p className="text-xs text-sky-400 font-mono mt-0.5">{jobTitle}</p>}
                </div>
                {location && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={13} className="text-rose-400" />
                    <span>{location}</span>
                  </div>
                )}
              </div>

              <p className="text-slate-300 leading-relaxed">
                {bio || 'Chưa có thông tin tiểu sử. Bạn có thể cập nhật trong trang Dashboard.'}
              </p>

              {/* Quick Contact Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="liquid-glass-pill px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-1.5">
                    <Mail size={13} className="text-sky-400" /> {profile.email}
                  </a>
                )}
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="liquid-glass-pill px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-1.5">
                    <Code size={13} className="text-purple-400" /> GitHub
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="liquid-glass-pill px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-1.5">
                    <Globe size={13} className="text-sky-400" /> LinkedIn
                  </a>
                )}
                {profile?.websiteUrl && (
                  <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="liquid-glass-pill px-3 py-1.5 rounded-xl text-xs text-slate-300 flex items-center gap-1.5">
                    <ExternalLink size={13} className="text-emerald-400" /> Website
                  </a>
                )}
              </div>
            </div>
          )}

          {aboutTab === 'setup' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <ChevronRight size={18} className="text-sky-400" />
                Công nghệ &amp; Thiết bị
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-900/40 border border-white/10 rounded-2xl">
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-sky-400" /> Chuyên môn cốt lõi
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skillsList.length > 0 ? (
                      skillsList.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-sky-500/10 border border-sky-400/20 text-sky-300 rounded-md text-xs">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">Chưa cập nhật kỹ năng</span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-slate-900/40 border border-white/10 rounded-2xl">
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Công cụ &amp; Thiết bị</h4>
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    <li>• OS: Windows 10 &amp; macOS</li>
                    <li>• IDE: VS Code, Android Studio, Xcode</li>
                    <li>• UI/UX Design: Figma, Tailwind CSS</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {aboutTab === 'philosophy' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <ChevronRight size={18} className="text-sky-400" />
                Triết lý thiết kế
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5" />
                  <span><strong className="text-white">Tập trung vào sản phẩm:</strong> Thiết kế giao diện cá nhân hóa theo ngữ cảnh sản phẩm, tránh dùng mẫu rập khuôn.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5" />
                  <span><strong className="text-white">Tối giản &amp; tinh gọn:</strong> Loại bỏ các yếu tố trang trí thừa. Mọi hiệu ứng động phải phục vụ chức năng trải nghiệm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5" />
                  <span><strong className="text-white">Phản hồi sinh động:</strong> Kết hợp chuyển động mượt và hiệu ứng âm thanh tinh tế tạo cảm giác tương tác chân thực.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { User, ChevronRight } from 'lucide-react';
import { audioService } from '../../services/audioService';

export const AboutSection: React.FC = () => {
  const [aboutTab, setAboutTab] = useState<'story' | 'setup' | 'philosophy'>('story');

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
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <ChevronRight size={18} className="text-sky-400" />
                Tóm tắt chuyên môn
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Mình tên là Nguyễn Minh Hiếu, sinh ngày 16/06/2001, cựu sinh viên tốt nghiệp khóa K25 trường Đại học Văn Lang. Tính đến nay, mình đã có hơn 4 năm kinh nghiệm làm việc thực chiến liên tục tại một công ty duy nhất từ vị trí thực tập sinh lên nhân viên chính thức, đạt cấp độ Middle Developer. Mình chuyên lập trình giao diện Web App, Mobile App bằng Flutter và phát triển các sản phẩm trong hệ sinh thái Zalo Mini App. Sở hữu khả năng chuyển đổi thiết kế mượt mà từ Figma ra mã nguồn và làm chủ giao diện với CSS, Bootstrap, Tailwind CSS.
              </p>
            </div>
          )}

          {aboutTab === 'setup' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <ChevronRight size={18} className="text-sky-400" />
                Công nghệ & Thiết bị
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-900/40 border border-white/10 rounded-2xl">
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Hệ điều hành & Thiết bị</h4>
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    <li>• OS: Windows 10</li>
                    <li>• Tools: VS Code, Android Studio, Figma</li>
                    <li>• Terminal: Git Bash & MacOS Terminal</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-900/40 border border-white/10 rounded-2xl">
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Công cụ & Giao diện</h4>
                  <ul className="text-xs space-y-1.5 text-slate-300">
                    <li>• Frameworks: Flutter (Dart), ReactJS, Nextjs</li>
                    <li>• Web & UI: Vuejs, Nuxtjs, Zalo Mini SDK</li>
                    <li>• Styling: CSS, TailwindCSS, Bootstrap, Figma</li>
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
                  <span><strong className="text-white">Tối giản & tinh gọn:</strong> Loại bỏ các yếu tố trang trí thừa. Mọi hiệu ứng động phải phục vụ chức năng trải nghiệm.</span>
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

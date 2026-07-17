import { useState, useEffect, useRef } from 'react';
import {
  User, Cpu, FolderGit2,
  ArrowRight, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { audioService } from '../utils/audio';
import { ProjectModal } from '../components/ProjectModal';
import type { Project } from '../components/ProjectModal';

const PROJECTS_DATA: Project[] = [
  {
    id: 'neoforge',
    title: 'Zalo Mini App E-Commerce',
    category: 'Mini App',
    shortDesc: 'Giải pháp bán hàng gọn nhẹ tích hợp trực tiếp trên hệ sinh thái Zalo.',
    longDesc: 'Ứng dụng Zalo Mini App tối ưu dung lượng dưới 10MB phục vụ mua sắm trực tiếp. Tận dụng tối đa bộ SDK của Zalo để tối ưu trải nghiệm kéo thả, đăng nhập một chạm, liên kết ví điện tử và tối ưu hóa thời gian khởi chạy dưới 2 giây.',
    tech: ['Zalo Mini App SDK', 'Vuejs', 'TailwindCSS'],
    github: 'https://github.com/example/zalo-ecommerce-miniapp',
    simulationType: 'chat',
  },
  {
    id: 'optiflow',
    title: 'NeoForge Flutter App',
    category: 'Mobile App',
    shortDesc: 'Ứng dụng di động quản lý tiến trình và tương tác đa nền tảng viết bằng Flutter.',
    longDesc: 'Dự án Mobile App xây dựng trên nền tảng Flutter hỗ trợ hiển thị danh mục động, theo dõi hiệu năng thiết bị thời gian thực và đồng bộ hóa ngoại tuyến. Dự án chứng minh khả năng xây dựng bố cục pixel-perfect chuẩn Figma và tối ưu hóa tốc độ tải trang.',
    tech: ['Flutter', 'Dart', 'State Management'],
    github: 'https://github.com/example/neoforge-flutter-app',
    simulationType: 'particles',
  },
  {
    id: 'cyberforest',
    title: 'CyberForest Portal',
    category: 'Web App',
    shortDesc: 'Cổng thông tin tương tác doanh nghiệp tối ưu SEO với thư viện chuyển động mượt mà.',
    longDesc: 'Cổng thông tin doanh nghiệp xây dựng bằng NuxtJS và Vuejs, định hình phong cách thiết kế hiện đại sử dụng CSS thuần và Bootstrap. Hệ thống hỗ trợ đa giao diện (Dark/Light mode), tải dữ liệu bất đồng bộ mượt mà và tối ưu hóa chỉ số Web Vitals Core.',
    tech: ['NuxtJS', 'Vuejs', 'Bootstrap', 'CSS Keyframes'],
    github: 'https://github.com/example/cyberforest-portal',
    simulationType: 'theme',
  },
  {
    id: 'retroterminal',
    title: 'OptiFlow Board',
    category: 'UI Components',
    shortDesc: 'Bảng quản lý quy trình trực quan kéo thả dành cho hệ thống quản trị nội bộ.',
    longDesc: 'Trình quản lý sơ đồ và luồng công việc kéo thả hiệu năng cao viết bằng ReactJS và Nextjs. Giải quyết bài toán giật lag trình duyệt khi vẽ hàng trăm kết nối tương tác bằng cách áp dụng bộ đệm Canvas 2D và quản lý state Zustand gọn nhẹ.',
    tech: ['ReactJS', 'Nextjs', 'Zustand', 'HTML5 Canvas'],
    github: 'https://github.com/example/optiflow-board',
    simulationType: 'network',
  },
];

const SKILLS_DATA = {
  frontend: [
    'ReactJS / Nextjs',
    'Vuejs / Nuxtjs',
    'Flutter (Mobile)',
    'Zalo Mini App',
  ],
  uiux: [
    'Tailwind CSS',
    'CSS / Bootstrap',
    'Figma UI UX',
    'Responsive Layouts',
  ],
  tools: [
    'Vite / Webpack Bundler',
    'Git Version Control',
    'Chrome DevTools / Audit',
    'Mobile App Debugging',
  ],
};

export default function HomePage() {
  const navigate = useNavigate();

  // About tabs
  const [aboutTab, setAboutTab] = useState<'story' | 'setup' | 'philosophy'>('story');

  // Projects filtering
  const [projectFilter, setProjectFilter] = useState('All');

  // Project detail modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 3D Card tilt
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease-out',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.05s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    });
  };

  // Typewriter
  const [typedTitle, setTypedTitle] = useState('');
  const fullTitle = 'Kiến tạo thế giới số bằng logic và tính thẩm mỹ.';

  useEffect(() => {
    const chars = Array.from(fullTitle);
    let index = 0;
    setTypedTitle('');
    const interval = setInterval(() => {
      if (index < chars.length) {
        setTypedTitle(chars.slice(0, index + 1).join(''));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  const filteredProjects = projectFilter === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === projectFilter);

  const getVietnameseCategory = (cat: string) => {
    if (cat === 'All') return 'Tất Cả';
    if (cat === 'Game Engine') return 'Công Cụ Game';
    if (cat === 'UI Components') return 'Thành Phần UI';
    if (cat === 'Design System') return 'Hệ Thống Thiết Kế';
    return cat;
  };

  return (
    <>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-16 space-y-24">

        {/* HERO SECTION */}
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[70vh] pb-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-light-green/20 border border-light-green/30 text-text-light rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-heading-accent animate-pulse" />
              <span>Sẵn sàng nhận dự án & công việc mới</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none text-text-light">
              Xin chào, mình là <span className="text-heading-primary glow-text">Minh Hiếu</span>
            </h1>

            <p className="text-base md:text-lg text-heading-accent font-mono min-h-[3.5rem] md:min-h-[2.5rem] h-auto max-w-xl">
              {typedTitle}
              <span className="animate-caret border-r-2 border-heading-primary ml-1" />
            </p>

            <p className="text-sm text-text-green leading-relaxed max-w-xl">
              Mình là lập trình viên Frontend & Mobile App chuyên xây dựng giao diện ứng dụng và tối ưu trải nghiệm người dùng. Tập trung vào Flutter, React, Vue, hệ sinh thái Zalo Mini App, thiết kế UI/UX trên Figma và lập trình CSS chuẩn chỉ.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={() => { audioService.playClick(); navigate('/playground'); }}
                className="px-5 py-2.5 bg-heading-primary hover:bg-heading-accent text-dark-green rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto text-center border-none"
              >
                <span>Mở Retro CLI Terminal</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => {
                  audioService.playClick();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 border border-light-green/30 hover:border-light-green/60 bg-light-green/10 hover:bg-light-green/20 text-text-light rounded-lg text-xs font-mono cursor-pointer transition-all w-full sm:w-auto text-center justify-center flex items-center bg-transparent"
              >
                Xem Các Dự Án
              </button>
            </div>
          </div>

          {/* HERO AVATAR / HIGH-TECH 3D SCREEN */}
          <div className="lg:col-span-5" style={{ perspective: '1000px' }}>
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={tiltStyle}
              className="glass-panel border border-light-green/35 rounded-xl shadow-2xl overflow-hidden hover:border-light-green/60 transition-all duration-300 relative group aspect-square select-none cursor-pointer"
            >
              <div className="absolute inset-0 scanlines opacity-45 pointer-events-none z-10" />
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-heading-primary z-20 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-heading-primary z-20 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-heading-primary z-20 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-heading-primary z-20 pointer-events-none" />

              <div className="absolute top-4 left-10 font-mono text-[9px] text-heading-primary tracking-widest z-20 pointer-events-none bg-black/60 px-1.5 py-0.5 rounded border border-light-green/20">
                SYS_STATUS: ACTIVE
              </div>
              <div className="absolute bottom-4 right-10 font-mono text-[9px] text-heading-accent tracking-widest z-20 pointer-events-none bg-black/60 px-1.5 py-0.5 rounded border border-light-green/20">
                TARGET: MINH_HIEU.EXE
              </div>

              <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col space-y-2 z-20 pointer-events-none text-text-green font-mono text-[8px] opacity-60 group-hover:opacity-100 transition-opacity">
                <div>RDR: LOCK</div>
                <div className="w-8 h-1 bg-black/60 rounded overflow-hidden border border-light-green/25">
                  <div className="h-full bg-heading-primary animate-pulse" style={{ width: '80%' }} />
                </div>
                <div>FPS: 60</div>
              </div>

              <div className="w-full h-full relative overflow-hidden bg-black/40">
                <div className="absolute inset-0 bg-heading-primary/5 mix-blend-color z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-heading-primary/5 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />
                <img
                  src="/avatar.png"
                  alt="Nguyễn Minh Hiếu Portrait"
                  className="w-full h-full object-cover grayscale brightness-90 contrast-110 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-light-green/0 via-heading-primary/70 to-light-green/0 shadow-[0_0_12px_#38b000]" />
            </div>
          </div>
        </section>

        {/* ABOUT ME SECTION */}
        <section id="about" className="space-y-6 scroll-mt-20">
          <div className="flex items-center space-x-3 border-b border-light-green/10 pb-2">
            <User className="text-heading-primary" size={22} />
            <h2 className="text-xl font-bold font-mono uppercase text-heading-primary tracking-widest">Hồ Sơ Giới Thiệu</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
              {(['story', 'setup', 'philosophy'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { audioService.playClick(); setAboutTab(tab); }}
                  className={`px-4 py-2.5 text-xs font-mono text-center md:text-left uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap md:whitespace-normal ${aboutTab === tab
                    ? 'bg-light-green/20 border border-light-green/40 text-heading-accent'
                    : 'text-text-green hover:text-text-light hover:bg-light-green/5'
                  }`}
                >
                  {tab === 'story' ? 'Con Đường / Tiểu Sử' : tab === 'setup' ? 'Hệ Thống / Thiết Bị' : 'Triết Lý Thiết Kế'}
                </button>
              ))}
            </div>

            <div className="md:col-span-9 glass-panel border border-light-green/20 rounded-xl p-6 text-sm text-text-green leading-relaxed font-mono">
              {aboutTab === 'story' && (
                <div className="space-y-4">
                  <h3 className="text-text-light font-bold text-base flex items-center gap-2">
                    <ChevronRight size={16} className="text-heading-accent" />
                    Tóm tắt chuyên môn
                  </h3>
                  <p>
                    Mình tên là Nguyễn Minh Hiếu, sinh ngày 16/06/2001, cựu sinh viên tốt nghiệp khóa K25 trường Đại học Văn Lang. Tính đến nay, mình đã có hơn 4 năm kinh nghiệm làm việc thực chiến liên tục tại một công ty duy nhất từ vị trí thực tập sinh lên nhân viên chính thức, đạt cấp độ Middle Developer. Mình chuyên lập trình giao diện Web App, Mobile App bằng Flutter và phát triển các sản phẩm trong hệ sinh thái Zalo Mini App. Sở hữu khả năng chuyển đổi thiết kế mượt mà từ Figma ra mã nguồn và làm chủ giao diện với CSS, Bootstrap, Tailwind CSS.
                  </p>
                </div>
              )}

              {aboutTab === 'setup' && (
                <div className="space-y-4">
                  <h3 className="text-text-light font-bold text-base flex items-center gap-2">
                    <ChevronRight size={16} className="text-heading-accent" />
                    Công nghệ & Thiết bị
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-black/30 border border-light-green/10 rounded-lg">
                      <h4 className="text-text-light font-bold text-xs uppercase mb-1">Hệ điều hành & Thiết bị</h4>
                      <ul className="text-xs space-y-1 text-text-green">
                        <li>• OS: Windows 10</li>
                        <li>• Tools: VS Code, Android Studio, Figma</li>
                        <li>• Terminal: Git Bash & MacOS Terminal</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-black/30 border border-light-green/10 rounded-lg">
                      <h4 className="text-text-light font-bold text-xs uppercase mb-1">Công cụ & Giao diện</h4>
                      <ul className="text-xs space-y-1 text-text-green">
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
                  <h3 className="text-text-light font-bold text-base flex items-center gap-2">
                    <ChevronRight size={16} className="text-heading-accent" />
                    Triết lý thiết kế
                  </h3>
                  <ul className="space-y-2 list-inside list-disc text-xs text-text-green">
                    <li><strong className="text-text-light">Tập trung vào sản phẩm:</strong> Thiết kế giao diện cá nhân hóa theo ngữ cảnh sản phẩm, tránh dùng mẫu rập khuôn.</li>
                    <li><strong className="text-text-light">Tối giản & tinh gọn:</strong> Loại bỏ các yếu tố trang trí thừa. Mọi hiệu ứng động phải phục vụ chức năng trải nghiệm.</li>
                    <li><strong className="text-text-light">Phản hồi sinh động:</strong> Kết hợp chuyển động mượt và âm thanh 8-bit tạo cảm giác tương tác cơ học chân thực.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="space-y-6 scroll-mt-20">
          <div className="flex items-center space-x-3 border-b border-light-green/10 pb-2">
            <Cpu className="text-heading-primary" size={22} />
            <h2 className="text-xl font-bold font-mono uppercase text-heading-primary tracking-widest">Bộ kỹ năng biên dịch</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {Object.entries(SKILLS_DATA).map(([key, skills]) => (
              <div key={key} className="glass-panel border border-light-green/20 rounded-xl p-5 hover:border-light-green/45 transition-all">
                <h3 className="text-sm font-bold text-text-light border-b border-light-green/10 pb-2 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-heading-accent" />
                  {key === 'frontend' ? 'Lập trình Frontend' : key === 'uiux' ? 'Giao diện & Chuyển động' : 'Công cụ & Tối ưu'}
                </h3>
                <div className="space-y-2">
                  {skills.map((s, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 py-2 border-b border-light-green/5 last:border-b-0 text-xs">
                      <span className="w-1 h-1 rounded-full bg-heading-primary" />
                      <span className="text-text-green font-mono">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="space-y-6 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-light-green/10 pb-2 gap-3">
            <div className="flex items-center space-x-3">
              <FolderGit2 className="text-heading-primary" size={22} />
              <h2 className="text-xl font-bold font-mono uppercase text-heading-primary tracking-widest">Kho mã nguồn dự án</h2>
            </div>

            <div className="flex overflow-x-auto whitespace-nowrap pb-2 sm:pb-0 scrollbar-none max-w-full sm:overflow-visible sm:whitespace-normal sm:flex-wrap gap-2 text-[10px] font-mono">
              {['All', 'Mobile App', 'Mini App', 'UI Components', 'Web App'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => { audioService.playClick(); setProjectFilter(filter); }}
                  className={`px-2.5 py-1 border rounded transition-all cursor-pointer ${projectFilter === filter
                    ? 'bg-heading-primary text-dark-green border-heading-primary font-bold shadow'
                    : 'border-light-green/25 text-text-green hover:text-text-light hover:border-light-green/50'
                  }`}
                >
                  {getVietnameseCategory(filter)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="glass-panel border border-light-green/20 rounded-xl p-5 hover:border-light-green/50 transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 relative"
              >
                <div className="absolute top-4 right-4 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-heading-primary font-bold">Trải Nghiệm Thử</span>
                  <ChevronRight size={12} className="text-heading-primary animate-pulse" />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono text-heading-accent tracking-widest block mb-1">
                    {getVietnameseCategory(p.category)}
                  </span>
                  <h3 className="text-lg font-bold font-mono text-text-light mb-2 group-hover:text-heading-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-text-green font-mono leading-relaxed mb-4">
                    {p.shortDesc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-light-green/10">
                  {p.tech.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-light-green/10 text-[9px] font-mono text-text-light rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* OVERLAY PROJECT SIMULATION MODAL */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}

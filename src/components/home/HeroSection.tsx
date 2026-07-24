import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTypewriter } from '../../hooks/useTypewriter';
import { audioService } from '../../services/audioService';
import { PortraitCard } from './PortraitCard';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const typedTitle = useTypewriter('Kiến tạo thế giới số bằng logic và tính thẩm mỹ.', 45);

  return (
    <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[65vh] pt-4 pb-8">
      <div className="lg:col-span-7 space-y-6">

        {/* Status Pill */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 liquid-glass-pill rounded-full text-xs font-medium text-sky-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>Sẵn sàng nhận dự án & công việc mới</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
          Xin chào, mình là <br />
          <span className="glow-text-ios">Minh Hiếu</span>
        </h1>

        <p className="text-base md:text-lg text-sky-300 font-mono min-h-12 h-auto max-w-xl leading-relaxed">
          {typedTitle}
          <span className="animate-caret border-r-2 border-sky-400 ml-1 inline-block h-5" />
        </p>

        <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-xl">
          Mình là lập trình viên Frontend & Mobile App chuyên xây dựng giao diện ứng dụng và tối ưu trải nghiệm người dùng. Tập trung vào Flutter, React, Vue, hệ sinh thái Zalo Mini App, thiết kế UI/UX trên Figma và lập trình CSS chuẩn chỉ.
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 pt-2 w-full sm:w-auto">
          <button
            onClick={() => { audioService.playClick(); navigate('/playground'); }}
            className="liquid-glass-accent-btn px-6 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto text-center"
          >
            <Sparkles size={15} />
            <span>Mở Retro CLI Terminal</span>
            <ArrowRight size={15} />
          </button>

          <button
            onClick={() => {
              audioService.playClick();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="liquid-glass-pill px-6 py-3 text-slate-200 hover:text-white rounded-2xl text-xs font-medium cursor-pointer w-full sm:w-auto text-center justify-center flex items-center bg-transparent"
          >
            Xem Các Dự Án
          </button>
        </div>
      </div>

      {/* 3D Portrait Card */}
      <PortraitCard />
    </section>
  );
};

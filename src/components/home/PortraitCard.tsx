import React from 'react';
import { useTilt3D } from '../../hooks/useTilt3D';

interface PortraitCardProps {
  avatarUrl?: string;
}

export const PortraitCard: React.FC<PortraitCardProps> = ({ avatarUrl }) => {
  const { cardRef, tiltStyle, handleMouseMove, handleMouseLeave } = useTilt3D(10);
  const imgSrc = avatarUrl || '/images/avatar.webp';

  return (
    <div className="lg:col-span-5" style={{ perspective: '1000px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        className="liquid-glass-card rounded-3xl p-3 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group aspect-square select-none cursor-pointer"
      >
        <div className="w-full h-full relative overflow-hidden rounded-2xl bg-slate-900/60">
          <div className="absolute inset-0 bg-linear-to-tr from-sky-500/10 via-transparent to-indigo-500/10 z-10 pointer-events-none" />
          <img
            src={imgSrc}
            alt="Nguyễn Minh Hiếu Portrait"
            className="w-full h-full object-cover brightness-95 group-hover:scale-105 group-hover:brightness-105 transition-all duration-700 ease-out"
          />
        </div>

        {/* Specular Bottom Light Line */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-sky-400/60 to-transparent shadow-[0_0_15px_#38bdf8]" />
      </div>
    </div>
  );
};

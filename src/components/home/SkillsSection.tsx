import React from 'react';
import { Cpu } from 'lucide-react';
import { SKILLS_DATA } from '../../constants/skills';

export const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="space-y-6 scroll-mt-24">
      <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-400">
          <Cpu size={20} />
        </div>
        <h2 className="text-xl font-bold font-sans text-white tracking-wide">Bộ kỹ năng chuyên môn</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {Object.entries(SKILLS_DATA).map(([key, skills]) => (
          <div key={key} className="liquid-glass-card rounded-3xl p-6 border border-white/15 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                {key === 'frontend' ? 'Lập trình Frontend' : key === 'uiux' ? 'Giao diện & Chuyển động' : 'Công cụ & Tối ưu'}
              </h3>
              <div className="space-y-2.5">
                {skills.map((s, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 py-1.5 border-b border-white/5 last:border-b-0 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400/70" />
                    <span className="text-slate-200 font-medium">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

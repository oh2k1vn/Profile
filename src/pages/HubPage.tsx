import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WORKSPACE_MODULES } from '../constants/modules';
import { useAuth } from '../contexts/AuthContext';
import { useSheetConnection } from '../contexts/SheetConnectionContext';
import { audioService } from '../services/audioService';

export default function HubPage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { status, error, checkConnection } = useSheetConnection();

  const visibleModules = WORKSPACE_MODULES.filter((m) => hasPermission(m.permission));

  return (
    <div className="space-y-6 pt-2">
      {status === 'error' && error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300 flex items-center justify-between gap-3">
          <span>Kết nối Google Sheets thất bại: {error}</span>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              void checkConnection();
            }}
            className="shrink-0 underline hover:text-white cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold glow-text-ios">Không Gian Làm Việc</h1>
        <p className="text-xs text-slate-400">Chọn module để truy cập và quản lý dữ liệu</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => {
                audioService.playClick();
                navigate(mod.path);
              }}
              className="liquid-glass-card rounded-3xl p-5 text-left flex flex-col justify-between gap-5 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${mod.accentClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="liquid-glass-pill w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-white transition">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">{mod.title}</h2>
                <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}

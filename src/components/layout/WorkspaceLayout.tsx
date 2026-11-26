import { Suspense } from 'react';
import { ArrowLeft, LayoutGrid, LogOut } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSheetConnection } from '../../contexts/SheetConnectionContext';
import { audioService } from '../../services/audioService';

function RouteLoadingFallback() {
  return (
    <div className="liquid-glass rounded-3xl p-8 text-center text-xs text-slate-400">
      Đang tải module...
    </div>
  );
}

export default function WorkspaceLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { status, tabCount, error, checkConnection } = useSheetConnection();

  const isHub = location.pathname === '/';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090e] text-slate-100 px-4 pb-12 pt-4 sm:pt-6">
      {/* Ambient Light Mesh */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-sky-500/20 via-blue-600/15 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-600/15 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-teal-500/15 via-sky-600/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Floating iOS Liquid Glass Navbar */}
        <nav className="sticky top-3 sm:top-5 z-30 flex items-center justify-between gap-2 rounded-full px-4 sm:px-6 py-2.5 liquid-glass">
          {isHub ? (
            <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-200">
              <LayoutGrid className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Workspace Modules</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                audioService.playClick();
                navigate('/');
              }}
              className="liquid-glass-pill rounded-full px-3.5 py-1.5 text-xs text-slate-200 hover:text-white inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Danh sách module
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                audioService.playClick();
                void checkConnection();
              }}
              title={error || 'Nhấn để kiểm tra lại kết nối Google Sheets'}
              className={`liquid-glass-pill rounded-full px-3 py-1.5 text-[11px] inline-flex items-center gap-1.5 transition cursor-pointer ${
                status === 'connected'
                  ? 'text-emerald-300 border-emerald-400/25'
                  : status === 'checking'
                    ? 'text-sky-300'
                    : 'text-rose-300 border-rose-400/35'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === 'connected'
                    ? 'bg-emerald-400'
                    : status === 'checking'
                      ? 'bg-sky-400 animate-pulse'
                      : 'bg-rose-400'
                }`}
              />
              <span>
                {status === 'connected'
                  ? `Sheets OK (${tabCount})`
                  : status === 'checking'
                    ? 'Đang kết nối...'
                    : 'Sheets lỗi'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                audioService.playClick();
                logout();
              }}
              className="liquid-glass-pill rounded-full px-3.5 py-1.5 text-xs text-slate-300 hover:text-white inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Khóa
            </button>
          </div>
        </nav>

        <Suspense fallback={<RouteLoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

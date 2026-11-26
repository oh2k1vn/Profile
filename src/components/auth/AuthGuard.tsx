import type { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth, type ModulePermission } from '../../contexts/AuthContext';
import AuthPage from '../../pages/AuthPage';
import { audioService } from '../../services/audioService';

interface AuthGuardProps {
  children: ReactNode;
  requiredPermission?: ModulePermission;
}

export default function AuthGuard({ children, requiredPermission }: AuthGuardProps) {
  const { isAuthenticated, isLoading, hasPermission, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center">
        <div className="liquid-glass rounded-3xl px-6 py-4 flex items-center gap-3 text-sm text-slate-300">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400 animate-pulse" />
          Đang xác thực phiên mã hóa...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 px-4 flex items-center justify-center">
        <div className="liquid-glass rounded-3xl p-8 max-w-md w-full text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-white">Không có quyền truy cập</h2>
          <p className="text-sm text-slate-400">
            Phiên hiện tại không có quyền mở module <span className="text-sky-400 font-medium">{requiredPermission}</span>.
          </p>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              logout();
            }}
            className="liquid-glass-pill rounded-full px-5 py-2 text-sm text-slate-200 hover:border-white/30 transition cursor-pointer"
          >
            Đăng xuất &amp; đổi mã
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

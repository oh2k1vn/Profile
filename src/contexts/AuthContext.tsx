import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { verifyPasscode } from '../lib/auth/crypto';
import { sheetsClient, type ServerAuthSession } from '../lib/sheets';

export type ModulePermission =
  | 'dashboard'
  | 'profile'
  | 'skills'
  | 'projects'
  | 'posts'
  | 'categories'
  | 'guestbook'
  | 'database'
  | 'finance';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  isBackendConfigured: boolean;
  isPasscodeConfigured: boolean;
  session: ServerAuthSession | null;
  hasPermission: (permission: ModulePermission) => boolean;
  login: (passcode: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const TOKEN_STORAGE_KEY = 'portfolio_hmac_auth_token';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const isBackendConfigured = sheetsClient.isConfigured();
  const configuredSalt = (import.meta.env.VITE_AUTH_SALT ?? '').trim();
  const configuredHash = (import.meta.env.VITE_AUTH_PASSCODE_HASH ?? '').trim();
  const isPasscodeConfigured = configuredSalt.length > 0 && configuredHash.length > 0;

  const [session, setSession] = useState<ServerAuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sheetsClient.setAuthToken(null);
    setSession(null);
  }, []);

  useEffect(() => {
    sheetsClient.setOnUnauthorized(logout);
    return () => {
      sheetsClient.setOnUnauthorized(null);
    };
  }, [logout]);

  // Verify stored 24h HMAC token directly with Google Apps Script on mount
  useEffect(() => {
    let active = true;

    async function verifyExistingToken() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken || !isBackendConfigured || !isPasscodeConfigured) {
        sheetsClient.setAuthToken(null);
        if (active) setIsLoading(false);
        return;
      }

      try {
        const { session: verifiedSession } = await sheetsClient.verifyAuthToken(storedToken);
        if (!active) return;

        if (verifiedSession.expiresAt <= Date.now()) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          sheetsClient.setAuthToken(null);
          setSession(null);
        } else {
          sheetsClient.setAuthToken(storedToken);
          setSession(verifiedSession);
        }
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        sheetsClient.setAuthToken(null);
        if (active) setSession(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void verifyExistingToken();
    return () => {
      active = false;
    };
  }, [isBackendConfigured, isPasscodeConfigured]);

  // Auto-expire session at exact expiresAt (24h) and redirect back to AuthPage
  useEffect(() => {
    if (!session) return;

    const remainingMs = session.expiresAt - Date.now();
    if (remainingMs <= 0) {
      logout();
      return;
    }

    const timer = window.setTimeout(() => {
      logout();
    }, remainingMs);

    return () => window.clearTimeout(timer);
  }, [session, logout]);

  // Sync logout across browser tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === TOKEN_STORAGE_KEY && !e.newValue) {
        sheetsClient.setAuthToken(null);
        setSession(null);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(
    async (passcode: string): Promise<{ ok: boolean; error?: string }> => {
      if (!isPasscodeConfigured) {
        return {
          ok: false,
          error: 'Chưa cấu hình VITE_AUTH_SALT và VITE_AUTH_PASSCODE_HASH trong .env.',
        };
      }
      if (!isBackendConfigured) {
        return {
          ok: false,
          error: 'Chưa cấu hình VITE_SHEETS_WEBAPP_URL trong .env.',
        };
      }

      const validLocal = await verifyPasscode(passcode, configuredHash, configuredSalt);
      if (!validLocal) {
        return { ok: false, error: 'Mã truy cập không chính xác.' };
      }

      try {
        const { token, session: serverSession } = await sheetsClient.loginWithPasscode(passcode);
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        sheetsClient.setAuthToken(token);
        setSession(serverSession);
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : 'Xác thực server thất bại.',
        };
      }
    },
    [isBackendConfigured, isPasscodeConfigured, configuredHash, configuredSalt],
  );

  const hasPermission = useCallback(
    (permission: ModulePermission) => {
      if (!session) return false;
      return session.permissions.includes(permission);
    },
    [session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session),
      isLoading,
      isBackendConfigured,
      isPasscodeConfigured,
      session,
      hasPermission,
      login,
      logout,
    }),
    [session, isLoading, isBackendConfigured, isPasscodeConfigured, hasPermission, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

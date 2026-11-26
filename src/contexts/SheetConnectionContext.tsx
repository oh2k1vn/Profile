import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { db } from '../services/db';
import type { SheetTabMeta } from '../types/database';

export type ConnectionStatus = 'checking' | 'connected' | 'error';

export interface SheetConnectionState {
  status: ConnectionStatus;
  tabCount: number;
  tabs: SheetTabMeta[] | null;
  error: string | null;
  checkConnection: () => Promise<void>;
}

const SheetConnectionContext = createContext<SheetConnectionState | null>(null);

export function SheetConnectionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [tabs, setTabs] = useState<SheetTabMeta[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    setStatus('checking');
    setError(null);
    try {
      const meta = await db.client.getMeta();
      setTabs(meta);
      setStatus('connected');
    } catch (err) {
      setTabs(null);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Không thể kết nối Google Sheets');
    }
  }, []);

  useEffect(() => {
    void checkConnection();
  }, [checkConnection]);

  const value = useMemo<SheetConnectionState>(
    () => ({
      status,
      tabCount: tabs?.length ?? 0,
      tabs,
      error,
      checkConnection,
    }),
    [status, tabs, error, checkConnection],
  );

  return (
    <SheetConnectionContext.Provider value={value}>
      {children}
    </SheetConnectionContext.Provider>
  );
}

export function useSheetConnection(): SheetConnectionState {
  const ctx = useContext(SheetConnectionContext);
  if (!ctx) {
    throw new Error('useSheetConnection must be used within SheetConnectionProvider');
  }
  return ctx;
}

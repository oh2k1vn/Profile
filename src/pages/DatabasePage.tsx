import { useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useSheetConnection } from '../contexts/SheetConnectionContext';
import { audioService } from '../services/audioService';
import { db } from '../services/db';
import { SHEETS_SCHEMA } from '../types/database';

export default function DatabasePage() {
  const configured = db.client.isConfigured();
  const hasToken = db.client.hasAuthToken();
  const { status, tabCount, tabs, error: connError, checkConnection } = useSheetConnection();

  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const loading = status === 'checking';
  const error = syncError ?? connError;

  async function handleSyncSchema() {
    audioService.playClick();
    setSyncing(true);
    setSyncError(null);
    setSyncMessage(null);
    try {
      const results = await db.client.syncSchema(SHEETS_SCHEMA);
      const createdCount = results.filter((r) => r.created).length;
      const addedColsCount = results.reduce((acc, r) => acc + r.addedColumns.length, 0);
      setSyncMessage(`Đã đồng bộ ${results.length} tab (tạo mới ${createdCount} tab, thêm ${addedColsCount} cột).`);
      await checkConnection();
      audioService.playSuccess();
    } catch (err) {
      audioService.playError();
      setSyncError(err instanceof Error ? err.message : 'Đồng bộ schema thất bại');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto liquid-glass rounded-3xl p-6 space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-white">Cơ sở dữ liệu Google Sheets</h1>
        <p className="text-xs text-slate-400">Đồng bộ schema tự động từ code sang Google Sheets</p>
      </div>

      <div className="liquid-glass-pill rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <span
              className={`h-2 w-2 rounded-full ${
                status === 'connected'
                  ? 'bg-emerald-400'
                  : status === 'checking'
                    ? 'bg-sky-400 animate-pulse'
                    : 'bg-rose-400'
              }`}
            />
            {status === 'connected'
              ? `Kết nối thành công (${tabCount} tabs)`
              : status === 'checking'
                ? 'Đang kiểm tra...'
                : 'Kết nối thất bại'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <span className={`h-2 w-2 rounded-full ${hasToken ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            Token {hasToken ? 'OK' : 'Chưa có'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSyncSchema}
            disabled={syncing || !configured}
            className="liquid-glass-pill rounded-full px-3 py-1.5 text-xs font-medium text-sky-300 hover:border-sky-400/50 inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3 h-3 ${syncing ? 'animate-pulse' : ''}`} />
            {syncing ? 'Đang đồng bộ' : 'Sync Schema'}
          </button>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              void checkConnection();
            }}
            disabled={loading || !configured}
            className="liquid-glass-accent-btn rounded-full px-3.5 py-1.5 text-xs font-medium text-white inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Đang kiểm tra' : 'Kiểm tra'}
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-300">
          {syncMessage}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
          {error}
        </div>
      )}

      {tabs && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {tabs.map((tab) => (
            <div key={tab.name} className="liquid-glass-pill rounded-2xl px-3.5 py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-white truncate">{tab.name}</span>
              <span className="text-[11px] text-sky-400 ml-2 shrink-0">{tab.rowCount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

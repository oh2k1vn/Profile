import { DEBT_CATEGORIES, formatVND } from '../../constants/finance';
import { audioService } from '../../services/audioService';
import type { DebtCategory } from '../../types/database';

interface FinanceSummaryCardsProps {
  stats: {
    totalRemaining: number;
    totalPaid: number;
    progressPct: number;
    monthlyTotal: number;
    totalRolloverFees: number;
    activeCount: number;
    overdueCount: number;
    byCategory: Record<DebtCategory, { remaining: number; count: number }>;
  };
  categoryFilter: DebtCategory | 'all';
  onSelectCategory: (category: DebtCategory | 'all') => void;
}

export default function FinanceSummaryCards({
  stats,
  categoryFilter,
  onSelectCategory,
}: FinanceSummaryCardsProps) {
  return (
    <>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="liquid-glass rounded-2xl p-3.5 sm:p-4 space-y-1 min-w-0">
          <p className="text-xs text-slate-400 truncate">Tổng số dư còn lại</p>
          <p className="text-base sm:text-xl font-semibold text-white whitespace-nowrap tabular-nums truncate">
            {formatVND(stats.totalRemaining)}
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-3.5 sm:p-4 space-y-1 min-w-0">
          <p className="text-xs text-slate-400 truncate">Đã thanh toán ({stats.progressPct}%)</p>
          <p className="text-base sm:text-xl font-semibold text-emerald-400 whitespace-nowrap tabular-nums truncate">
            {formatVND(stats.totalPaid)}
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-3.5 sm:p-4 space-y-1 min-w-0">
          <p className="text-xs text-slate-400 truncate">Dự chi / kỳ</p>
          <p className="text-base sm:text-xl font-semibold text-sky-400 whitespace-nowrap tabular-nums truncate">
            {formatVND(stats.monthlyTotal)}
          </p>
          {stats.totalRolloverFees > 0 && (
            <p className="text-[11px] text-amber-300 whitespace-nowrap tabular-nums truncate">
              Phí đáo 2.2%: {formatVND(stats.totalRolloverFees)}
            </p>
          )}
        </div>
        <div className="liquid-glass rounded-2xl p-3.5 sm:p-4 space-y-1 min-w-0">
          <p className="text-xs text-slate-400 truncate">Đang theo dõi</p>
          <p className="text-base sm:text-xl font-semibold text-white whitespace-nowrap tabular-nums">
            {stats.activeCount}
            {stats.overdueCount > 0 && (
              <span className="ml-1.5 text-xs font-medium text-rose-400">({stats.overdueCount} quá hạn)</span>
            )}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {DEBT_CATEGORIES.map((cat) => {
          const info = stats.byCategory[cat.value];
          const isSelected = categoryFilter === cat.value;
          const pct =
            stats.totalRemaining > 0
              ? Math.min(100, Math.round((info.remaining / stats.totalRemaining) * 100))
              : 0;

          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => {
                audioService.playClick();
                onSelectCategory(isSelected ? 'all' : cat.value);
              }}
              className={`text-left rounded-2xl p-3.5 transition min-w-0 cursor-pointer ${
                isSelected
                  ? 'liquid-glass border-sky-400/50 ring-1 ring-sky-400/30'
                  : 'liquid-glass-pill hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-300 truncate">{cat.label}</span>
                <span className="text-[11px] text-slate-400 shrink-0 tabular-nums">{info.count}</span>
              </div>
              <p className="text-sm font-semibold text-white mt-1 whitespace-nowrap tabular-nums truncate">
                {formatVND(info.remaining)}
              </p>
              <div className="mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full ${cat.accentBar}`} style={{ width: `${pct}%` }} />
              </div>
            </button>
          );
        })}
      </section>
    </>
  );
}

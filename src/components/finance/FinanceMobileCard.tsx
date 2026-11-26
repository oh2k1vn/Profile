import { useState } from 'react';
import { CheckCircle2, Pencil, Repeat, Trash2 } from 'lucide-react';
import {
  calculateRolloverFee,
  DEBT_CATEGORY_MAP,
  DEBT_STATUS_META,
  DEFAULT_ROLLOVER_FEE_RATE,
  formatVND,
  getPaymentDueAlert,
} from '../../constants/finance';
import { audioService } from '../../services/audioService';
import type { DebtRecord } from '../../types/database';

interface FinanceMobileCardProps {
  item: DebtRecord;
  onQuickPay: (item: DebtRecord) => Promise<void>;
  onRollover: (item: DebtRecord) => void;
  onEdit: (item: DebtRecord) => void;
  onDelete: (id: string) => Promise<boolean>;
}

export default function FinanceMobileCard({
  item,
  onQuickPay,
  onRollover,
  onEdit,
  onDelete,
}: FinanceMobileCardProps) {
  const [confirming, setConfirming] = useState(false);

  const total = Number(item.totalAmount) || 0;
  const paid = Number(item.paidAmount) || 0;
  const remaining = Math.max(0, total - paid);
  const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  const catMeta = DEBT_CATEGORY_MAP[item.category] ?? DEBT_CATEGORY_MAP.personal_loan;
  const statusMeta = DEBT_STATUS_META[item.status] ?? DEBT_STATUS_META.active;
  const dueAlert = getPaymentDueAlert(item);
  const totalTerms = Number(item.totalTerms) || 0;
  const currentTerm = Number(item.currentTerm) || 0;
  const remainingTerms = totalTerms > 0 ? Math.max(0, totalTerms - currentTerm) : 0;
  const rolloverRate = Number(item.rolloverFeeRate) || DEFAULT_ROLLOVER_FEE_RATE;

  return (
    <article className={`liquid-glass rounded-3xl p-4 space-y-3 border ${dueAlert?.cardClass ?? ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
          <p className="text-[11px] text-slate-400">
            {item.lender || '—'} {item.dueDay ? `• Ngày ${item.dueDay}` : ''}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] ${statusMeta.badgeClass}`}>
          {statusMeta.label}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] ${catMeta.badgeClass}`}>
          {catMeta.label}
        </span>
        {totalTerms > 0 && (
          <span className="rounded-full bg-indigo-500/15 border border-indigo-400/30 px-2 py-0.5 text-[10px] text-indigo-300">
            {currentTerm}/{totalTerms} kỳ • Còn {remainingTerms} kỳ
          </span>
        )}
        {dueAlert && (
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${dueAlert.badgeClass}`}>
            {dueAlert.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5 liquid-glass-pill rounded-2xl p-3">
        <div>
          <p className="text-[10px] text-slate-400">Đóng kỳ này</p>
          <p className="text-sm font-semibold text-sky-300">
            {formatVND(Number(item.monthlyPayment) || 0)}
          </p>
          {item.category === 'credit_card' && item.status !== 'paid' && (
            <p className="text-[10px] text-amber-300 mt-0.5">
              Đáo {rolloverRate}%: {formatVND(calculateRolloverFee(remaining, rolloverRate))}
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] text-slate-400">Còn lại ({pct}%)</p>
          <p className="text-sm font-semibold text-white">{formatVND(remaining)}</p>
          <div className="mt-1.5 h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {totalTerms > 0 && totalTerms <= 18 && (
        <div className="flex items-center gap-1" title={`Đã đóng ${currentTerm}/${totalTerms} kỳ`}>
          {Array.from({ length: totalTerms }, (_, idx) => (
            <span
              key={idx}
              className={`h-1.5 flex-1 rounded-full ${idx < currentTerm ? 'bg-emerald-400' : 'bg-white/15'}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-0.5">
        {item.category === 'credit_card' && item.status !== 'paid' && (
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              onRollover(item);
            }}
            className="liquid-glass-pill rounded-full px-3 py-1.5 text-[11px] text-amber-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <Repeat className="w-3 h-3" />
            Đáo thẻ
          </button>
        )}
        {item.status !== 'paid' && Number(item.monthlyPayment) > 0 && (
          <button
            type="button"
            onClick={() => void onQuickPay(item)}
            className="liquid-glass-pill rounded-full px-3 py-1.5 text-[11px] text-emerald-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3" />
            Thanh toán
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            audioService.playClick();
            onEdit(item);
          }}
          className="liquid-glass-pill w-8 h-8 rounded-full flex items-center justify-center text-slate-300 cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {confirming ? (
          <button
            type="button"
            onClick={async () => {
              if (await onDelete(item.id)) setConfirming(false);
            }}
            className="rounded-full bg-rose-500/20 border border-rose-500/40 px-3 py-1.5 text-[11px] text-rose-300 cursor-pointer"
          >
            Xác nhận
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setConfirming(true);
            }}
            className="liquid-glass-pill w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-400 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </article>
  );
}

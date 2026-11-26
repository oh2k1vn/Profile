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

interface FinanceTableRowProps {
  item: DebtRecord;
  onQuickPay: (item: DebtRecord) => Promise<void>;
  onRollover: (item: DebtRecord) => void;
  onEdit: (item: DebtRecord) => void;
  onDelete: (id: string) => Promise<boolean>;
}

export default function FinanceTableRow({
  item,
  onQuickPay,
  onRollover,
  onEdit,
  onDelete,
}: FinanceTableRowProps) {
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
    <tr className={`hover:bg-white/[0.04] transition ${dueAlert?.rowClass ?? ''}`}>
      <td className="py-3.5 px-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-white">{item.title}</span>
          {totalTerms > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
              {currentTerm}/{totalTerms} kỳ
              {remainingTerms > 0 ? ` • Còn ${remainingTerms} kỳ` : ' • Đủ kỳ'}
            </span>
          )}
          {dueAlert && (
            <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${dueAlert.badgeClass}`}>
              {dueAlert.label}
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5">
          {item.lender || '—'} {item.dueDay ? `• Ngày ${item.dueDay}` : ''}
          {Number(item.principalAmount) > 0 && Number(item.principalAmount) !== total
            ? ` • Gốc ${formatVND(Number(item.principalAmount))}`
            : ''}
        </div>
        {totalTerms > 0 && totalTerms <= 18 && (
          <div className="flex items-center gap-1 mt-1.5" title={`Đã đóng ${currentTerm}/${totalTerms} kỳ`}>
            {Array.from({ length: totalTerms }, (_, idx) => (
              <span
                key={idx}
                className={`h-1.5 flex-1 max-w-3 rounded-full ${idx < currentTerm ? 'bg-emerald-400' : 'bg-white/15'}`}
              />
            ))}
          </div>
        )}
      </td>
      <td className="py-3.5 px-3">
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] ${catMeta.badgeClass}`}>
          {catMeta.label}
        </span>
      </td>
      <td className="py-3.5 px-3 min-w-[140px]">
        <div className="font-medium text-white">{formatVND(remaining)}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] text-slate-400">{pct}%</span>
        </div>
      </td>
      <td className="py-3.5 px-3 hidden md:table-cell text-slate-300">
        <div>{formatVND(Number(item.monthlyPayment) || 0)}</div>
        {totalTerms > 0 && (
          <div className="text-[11px] text-indigo-300">
            {remainingTerms > 0 ? `Còn ${remainingTerms}/${totalTerms} kỳ` : `Hoàn tất ${totalTerms} kỳ`}
          </div>
        )}
        {item.category === 'credit_card' && item.status !== 'paid' && (
          <div className="text-[11px] text-amber-300">
            Đáo {rolloverRate}%: {formatVND(calculateRolloverFee(remaining, rolloverRate))}
          </div>
        )}
      </td>
      <td className="py-3.5 px-3 hidden sm:table-cell">
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] ${statusMeta.badgeClass}`}>
          {statusMeta.label}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center justify-end gap-1.5">
          {item.category === 'credit_card' && item.status !== 'paid' && (
            <button
              type="button"
              onClick={() => {
                audioService.playClick();
                onRollover(item);
              }}
              className="liquid-glass-pill rounded-full px-2.5 py-1 text-[11px] text-amber-300 hover:border-amber-400/50 inline-flex items-center gap-1 cursor-pointer"
            >
              <Repeat className="w-3 h-3" />
              <span className="hidden lg:inline">Đáo thẻ</span>
            </button>
          )}
          {item.status !== 'paid' && Number(item.monthlyPayment) > 0 && (
            <button
              type="button"
              onClick={() => void onQuickPay(item)}
              className="liquid-glass-pill rounded-full px-2.5 py-1 text-[11px] text-emerald-300 hover:border-emerald-400/50 inline-flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden lg:inline">Thanh toán</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              onEdit(item);
            }}
            className="liquid-glass-pill w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
          </button>
          {confirming ? (
            <button
              type="button"
              onClick={async () => {
                if (await onDelete(item.id)) setConfirming(false);
              }}
              className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 text-[11px] text-rose-300 hover:bg-rose-500/30 cursor-pointer"
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
              className="liquid-glass-pill w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

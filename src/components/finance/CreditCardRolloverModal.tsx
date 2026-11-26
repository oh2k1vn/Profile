import { useEffect, useState, type FormEvent } from 'react';
import { Repeat, X } from 'lucide-react';
import {
  calculateRolloverFee,
  DEFAULT_ROLLOVER_FEE_RATE,
  formatVND,
  getNextRolloverDueDate,
} from '../../constants/finance';
import { audioService } from '../../services/audioService';
import type { DebtRecord } from '../../types/database';

interface CreditCardRolloverModalProps {
  card: DebtRecord | null;
  saving: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    cardId: string;
    feeRate: number;
    feeAmount: number;
    nextDueDate: string;
    noteEntry: string;
  }) => Promise<void>;
}

export default function CreditCardRolloverModal({
  card,
  saving,
  onClose,
  onConfirm,
}: CreditCardRolloverModalProps) {
  const [feeRate, setFeeRate] = useState(DEFAULT_ROLLOVER_FEE_RATE);
  const [nextDueDate, setNextDueDate] = useState('');

  useEffect(() => {
    if (!card) return;
    setFeeRate(Number(card.rolloverFeeRate) || DEFAULT_ROLLOVER_FEE_RATE);
    setNextDueDate(getNextRolloverDueDate(card.dueDate, Number(card.dueDay)));
  }, [card]);

  if (!card) return null;

  const remaining = Math.max(0, (Number(card.totalAmount) || 0) - (Number(card.paidAmount) || 0));
  const feeAmount = calculateRolloverFee(remaining, feeRate);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!card) return;
    audioService.playClick();
    const todayStr = new Date().toLocaleDateString('vi-VN');
    const noteEntry = `Đáo thẻ ${feeRate}% (-${formatVND(feeAmount)}) ngày ${todayStr}`;
    await onConfirm({
      cardId: card.id,
      feeRate,
      feeAmount,
      nextDueDate,
      noteEntry,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4">
      <div className="liquid-glass w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-5">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-white/25 sm:hidden" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Đáo thẻ tín dụng</h2>
              <p className="text-xs text-slate-400">{card.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              onClose();
            }}
            className="liquid-glass-pill w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="liquid-glass-pill rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Số dư cần đáo</span>
              <span className="font-semibold text-white">{formatVND(remaining)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Phí dịch vụ ({feeRate}%)</span>
              <span className="font-semibold text-amber-300">{formatVND(feeAmount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Phí đáo (%)</label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={feeRate}
                onChange={(e) => setFeeRate(Number(e.target.value))}
                className="glass-input w-full rounded-2xl px-3.5 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Hạn kỳ tiếp theo</label>
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="glass-input w-full rounded-2xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                audioService.playClick();
                onClose();
              }}
              className="liquid-glass-pill rounded-full px-4 py-2 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="liquid-glass-accent-btn rounded-full px-5 py-2 text-xs font-medium text-white disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Đang cập nhật...' : `Xác nhận đáo (${formatVND(feeAmount)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

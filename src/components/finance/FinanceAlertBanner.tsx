import { AlertTriangle } from 'lucide-react';
import { formatVND, type PaymentDueAlert } from '../../constants/finance';
import { audioService } from '../../services/audioService';
import type { DebtRecord } from '../../types/database';

interface FinanceAlertBannerProps {
  alerts: Array<{ item: DebtRecord; alert: PaymentDueAlert }>;
  onSelectItem: (item: DebtRecord) => void;
}

export default function FinanceAlertBanner({ alerts, onSelectItem }: FinanceAlertBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <section className="liquid-glass rounded-2xl p-4 space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-medium text-white">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Sắp đến hạn thanh toán ({alerts.length} khoản)</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {alerts.map(({ item, alert }) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              audioService.playClick();
              onSelectItem(item);
            }}
            className={`max-w-full rounded-full border px-3 py-1 text-[11px] inline-flex items-center gap-1.5 transition hover:opacity-90 whitespace-nowrap cursor-pointer ${alert.badgeClass}`}
          >
            <span className="font-medium truncate">{item.title}</span>
            <span className="opacity-80 shrink-0">• {alert.label}</span>
            {Number(item.monthlyPayment) > 0 && (
              <span className="opacity-90 shrink-0 tabular-nums">({formatVND(Number(item.monthlyPayment))})</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

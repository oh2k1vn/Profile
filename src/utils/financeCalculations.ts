import type { DebtCategory, DebtRecord } from '../types/database';

export const DEFAULT_ROLLOVER_FEE_RATE = 2.2;

export function computeFinanceStats(items: DebtRecord[]) {
  let totalOriginal = 0;
  let totalPaid = 0;
  let totalRemaining = 0;
  let monthlyTotal = 0;
  let totalRolloverFees = 0;
  let activeCount = 0;
  let overdueCount = 0;

  const byCategory: Record<DebtCategory, { remaining: number; count: number }> = {
    credit_card: { remaining: 0, count: 0 },
    installment: { remaining: 0, count: 0 },
    personal_loan: { remaining: 0, count: 0 },
    paylater_wallet: { remaining: 0, count: 0 },
  };

  for (const item of items) {
    const total = Number(item.totalAmount) || 0;
    const paid = Number(item.paidAmount) || 0;
    const remaining = Math.max(0, total - paid);

    totalOriginal += total;
    totalPaid += Math.min(paid, total);
    totalRemaining += remaining;

    if (item.status !== 'paid') {
      monthlyTotal += Number(item.monthlyPayment) || 0;
      if (item.category === 'credit_card') {
        const rate = Number(item.rolloverFeeRate) || DEFAULT_ROLLOVER_FEE_RATE;
        totalRolloverFees += calculateRolloverFee(remaining, rate);
      }
    }
    if (item.status === 'active') activeCount += 1;
    if (item.status === 'overdue') overdueCount += 1;

    const cat = item.category in byCategory ? item.category : 'personal_loan';
    byCategory[cat].remaining += remaining;
    byCategory[cat].count += 1;
  }

  const progressPct = totalOriginal > 0 ? Math.round((totalPaid / totalOriginal) * 100) : 0;
  return { totalPaid, totalRemaining, monthlyTotal, totalRolloverFees, activeCount, overdueCount, progressPct, byCategory };
}

export interface PaymentDueAlert {
  level: 'urgent' | 'soon';
  daysLeft: number;
  label: string;
  badgeClass: string;
  rowClass: string;
  cardClass: string;
}

export function calculateRolloverFee(
  remainingAmount: number,
  feeRate = DEFAULT_ROLLOVER_FEE_RATE,
): number {
  const safeAmount = Math.max(0, Number(remainingAmount) || 0);
  const safeRate = Math.max(0, Number(feeRate) || 0);
  return Math.round((safeAmount * safeRate) / 100);
}

export function getNextRolloverDueDate(currentDueDate: string, dueDay: number): string {
  const base = currentDueDate ? new Date(`${currentDueDate}T00:00:00`) : new Date();
  const validBase = Number.isNaN(base.getTime()) ? new Date() : base;
  const nextMonth = validBase.getMonth() + 1;
  const nextYear = validBase.getFullYear() + Math.floor(nextMonth / 12);
  const normMonth = nextMonth % 12;
  const targetDay =
    Number.isFinite(dueDay) && dueDay >= 1 && dueDay <= 31 ? dueDay : validBase.getDate();
  const clampedDay = Math.min(targetDay, new Date(nextYear, normMonth + 1, 0).getDate());

  const yyyy = String(nextYear);
  const mm = String(normMonth + 1).padStart(2, '0');
  const dd = String(clampedDay).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function getNextPaymentTimestamp(item: DebtRecord, now = new Date()): number {
  if (item.status === 'paid') return Number.POSITIVE_INFINITY;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (item.dueDate) {
    const exactDue = new Date(`${item.dueDate}T00:00:00`);
    if (!Number.isNaN(exactDue.getTime()) && exactDue.getTime() < today.getTime()) {
      return exactDue.getTime();
    }
  }

  const dueDay = Number(item.dueDay);
  if (Number.isFinite(dueDay) && dueDay >= 1 && dueDay <= 31) {
    const year = today.getFullYear();
    const month = today.getMonth();
    const clampedThisMonth = Math.min(dueDay, daysInMonth(year, month));
    const candidate = new Date(year, month, clampedThisMonth);

    if (candidate.getTime() >= today.getTime()) {
      return candidate.getTime();
    }

    const nextMonth = month + 1;
    const nextYear = year + Math.floor(nextMonth / 12);
    const normMonth = nextMonth % 12;
    const clampedNextMonth = Math.min(dueDay, daysInMonth(nextYear, normMonth));
    return new Date(nextYear, normMonth, clampedNextMonth).getTime();
  }

  if (item.dueDate) {
    const parsed = new Date(`${item.dueDate}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();
  }

  return Number.MAX_SAFE_INTEGER;
}

export function getPaymentDueAlert(item: DebtRecord, now = new Date()): PaymentDueAlert | null {
  if (item.status === 'paid') return null;

  if (item.status === 'overdue') {
    return {
      level: 'urgent',
      daysLeft: 0,
      label: 'Đã quá hạn',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      rowClass: 'bg-rose-500/[0.06] border-l-2 border-l-rose-400',
      cardClass: 'border-rose-500/45 bg-rose-500/[0.06]',
    };
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (item.dueDate) {
    const exactDue = new Date(`${item.dueDate}T00:00:00`);
    if (!Number.isNaN(exactDue.getTime()) && exactDue.getTime() < today.getTime()) {
      return {
        level: 'urgent',
        daysLeft: 0,
        label: 'Đã quá hạn',
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        rowClass: 'bg-rose-500/[0.06] border-l-2 border-l-rose-400',
        cardClass: 'border-rose-500/45 bg-rose-500/[0.06]',
      };
    }
  }

  const nextTs = getNextPaymentTimestamp(item, now);
  if (!Number.isFinite(nextTs) || nextTs === Number.MAX_SAFE_INTEGER) return null;

  const daysLeft = Math.round((nextTs - today.getTime()) / 86_400_000);
  if (daysLeft < 0 || daysLeft > 7) return null;

  if (daysLeft < 4) {
    return {
      level: 'urgent',
      daysLeft,
      label: daysLeft === 0 ? 'Đến hạn hôm nay' : `Còn ${daysLeft} ngày`,
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      rowClass: 'bg-rose-500/[0.06] border-l-2 border-l-rose-400',
      cardClass: 'border-rose-500/45 bg-rose-500/[0.06]',
    };
  }

  return {
    level: 'soon',
    daysLeft,
    label: `Còn ${daysLeft} ngày`,
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    rowClass: 'bg-amber-500/[0.05] border-l-2 border-l-amber-400',
    cardClass: 'border-amber-500/45 bg-amber-500/[0.05]',
  };
}

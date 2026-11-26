import type { DebtCategory, DebtStatus } from '../types/database';

export {
  calculateRolloverFee,
  DEFAULT_ROLLOVER_FEE_RATE,
  getDaysUntilDue,
  getNextPaymentTimestamp,
  getNextRolloverDueDate,
  getPaymentDueAlert,
  type PaymentDueAlert,
} from '../utils/financeCalculations';

export interface DebtCategoryMeta {
  value: DebtCategory;
  label: string;
  badgeClass: string;
  accentBar: string;
}

export const DEBT_CATEGORIES: readonly DebtCategoryMeta[] = [
  {
    value: 'credit_card',
    label: 'Thẻ tín dụng',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    accentBar: 'bg-sky-400',
  },
  {
    value: 'installment',
    label: 'Trả góp theo kỳ',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/30',
    accentBar: 'bg-indigo-400',
  },
  {
    value: 'personal_loan',
    label: 'Khoản cá nhân',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
    accentBar: 'bg-purple-400',
  },
  {
    value: 'paylater_wallet',
    label: 'Ví trả sau',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    accentBar: 'bg-emerald-400',
  },
];

export const DEBT_CATEGORY_MAP: Record<DebtCategory, DebtCategoryMeta> = {
  credit_card: DEBT_CATEGORIES[0],
  installment: DEBT_CATEGORIES[1],
  personal_loan: DEBT_CATEGORIES[2],
  paylater_wallet: DEBT_CATEGORIES[3],
};

export const DEBT_STATUS_META: Record<DebtStatus, { label: string; badgeClass: string }> = {
  active: {
    label: 'Đang theo dõi',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
  },
  overdue: {
    label: 'Quá hạn',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  },
  paid: {
    label: 'Hoàn tất',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  },
};

export function formatVND(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(safe);
}

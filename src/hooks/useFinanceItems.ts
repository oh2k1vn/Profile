import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DebtFormData } from '../components/finance/DebtFormFields';
import { getPaymentDueAlert } from '../constants/finance';
import { INITIAL_FINANCE_ITEMS } from '../constants/seedFinance';
import { audioService } from '../services/audioService';
import { db } from '../services/db';
import type { DebtRecord, DebtStatus } from '../types/database';
import { computeFinanceStats } from '../utils/financeCalculations';

export const FINANCE_SEED_FLAG_KEY = 'finance_initial_seeded_v1';

export function useFinanceItems() {
  const [items, setItems] = useState<DebtRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seedInitialItems = useCallback(async (): Promise<DebtRecord[]> => {
    const created: DebtRecord[] = [];
    for (const entry of INITIAL_FINANCE_ITEMS) {
      created.push(await db.debts.create(entry));
    }
    localStorage.setItem(FINANCE_SEED_FLAG_KEY, '1');
    return created;
  }, []);

  const loadItems = useCallback(async (bypassCache = false) => {
    setLoading(true);
    setError(null);
    try {
      let list = await db.debts.list({ bypassCache });
      if (list.length === 0 && !localStorage.getItem(FINANCE_SEED_FLAG_KEY)) {
        list = await seedInitialItems();
      }
      setItems(list);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu tài chính';
      if (message.includes('not found')) {
        try {
          await db.debts.ensureTab();
          let list = await db.debts.list({ bypassCache: true });
          if (list.length === 0 && !localStorage.getItem(FINANCE_SEED_FLAG_KEY)) {
            list = await seedInitialItems();
          }
          setItems(list);
          return;
        } catch (ensureErr) {
          setError(ensureErr instanceof Error ? ensureErr.message : message);
        }
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [seedInitialItems]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const stats = useMemo(() => computeFinanceStats(items), [items]);

  const upcomingAlerts = useMemo(() => {
    return items
      .map((item) => ({ item, alert: getPaymentDueAlert(item) }))
      .filter((entry): entry is { item: DebtRecord; alert: NonNullable<ReturnType<typeof getPaymentDueAlert>> } =>
        entry.alert !== null,
      )
      .sort((a, b) => a.alert.daysLeft - b.alert.daysLeft);
  }, [items]);

  const saveItem = useCallback(async (editingItem: DebtRecord | null, formData: DebtFormData) => {
    setSaving(true);
    setError(null);
    try {
      if (editingItem) {
        const updated = await db.debts.update(editingItem.id, formData);
        setItems((prev) => prev.map((d) => (d.id === editingItem.id ? updated : d)));
      } else {
        const created = await db.debts.create(formData);
        setItems((prev) => [created, ...prev]);
      }
      audioService.playSuccess();
      return true;
    } catch (err) {
      audioService.playError();
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const quickPay = useCallback(async (item: DebtRecord) => {
    const monthly = Number(item.monthlyPayment) || 0;
    const total = Number(item.totalAmount) || 0;
    const currentPaid = Number(item.paidAmount) || 0;
    if (monthly <= 0 || currentPaid >= total) return;

    audioService.playClick();
    const nextPaid = Math.min(total, currentPaid + monthly);
    const nextStatus: DebtStatus = nextPaid >= total ? 'paid' : item.status === 'overdue' ? 'active' : item.status;
    const totalTerms = Number(item.totalTerms) || 0;
    const nextTerm = totalTerms > 0 ? Math.min(totalTerms, (Number(item.currentTerm) || 0) + 1) : Number(item.currentTerm) || 0;

    try {
      const updated = await db.debts.update(item.id, { paidAmount: nextPaid, status: nextStatus, currentTerm: nextTerm });
      setItems((prev) => prev.map((d) => (d.id === item.id ? updated : d)));
      audioService.playSuccess();
    } catch (err) {
      audioService.playError();
      setError(err instanceof Error ? err.message : 'Không thể cập nhật thanh toán');
    }
  }, []);

  const confirmRollover = useCallback(async (payload: { cardId: string; feeRate: number; nextDueDate: string; noteEntry: string }) => {
    const target = items.find((i) => i.id === payload.cardId);
    if (!target) return false;
    setSaving(true);
    setError(null);
    try {
      const nextNotes = target.notes ? `${target.notes} | ${payload.noteEntry}` : payload.noteEntry;
      const updated = await db.debts.update(target.id, {
        rolloverFeeRate: payload.feeRate,
        dueDate: payload.nextDueDate,
        status: 'active',
        notes: nextNotes,
      });
      setItems((prev) => prev.map((d) => (d.id === target.id ? updated : d)));
      audioService.playSuccess();
      return true;
    } catch (err) {
      audioService.playError();
      setError(err instanceof Error ? err.message : 'Không thể cập nhật đáo thẻ');
      return false;
    } finally {
      setSaving(false);
    }
  }, [items]);

  const removeItem = useCallback(async (id: string) => {
    audioService.playClick();
    try {
      await db.debts.remove(id);
      setItems((prev) => prev.filter((d) => d.id !== id));
      audioService.playSuccess();
      return true;
    } catch (err) {
      audioService.playError();
      setError(err instanceof Error ? err.message : 'Xóa thất bại');
      return false;
    }
  }, []);

  return { items, loading, saving, error, stats, upcomingAlerts, loadItems, saveItem, quickPay, confirmRollover, removeItem };
}

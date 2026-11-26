import { useMemo, useState } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import CreditCardRolloverModal from '../components/finance/CreditCardRolloverModal';
import DebtFormModal, { type DebtFormData } from '../components/finance/DebtFormModal';
import FinanceAlertBanner from '../components/finance/FinanceAlertBanner';
import FinanceSummaryCards from '../components/finance/FinanceSummaryCards';
import FinanceTable from '../components/finance/FinanceTable';
import { getNextPaymentTimestamp } from '../constants/finance';
import { FINANCE_SEED_FLAG_KEY, useFinanceItems } from '../hooks/useFinanceItems';
import { audioService } from '../services/audioService';
import type { DebtCategory, DebtRecord, DebtStatus } from '../types/database';

export default function FinancePage() {
  const {
    items,
    loading,
    saving,
    error,
    stats,
    upcomingAlerts,
    duplicateCount,
    loadItems,
    saveItem,
    quickPay,
    confirmRollover,
    removeItem,
    cleanDuplicates,
  } = useFinanceItems();

  const [categoryFilter, setCategoryFilter] = useState<DebtCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DebtStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DebtRecord | null>(null);
  const [rolloverCard, setRolloverCard] = useState<DebtRecord | null>(null);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items
      .filter((item) => {
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;
        if (q && !`${item.title} ${item.lender} ${item.notes}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => getNextPaymentTimestamp(a) - getNextPaymentTimestamp(b));
  }, [items, categoryFilter, statusFilter, search]);

  async function handleSave(formData: DebtFormData) {
    const ok = await saveItem(editingItem, formData);
    if (ok) {
      setModalOpen(false);
      setEditingItem(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold glow-text-ios">Quản Lý Tài Chính</h1>
          <p className="text-xs text-slate-400">
            Theo dõi danh mục, hạn mức và kế hoạch thanh toán định kỳ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              void loadItems(true);
            }}
            disabled={loading}
            className="liquid-glass-pill flex-1 sm:flex-none justify-center rounded-full px-3.5 py-2 text-xs text-slate-300 hover:text-white inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            type="button"
            onClick={() => {
              audioService.playClick();
              setEditingItem(null);
              setModalOpen(true);
            }}
            className="liquid-glass-accent-btn flex-1 sm:flex-none justify-center rounded-full px-4 py-2 text-xs font-medium text-white inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            Thêm khoản mục
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
          {error}
        </div>
      )}

      {duplicateCount > 0 && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between gap-3">
          <span>Phát hiện {duplicateCount} bản ghi bị trùng lặp trong Google Sheets.</span>
          <button
            type="button"
            onClick={() => void cleanDuplicates()}
            disabled={saving}
            className="shrink-0 rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-1 font-medium text-amber-200 hover:bg-amber-500/30 disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Đang dọn...' : 'Xóa trùng lặp'}
          </button>
        </div>
      )}

      <FinanceAlertBanner
        alerts={upcomingAlerts}
        onSelectItem={(item) => {
          setEditingItem(item);
          setModalOpen(true);
        }}
      />

      <FinanceSummaryCards
        stats={stats}
        categoryFilter={categoryFilter}
        onSelectCategory={setCategoryFilter}
      />

      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên khoản mục, ngân hàng, ghi chú..."
            className="glass-input w-full rounded-2xl pl-9 pr-4 py-2 text-xs placeholder:text-slate-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DebtStatus | 'all')}
          className="glass-input rounded-2xl px-3.5 py-2 text-xs bg-slate-900"
        >
          <option value="all" className="bg-slate-900">Tất cả trạng thái</option>
          <option value="active" className="bg-slate-900">Đang theo dõi</option>
          <option value="overdue" className="bg-slate-900">Quá hạn</option>
          <option value="paid" className="bg-slate-900">Hoàn tất</option>
        </select>
      </div>

      <FinanceTable
        items={filteredItems}
        totalCount={items.length}
        loading={loading}
        onQuickPay={quickPay}
        onRollover={setRolloverCard}
        onEdit={(item) => {
          setEditingItem(item);
          setModalOpen(true);
        }}
        onDelete={removeItem}
        onSeedDefaults={() => {
          audioService.playClick();
          localStorage.removeItem(FINANCE_SEED_FLAG_KEY);
          void loadItems(true);
        }}
      />

      <DebtFormModal
        isOpen={modalOpen}
        initialData={editingItem}
        saving={saving}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSave}
      />

      <CreditCardRolloverModal
        card={rolloverCard}
        saving={saving}
        onClose={() => setRolloverCard(null)}
        onConfirm={async (payload) => {
          const ok = await confirmRollover(payload);
          if (ok) setRolloverCard(null);
        }}
      />
    </div>
  );
}

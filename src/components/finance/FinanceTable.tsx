import type { DebtRecord } from '../../types/database';
import FinanceMobileCard from './FinanceMobileCard';
import FinanceTableRow from './FinanceTableRow';

interface FinanceTableProps {
  items: DebtRecord[];
  totalCount: number;
  loading: boolean;
  onQuickPay: (item: DebtRecord) => Promise<void>;
  onRollover: (item: DebtRecord) => void;
  onEdit: (item: DebtRecord) => void;
  onDelete: (id: string) => Promise<boolean>;
  onSeedDefaults: () => void;
}

export default function FinanceTable({
  items,
  totalCount,
  loading,
  onQuickPay,
  onRollover,
  onEdit,
  onDelete,
  onSeedDefaults,
}: FinanceTableProps) {
  if (loading) {
    return (
      <section className="liquid-glass rounded-3xl p-8 text-center text-xs text-slate-400">
        Đang tải dữ liệu từ Google Sheets...
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="liquid-glass rounded-3xl p-8 text-center space-y-3">
        <p className="text-sm text-slate-300">Chưa có khoản mục tài chính nào phù hợp</p>
        <p className="text-xs text-slate-500">Nhấn &quot;Thêm khoản mục&quot; để bắt đầu lưu vào Google Sheets.</p>
        {totalCount === 0 && (
          <button
            type="button"
            onClick={onSeedDefaults}
            className="liquid-glass-accent-btn rounded-full px-4 py-2 text-xs font-medium text-white cursor-pointer"
          >
            Nạp 7 khoản mặc định vào Sheets
          </button>
        )}
      </section>
    );
  }

  return (
    <>
      {/* Mobile Card Layout */}
      <section className="md:hidden space-y-3">
        {items.map((item) => (
          <FinanceMobileCard
            key={item.id}
            item={item}
            onQuickPay={onQuickPay}
            onRollover={onRollover}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </section>

      {/* Desktop Table Layout */}
      <section className="hidden md:block liquid-glass rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-medium">Khoản mục</th>
                <th className="py-3.5 px-3 font-medium">Phân loại</th>
                <th className="py-3.5 px-3 font-medium">Đóng kỳ này</th>
                <th className="py-3.5 px-3 font-medium">Còn lại / Tổng</th>
                <th className="py-3.5 px-3 font-medium">Trạng thái</th>
                <th className="py-3.5 px-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map((item) => (
                <FinanceTableRow
                  key={item.id}
                  item={item}
                  onQuickPay={onQuickPay}
                  onRollover={onRollover}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

import { DEBT_CATEGORIES } from '../../constants/finance';
import type { DebtCategory, DebtRecord, DebtStatus } from '../../types/database';

export type DebtFormData = Omit<DebtRecord, 'id' | 'createdAt' | 'updatedAt'>;

interface DebtFormFieldsProps {
  form: DebtFormData;
  onChange: (next: DebtFormData) => void;
}

export default function DebtFormFields({ form, onChange }: DebtFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Tên khoản mục / Thẻ *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            placeholder="VD: Thẻ Techcombank, Cake..."
            className="glass-input w-full rounded-2xl px-3.5 py-2.5 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Phân loại</label>
          <select
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value as DebtCategory })}
            className="glass-input w-full rounded-2xl px-3.5 py-2.5 text-sm bg-slate-900"
          >
            {DEBT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-slate-900 text-slate-100">
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Đơn vị / Ngân hàng / Ví</label>
          <input
            type="text"
            value={form.lender}
            onChange={(e) => onChange({ ...form, lender: e.target.value })}
            placeholder="VD: Techcombank, Cake, MoMo..."
            className="glass-input w-full rounded-2xl px-3.5 py-2.5 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">Trạng thái</label>
          <select
            value={form.status}
            onChange={(e) => onChange({ ...form, status: e.target.value as DebtStatus })}
            className="glass-input w-full rounded-2xl px-3.5 py-2.5 text-sm bg-slate-900"
          >
            <option value="active" className="bg-slate-900 text-slate-100">Đang theo dõi</option>
            <option value="overdue" className="bg-slate-900 text-slate-100">Quá hạn</option>
            <option value="paid" className="bg-slate-900 text-slate-100">Hoàn tất</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Gốc ban đầu</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={form.principalAmount ?? 0}
            onChange={(e) => onChange({ ...form, principalAmount: Number(e.target.value) })}
            className="glass-input w-full rounded-2xl px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Tổng tất toán *</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={form.totalAmount}
            onChange={(e) => onChange({ ...form, totalAmount: Number(e.target.value) })}
            className="glass-input w-full rounded-2xl px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Đã thanh toán</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={form.paidAmount}
            onChange={(e) => onChange({ ...form, paidAmount: Number(e.target.value) })}
            className="glass-input w-full rounded-2xl px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Trong kỳ / Tối thiểu</label>
          <input
            type="number"
            min={0}
            step={1000}
            value={form.monthlyPayment}
            onChange={(e) => onChange({ ...form, monthlyPayment: Number(e.target.value) })}
            className="glass-input w-full rounded-2xl px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Kỳ hiện tại</label>
          <input
            type="number"
            min={0}
            value={form.currentTerm ?? 0}
            onChange={(e) => onChange({ ...form, currentTerm: Number(e.target.value) })}
            className="glass-input w-full rounded-2xl px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Tổng số kỳ</label>
          <input
            type="number"
            min={0}
            value={form.totalTerms ?? 0}
            onChange={(e) => onChange({ ...form, totalTerms: Number(e.target.value) })}
            className="glass-input w-full rounded-2xl px-3 py-2 text-sm"
          />
          {(form.totalTerms ?? 0) > 0 && (
            <p className="text-[10px] text-indigo-300">
              Còn {Math.max(0, (form.totalTerms ?? 0) - (form.currentTerm ?? 0))} kỳ
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Ngày định kỳ</label>
          <input
            type="number"
            min={1}
            max={31}
            value={form.dueDay}
            onChange={(e) => onChange({ ...form, dueDay: Number(e.target.value) })}
            className="glass-input w-full rounded-2xl px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Hạn thanh toán</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => onChange({ ...form, dueDate: e.target.value })}
            className="glass-input w-full rounded-2xl px-3 py-2 text-xs"
          />
        </div>
      </div>

      {form.category === 'credit_card' && (
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Phí dịch vụ đáo thẻ (%)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={form.rolloverFeeRate ?? 2.2}
            onChange={(e) => onChange({ ...form, rolloverFeeRate: Number(e.target.value) })}
            className="glass-input w-full sm:w-1/2 rounded-2xl px-3.5 py-2 text-sm"
          />
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs text-slate-300">Ghi chú</label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => onChange({ ...form, notes: e.target.value })}
          placeholder="Ghi chú thêm về kỳ thanh toán, lãi suất..."
          className="glass-input w-full rounded-2xl px-3.5 py-2 text-sm resize-none"
        />
      </div>
    </>
  );
}

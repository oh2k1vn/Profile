import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { audioService } from '../../services/audioService';
import type { DebtRecord } from '../../types/database';
import DebtFormFields, { type DebtFormData } from './DebtFormFields';

export type { DebtFormData };

interface DebtFormModalProps {
  isOpen: boolean;
  initialData?: DebtRecord | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: DebtFormData) => Promise<void>;
}

const DEFAULT_FORM: DebtFormData = {
  title: '',
  category: 'credit_card',
  lender: '',
  principalAmount: 0,
  totalAmount: 0,
  paidAmount: 0,
  monthlyPayment: 0,
  interestRate: 0,
  rolloverFeeRate: 2.2,
  currentTerm: 0,
  totalTerms: 0,
  dueDay: 15,
  startDate: new Date().toISOString().slice(0, 10),
  dueDate: '',
  status: 'active',
  notes: '',
};

export default function DebtFormModal({
  isOpen,
  initialData,
  saving,
  onClose,
  onSubmit,
}: DebtFormModalProps) {
  const [form, setForm] = useState<DebtFormData>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (initialData) {
      setForm({
        title: initialData.title || '',
        category: initialData.category || 'credit_card',
        lender: initialData.lender || '',
        principalAmount: Number(initialData.principalAmount) || 0,
        totalAmount: Number(initialData.totalAmount) || 0,
        paidAmount: Number(initialData.paidAmount) || 0,
        monthlyPayment: Number(initialData.monthlyPayment) || 0,
        interestRate: Number(initialData.interestRate) || 0,
        rolloverFeeRate: Number(initialData.rolloverFeeRate) || 2.2,
        currentTerm: Number(initialData.currentTerm) || 0,
        totalTerms: Number(initialData.totalTerms) || 0,
        dueDay: Number(initialData.dueDay) || 15,
        startDate: initialData.startDate || '',
        dueDate: initialData.dueDate || '',
        status: initialData.status || 'active',
        notes: initialData.notes || '',
      });
    } else {
      setForm({ ...DEFAULT_FORM, startDate: new Date().toISOString().slice(0, 10) });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      audioService.playError();
      setError('Vui lòng nhập tên khoản mục.');
      return;
    }
    if (form.totalAmount <= 0) {
      audioService.playError();
      setError('Tổng giá trị phải lớn hơn 0.');
      return;
    }

    audioService.playClick();
    setError(null);
    await onSubmit({
      ...form,
      title: form.title.trim(),
      lender: form.lender.trim(),
      notes: form.notes.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4">
      <div className="liquid-glass w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-white/25 sm:hidden" />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {initialData ? 'Chỉnh sửa khoản mục' : 'Thêm khoản mục tài chính'}
          </h2>
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
          <DebtFormFields form={form} onChange={setForm} />

          {error && (
            <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
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
              {saving ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm khoản mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

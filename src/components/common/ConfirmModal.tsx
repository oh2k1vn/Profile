import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  type?: 'danger' | 'warning';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác Nhận Xoá',
  cancelText = 'Huỷ Bỏ',
  loading = false,
  type = 'danger',
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const isLoading = loading || submitting;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        audioService.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isLoading) return;
    audioService.playClick();
    onClose();
  };

  const handleConfirm = async () => {
    if (isLoading) return;
    setSubmitting(true);
    audioService.playClick();
    try {
      await onConfirm();
    } catch (err) {
      console.error('Error during confirm action:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed z-99999 inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="relative z-99999 w-full max-w-md liquid-glass-card rounded-3xl p-6 sm:p-7 border border-white/20 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border shrink-0 ${type === 'danger'
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
            <AlertTriangle size={24} />
          </div>

          <div className="space-y-1.5 min-w-0">
            <h3 className="text-base font-bold text-white font-sans truncate">{title}</h3>
            <div className="text-xs text-slate-300 font-sans leading-relaxed">{message}</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleClose}
            className="liquid-glass-pill px-5 py-2.5 rounded-2xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:pointer-events-none ${type === 'danger'
              ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 hover:bg-rose-500/35 shadow-lg shadow-rose-950/50'
              : 'bg-amber-500/25 text-amber-300 border border-amber-400/40 hover:bg-amber-500/35 shadow-lg'
              }`}
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

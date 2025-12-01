import { AlertTriangle, Check, HelpCircle, Info, Trash, X } from 'lucide-react';
import { overlayStore } from '../OverlayStore';
import { OverlayType } from '../type';

export type ConfirmType = 'danger' | 'warning' | 'info' | 'success' | 'default';

export interface ConfirmDialogProps {
  id?: string;
  close?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// Hàm này trả về true (nếu bấm Confirm) hoặc false (nếu bấm Cancel/Click ra ngoài)
export const confirm = (
  options: Omit<ConfirmDialogProps, 'close'> & {
    containerId?: string;
  } = {}
): Promise<boolean> => {
  return new Promise(resolve => {
    const { onConfirm: userOnConfirm, onCancel: userOnCancel, ...rest } = options;

    overlayStore.open(ConfirmDialog, {
      ...rest,
      onConfirm: () => {
        if (userOnConfirm) userOnConfirm();
        resolve(true);
      },
      onCancel: () => {
        if (userOnCancel) userOnCancel();
        resolve(false);
      },
      type: 'dialog' as OverlayType,
    });
  });
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  close, // Hàm close tự động được OverlayRender truyền vào
  title = 'Xác nhận hành động',
  description = 'Bạn có chắc chắn muốn thực hiện hành động này không?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  type = 'default',
  onConfirm,
  onCancel,
}) => {
  // --- 1. Logic xử lý Icon và Màu sắc ---
  const getTheme = (type: ConfirmType) => {
    const iconClasses = 'w-6 h-6';

    switch (type) {
      case 'danger':
        return {
          icon: <Trash className={iconClasses} />,
          colorClass: 'text-red-600 bg-red-50',
          buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className={iconClasses} />,
          colorClass: 'text-amber-600 bg-amber-50',
          buttonClass: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
        };
      case 'info':
        return {
          icon: <Info className={iconClasses} />,
          colorClass: 'text-blue-600 bg-blue-50',
          buttonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        };
      case 'success':
        return {
          icon: <Check className={iconClasses} />,
          colorClass: 'text-green-600 bg-green-50',
          buttonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        };
      default:
        return {
          icon: <HelpCircle className={iconClasses} />,
          colorClass: 'text-gray-600 bg-gray-100',
          buttonClass: 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-500',
        };
    }
  };

  const theme = getTheme(type);

  // --- 2. Handlers ---
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    close?.();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    close?.();
  };
  return (
    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden transform transition-all">
      <div className="p-6">
        <div className="flex gap-4">
          {/* Icon Wrapper */}
          <div
            className={`shrink-0 size-10 rounded-xl flex items-center justify-center ${theme.colorClass}`}
          >
            {theme.icon}
          </div>

          {/* Content */}
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Close X Button (Optional) */}
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 self-start">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          {cancelText}
        </button>

        <button
          onClick={handleConfirm}
          className={`
            px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
            ${theme.buttonClass}
          `}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

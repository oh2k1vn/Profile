import { memo } from "react";

interface ProfileSheetProps {
  name: string;
  avatar: string;
  phone: string;
  onClose: () => void;
}

/**
 * ProfileSheet — Shared BottomSheet content.
 *
 * SRP: Chỉ chịu trách nhiệm render UI profile.
 * Không biết mình đang nằm trong BottomSheet hay Dialog.
 * Có thể gọi từ bất kỳ feature/page nào.
 */
export const ProfileSheet = memo(
  ({ name, avatar, phone, onClose }: ProfileSheetProps) => {
    return (
      <div className="flex flex-col items-center gap-5 p-6">
        {/* Avatar */}
        <div className="relative">
          <img
            src={avatar}
            alt={`Avatar of ${name}`}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/20"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {/* Info */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 mt-1">{phone}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            type="button"
            className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-semibold active:scale-[0.97] transition-all shadow-lg shadow-blue-500/25"
          >
            Nhắn tin
          </button>
          <button
            type="button"
            className="w-full py-3.5 bg-blue-50 text-blue-600 rounded-2xl font-semibold active:scale-[0.97] transition-all"
          >
            Gọi điện
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 text-gray-400 text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  },
);

ProfileSheet.displayName = "ProfileSheet";

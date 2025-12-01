import { motion } from 'framer-motion';

export const SheetWrapper = ({ children, zIndex, isNested, onClose }: any) => {
  return (
    <div
      style={{ zIndex }}
      className={`
        flex flex-col justify-end items-center
        ${isNested ? 'absolute inset-0' : 'fixed inset-0'}
      `}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Content Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="
          relative bg-white w-full max-w-3xl
          rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
          max-h-[90%] flex flex-col overflow-hidden
        "
        onClick={e => e.stopPropagation()}
      >
        {/* Thanh nắm (Drag Handle) - Giả lập UI mobile */}
        <div
          className="w-full flex justify-center py-3 border-b border-gray-100 bg-gray-50/50 cursor-grab active:cursor-grabbing"
          onClick={onClose}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="flex-1 overflow-auto p-4">{children}</div>
      </motion.div>
    </div>
  );
};

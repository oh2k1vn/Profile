import { motion } from 'framer-motion';

export const DrawerWrapper = ({ children, zIndex, isNested, onClose, data }: any) => {
  // Lấy độ rộng từ options nếu có, mặc định là w-1/2 (50vw)
  const widthClass = data?.width || 'w-1/2';

  return (
    <div
      style={{ zIndex }}
      className={`
        flex justify-end items-stretch
        ${isNested ? 'absolute inset-0' : 'fixed inset-0'}
      `}
    >
      {/* Backdrop (Lớp nền tối) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/50"
        // onClick={onClose}
      />

      {/* Content Panel */}
      <motion.div
        initial={{ x: '100%' }} // Bắt đầu ở ngoài màn hình bên phải
        animate={{ x: 0 }} // Trượt vào
        exit={{ x: '100%' }} // Trượt ra
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          relative h-full
          ${widthClass}
          max-[1150px]:w-full!
          transition-[width] duration-300 ease-in-out
        `}
        // Ngăn click xuyên qua panel ra backdrop
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  );
};

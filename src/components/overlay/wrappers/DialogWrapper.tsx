import { motion } from 'framer-motion';

export const DialogWrapper = ({ children, zIndex, isNested, onClose }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex }}
      className={`
        flex items-center justify-center bg-black/50
        ${isNested ? 'absolute inset-0' : 'fixed inset-0'}
      `}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

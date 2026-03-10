import { motion } from "framer-motion";
import { ReactNode, memo, useState } from "react";
import { cn } from "@/utils/cn";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  zIndex?: number;
}

export const Dialog = memo(
  ({ isOpen, onClose, title, children, zIndex = 100 }: DialogProps) => {
    const [isAnimating, setIsAnimating] = useState(true);
    if (!isOpen) return null;

    return (
      <div
        className={cn("fixed inset-0 flex items-center justify-center p-4")}
        style={{ zIndex }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            mass: 0.8,
          }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          className={cn(
            "relative w-full max-w-md overflow-hidden rounded-[24px] bg-white p-6 shadow-2xl ring-1 ring-black/5",
            isAnimating && "pointer-events-none",
          )}
          style={{ willChange: "transform, opacity", zIndex: zIndex + 1 }}
        >
          {title && (
            <h3 className="mb-3 text-xl font-semibold text-gray-900 leading-tight">
              {title}
            </h3>
          )}
          <div className="text-gray-600 leading-relaxed">{children}</div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    );
  },
);

Dialog.displayName = "Dialog";

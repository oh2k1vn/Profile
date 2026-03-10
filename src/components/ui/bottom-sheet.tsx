import { motion, useDragControls } from "framer-motion";
import { ReactNode, memo, useState } from "react";
import { cn } from "@/utils/cn";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  zIndex?: number;
}

export const BottomSheet = memo(
  ({ isOpen, onClose, children, zIndex = 100 }: BottomSheetProps) => {
    const dragControls = useDragControls();
    const [isAnimating, setIsAnimating] = useState(true);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-end" style={{ zIndex }}>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 300,
            mass: 0.8,
          }}
          drag="y"
          dragDirectionLock
          dragControls={dragControls}
          dragConstraints={{ top: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100 || info.velocity.y > 500) {
              onClose();
            }
          }}
          onAnimationStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          className={cn(
            "relative w-full max-h-[90vh] bg-white rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden",
            isAnimating && "pointer-events-none",
          )}
          style={{
            willChange: "transform",
            touchAction: "none",
            zIndex: zIndex + 1,
          }}
        >
          {/* Handle bar */}
          <div className="flex justify-center p-4">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full cursor-grab active:cursor-grabbing" />
          </div>

          <div className="px-6 pb-10 pt-2 overflow-y-auto max-h-[calc(90vh-60px)]">
            {children}
          </div>
        </motion.div>
      </div>
    );
  },
);

BottomSheet.displayName = "BottomSheet";

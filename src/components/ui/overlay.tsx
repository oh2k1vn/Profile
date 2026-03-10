import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface OverlayProps {
  onClick?: () => void;
  className?: string;
  zIndex?: number;
}

export const Overlay = ({
  onClick,
  className = "",
  zIndex = 50,
}: OverlayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={cn("fixed inset-0 bg-black/50 backdrop-blur-sm", className)}
      style={{ willChange: "opacity", zIndex }}
    />
  );
};

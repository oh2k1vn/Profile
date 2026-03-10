import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouteHandle } from "@/hooks/use-route-handle";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  transparent = false,
}) => {
  const [handle] = useRouteHandle();

  if (handle?.noBottomNav) return null;

  return (
    <header
      className={`pt-safe fixed top-0 left-0 right-0 z-100 min-h-12 px-4 transition-all duration-300 ${
        transparent ? "bg-transparent" : "bg-zmp-card"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-h-12">
        {showBack && (
          <button
            onClick={onBack}
            title="Quay lại"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        {title && (
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="zmp-title-lg text-lg! truncate"
          >
            {title}
          </motion.h1>
        )}
      </div>
    </header>
  );
};

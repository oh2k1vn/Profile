import { motion, AnimatePresence } from "framer-motion";
import { Lock, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => boolean;
}

export function PinModal({ isOpen, onClose, onSubmit }: PinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit(pin)) {
      setPin("");
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-6">
              <div className="inline-flex p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <Lock className="w-6 h-6 text-slate-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Yêu cầu quyền truy cập
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Vui lòng nhập mã PIN để tiếp tục
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  className={cn(
                    "w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-center text-2xl tracking-widest text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all",
                    error && "border-red-500 animate-shake",
                  )}
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                >
                  Xác nhận
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

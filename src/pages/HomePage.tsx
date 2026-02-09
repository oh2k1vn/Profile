import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, TrendingUp, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { PinModal } from "../components/PinModal";

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [showPinModal, setShowPinModal] = useState(false);

  const handleTraderClick = () => {
    if (isAuthenticated) {
      navigate("/calculator");
    } else {
      setShowPinModal(true);
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (login(pin)) {
      navigate("/calculator");
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* English Section */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col items-center text-center space-y-6 hover:border-blue-500/50 transition-all cursor-pointer group"
          onClick={() => navigate("/vocab")}
        >
          <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition-transform">
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Học Tiếng Anh
            </h2>
            <p className="text-slate-400 text-sm">
              Luyện tập từ vựng với Flashcards & Typing Practice
            </p>
          </div>
          <div className="pt-4">
            <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-semibold group-hover:gap-3 transition-all">
              Bắt đầu học <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </motion.div>

        {/* Trader Section */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col items-center text-center space-y-6 hover:border-emerald-500/50 transition-all cursor-pointer group"
          onClick={handleTraderClick}
        >
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform relative">
            <TrendingUp className="w-10 h-10 text-emerald-400" />
            {!isAuthenticated && (
              <div className="absolute -top-2 -right-2 bg-slate-950 border border-slate-800 p-1.5 rounded-full shadow-lg">
                <Lock className="w-3 h-3 text-slate-500" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Trader Tool</h2>
            <p className="text-slate-400 text-sm">
              Tính toán Futures, Quản lý lệnh & Nhật ký Trading
            </p>
          </div>
          <div className="pt-4">
            <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold group-hover:gap-3 transition-all">
              Mở công cụ <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </motion.div>
      </div>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSubmit={handlePinSubmit}
      />
    </div>
  );
}

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calculator,
  Target,
  Shield,
  TrendingUp as ProfitIcon,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTradingJournal } from "../hooks/useTradingJournal";

export function TradingCalculator() {
  const { stats } = useTradingJournal();

  // Account Settings (persisted)
  const [balance, setBalance] = useLocalStorage<number>(
    "futures_balance",
    1000,
  );
  const [leverage, setLeverage] = useLocalStorage<number>(
    "futures_leverage",
    10,
  );

  // ROI-based Goals (%)
  // These represent the "Estimated Profit/Loss %" on the margin (ROI %)
  const [slRoi, setSlRoi] = useLocalStorage<number>("futures_sl_roi", 10);
  const [tpRoi, setTpRoi] = useLocalStorage<number>("futures_tp_roi", 50);

  // Asset statistics
  const currentAssets = balance + stats.totalPnl;
  const totalProfitLoss = stats.totalPnl;

  // Core calculations
  const results = useMemo(() => {
    // Price Change % = ROI % / Leverage
    const slPricePercent = slRoi / leverage;
    const tpPricePercent = tpRoi / leverage;

    // Dollar amounts (Assuming Balance is the margin/capital for this calculation)
    const riskAmount = balance * (slRoi / 100);
    const rewardAmount = balance * (tpRoi / 100);

    const rrRatio = slRoi > 0 ? (tpRoi / slRoi).toFixed(2) : "0";

    return {
      slPricePercent,
      tpPricePercent,
      riskAmount,
      rewardAmount,
      rrRatio,
    };
  }, [balance, leverage, slRoi, tpRoi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-6 px-4"
    >
      <header className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Calculator className="w-6 h-6 text-yellow-400" />
          Máy Tính Futures (ROI-Based)
        </h2>
        <p className="text-slate-500 text-xs">
          Tính % biến động giá dựa trên lợi nhuận ước tính (ROI)
        </p>
      </header>

      {/* Asset Overview Card */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Tài sản hiện tại
            </p>
            <p className="text-xl font-black text-white">
              ${currentAssets.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Tổng Lời/Lỗ
          </p>
          <p
            className={`text-sm font-black flex items-center justify-end gap-1 ${totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}
          >
            {totalProfitLoss >= 0 ? (
              <ProfitIcon className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INPUTS SECTION */}
        <div className="space-y-4">
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/50 space-y-5">
            {/* Balance & Leverage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Gốc / Vốn ($)
                </label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                  step="any"
                  inputMode="decimal"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Đòn bẩy (x)
                </label>
                <input
                  type="number"
                  value={leverage}
                  onChange={(e) => setLeverage(parseFloat(e.target.value) || 1)}
                  step="any"
                  inputMode="decimal"
                  min="1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-hidden transition-all"
                />
              </div>
            </div>

            {/* SL ROI Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-red-400 uppercase tracking-wider font-bold flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Mục tiêu Cắt lỗ (ROI %)
                </label>
                <span className="text-sm font-black text-red-500">
                  -{slRoi}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={slRoi}
                onChange={(e) => setSlRoi(parseFloat(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase tracking-widest">
                <span>1% ROI</span>
                <span>100% ROI</span>
              </div>
            </div>

            {/* TP ROI Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Mục tiêu Chốt lời (ROI %)
                </label>
                <span className="text-sm font-black text-emerald-400">
                  +{tpRoi}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={tpRoi}
                onChange={(e) => setTpRoi(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase tracking-widest">
                <span>5% ROI</span>
                <span>1000% ROI</span>
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 grid grid-cols-1 gap-4">
            {/* SL PRICE PERCENT */}
            <motion.div
              layoutId="result-sl-roi"
              className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-red-500/50 transition-colors"
            >
              <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-12 h-12 text-red-500" />
              </div>
              <p className="text-[10px] text-red-400 uppercase tracking-[0.2em] font-black mb-2">
                Giá chạy SL (%)
              </p>
              <p className="text-5xl font-black text-white tracking-tighter">
                -{results.slPricePercent.toFixed(2)}%
              </p>
              <div className="mt-4 flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                <span className="text-xs text-red-400 font-bold">Mất:</span>
                <span className="text-sm text-white font-black">
                  ${results.riskAmount.toFixed(1)}
                </span>
              </div>
            </motion.div>

            {/* TP PRICE PERCENT */}
            <motion.div
              layoutId="result-tp-roi"
              className="bg-emerald-950/20 border border-emerald-900/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-emerald-500/50 transition-colors"
            >
              <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-12 h-12 text-emerald-500" />
              </div>
              <p className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-black mb-2">
                Giá chạy TP (%)
              </p>
              <p className="text-5xl font-black text-white tracking-tighter">
                +{results.tpPricePercent.toFixed(2)}%
              </p>
              <div className="mt-4 flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="text-xs text-emerald-400 font-bold">Lãi:</span>
                <span className="text-sm text-white font-black">
                  ${results.rewardAmount.toFixed(1)}
                </span>
              </div>
            </motion.div>
          </div>

          {/* RR RATIO INFO */}
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700 flex justify-between items-center px-6">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Tỷ lệ R : R
            </span>
            <span className="text-lg font-black text-blue-400">
              1 : {results.rrRatio}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

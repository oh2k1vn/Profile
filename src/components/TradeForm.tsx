import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cn } from "../lib/utils";
import type {
  NewTradeInput,
  TradeDirection,
  TradeStatus,
} from "../types/trade";

interface TradeFormProps {
  onSubmit: (trade: NewTradeInput) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<NewTradeInput>;
}

export function TradeForm({
  onSubmit,
  isLoading,
  defaultValues,
}: TradeFormProps) {
  const [coin, setCoin] = useState(defaultValues?.coin || "");
  const [direction, setDirection] = useState<TradeDirection>(
    defaultValues?.direction || "long",
  );
  const [entryPrice, setEntryPrice] = useState(
    defaultValues?.entryPrice?.toString() || "",
  );
  const [stopLoss, setStopLoss] = useState(
    defaultValues?.stopLoss?.toString() || "",
  );
  const [exitPrice, setExitPrice] = useState(
    defaultValues?.exitPrice?.toString() || "",
  );
  const [positionSize, setPositionSize] = useState(
    defaultValues?.positionSize?.toString() || "",
  );
  const [leverage, setLeverage] = useState(
    defaultValues?.leverage?.toString() || "10",
  );
  const [entryFeePercent, setEntryFeePercent] = useLocalStorage<number>(
    "futures_entry_fee_percent",
    0.06,
  );
  const [exitFeePercent, setExitFeePercent] = useLocalStorage<number>(
    "futures_exit_fee_percent",
    0.06,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;
    const size = parseFloat(positionSize) || 0;

    let status: TradeStatus = "open";
    let pnl = 0;
    let pnlPercent = 0;
    let openingFeeAmount = 0;
    let closingFeeAmount = 0;

    // Opening Fee
    openingFeeAmount = size * (entryFeePercent / 100);

    if (exit > 0) {
      const grossPnl =
        direction === "long"
          ? (exit - entry) * (size / entry)
          : (entry - exit) * (size / entry);

      // Closing Fee (position value at exit)
      const exitSize = (size / entry) * exit;
      closingFeeAmount = exitSize * (exitFeePercent / 100);

      pnl = grossPnl - (openingFeeAmount + closingFeeAmount);
      status = pnl >= 0 ? "win" : "loss";
      pnlPercent = (pnl / size) * 100;
    }

    await onSubmit({
      coin: coin.toUpperCase(),
      direction,
      entryPrice: entry,
      stopLoss: parseFloat(stopLoss) || 0,
      positionSize: size,
      leverage: parseInt(leverage) || 10,
      exitPrice: exit || undefined,
      status,
      pnl: exit > 0 ? pnl : undefined,
      pnlPercent: exit > 0 ? pnlPercent : undefined,
      openingFeePercent: entryFeePercent,
      closingFeePercent: exitFeePercent,
      openingFee: openingFeeAmount,
      closingFee: exit > 0 ? closingFeeAmount : undefined,
      feeAmount:
        exit > 0 ? openingFeeAmount + closingFeeAmount : openingFeeAmount,
    });

    // Reset form
    setCoin("");
    setEntryPrice("");
    setStopLoss("");
    setExitPrice("");
    setPositionSize("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Send className="w-4 h-4 text-blue-400" />
          Lưu Lệnh Mới
        </h3>
        {parseFloat(exitPrice) > 0 && (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Lệnh Đóng
          </span>
        )}
      </div>

      {/* Direction Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setDirection("long")}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-all border",
            direction === "long"
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
              : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600",
          )}
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          Long
        </button>
        <button
          type="button"
          onClick={() => setDirection("short")}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-all border",
            direction === "short"
              ? "bg-red-500/20 border-red-500 text-red-400"
              : "bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-600",
          )}
        >
          <TrendingDown className="w-4 h-4 inline mr-1" />
          Short
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Coin */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Coin</label>
          <input
            type="text"
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            placeholder="BTC, ETH..."
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden"
          />
        </div>

        {/* Leverage */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Đòn Bẩy</label>
          <input
            type="number"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            min="1"
            max="125"
            step="any"
            inputMode="decimal"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-hidden transition-all"
          />
        </div>

        {/* Entry Price */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Giá Vào</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            placeholder="0.00"
            step="any"
            inputMode="decimal"
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
          />
        </div>

        {/* Exit Price (New) */}
        <div className="space-y-1">
          <label className="text-xs text-emerald-400 font-medium">
            Giá Đóng (Mua/Bán Lại)
          </label>
          <input
            type="number"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            placeholder="Để trống nếu chưa đóng"
            step="any"
            inputMode="decimal"
            className="w-full bg-slate-950 border border-emerald-900/50 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden transition-all"
          />
        </div>

        {/* Position Size */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Kích Thước ($)</label>
          <input
            type="number"
            value={positionSize}
            onChange={(e) => setPositionSize(e.target.value)}
            placeholder="0.00"
            step="any"
            inputMode="decimal"
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-hidden transition-all"
          />
        </div>

        {/* Stop Loss */}
        <div className="space-y-1">
          <label className="text-xs text-red-500">Stop Loss</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder="0.00"
            step="any"
            inputMode="decimal"
            className="w-full bg-slate-950 border border-red-900/50 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden transition-all"
          />
        </div>

        {/* Opening Fee */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Phí Mở (%)</label>
          <input
            type="number"
            value={entryFeePercent}
            onChange={(e) =>
              setEntryFeePercent(parseFloat(e.target.value) || 0)
            }
            placeholder="0.06"
            step="any"
            inputMode="decimal"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 outline-hidden transition-all"
          />
        </div>

        {/* Closing Fee (Dự kiến) */}
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Phí Đóng (%)</label>
          <input
            type="number"
            value={exitFeePercent}
            onChange={(e) => setExitFeePercent(parseFloat(e.target.value) || 0)}
            placeholder="0.06"
            step="any"
            inputMode="decimal"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm focus:ring-2 focus:ring-slate-500/20 focus:border-slate-600 outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full py-3 rounded-xl text-sm font-semibold transition-all",
          "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400",
          "text-white shadow-lg shadow-blue-500/25",
          isLoading && "opacity-50 cursor-not-allowed",
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
            Đang Lưu...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 inline mr-2" />
            Lưu Lệnh
          </>
        )}
      </button>
    </motion.form>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cn } from "../lib/utils";
import type { Trade } from "../types/trade";

interface TradeHistoryProps {
  trades: Trade[];
  onCloseTrade?: (
    id: string,
    status: "win" | "loss",
    exitPrice: number,
    pnl: number,
  ) => Promise<void>;
  onDeleteTrade?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function TradeHistory({
  trades,
  onCloseTrade,
  onDeleteTrade,
}: TradeHistoryProps) {
  const [closingTrade, setClosingTrade] = useState<string | null>(null);
  const [exitPrice, setExitPrice] = useState("");
  const [entryFeePercent] = useLocalStorage<number>(
    "futures_entry_fee_percent",
    0.06,
  );
  const [closingFeePercent, setClosingFeePercent] = useLocalStorage<number>(
    "futures_exit_fee_percent",
    0.06,
  );

  const handleClose = async (trade: Trade) => {
    if (!onCloseTrade) return;

    const price = parseFloat(exitPrice);
    if (isNaN(price) || price <= 0) return;

    const entry = trade.entryPrice;
    const size = trade.positionSize;

    // Use opening fee from trade data if available, otherwise calculate from defaults
    const openingFee = trade.openingFee ?? size * (entryFeePercent / 100);

    const grossPnl =
      trade.direction === "long"
        ? (price - entry) * (size / entry)
        : (entry - price) * (size / entry);

    // Calculate closing fee based on the newly entered percent
    const exitSize = (size / entry) * price;
    const closingFeeAmount = exitSize * (closingFeePercent / 100);
    const totalFees = openingFee + closingFeeAmount;

    const pnl = grossPnl - totalFees;
    const status: "win" | "loss" = pnl >= 0 ? "win" : "loss";

    await onCloseTrade(trade.id, status, price, pnl);
    setClosingTrade(null);
    setExitPrice("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "win":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "loss":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "win":
        return "text-emerald-400 bg-emerald-500/10";
      case "loss":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-yellow-400 bg-yellow-500/10";
    }
  };

  if (trades.length === 0) {
    return (
      <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 text-center">
        <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-500">Chưa có lệnh nào được ghi</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          Lịch Sử Lệnh ({trades.length})
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {trades.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Direction Icon */}
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    trade.direction === "long"
                      ? "bg-emerald-500/10"
                      : "bg-red-500/10",
                  )}
                >
                  {trade.direction === "long" ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Trade Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {trade.coin}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        getStatusColor(trade.status),
                      )}
                    >
                      {trade.status === "open"
                        ? "Đang mở"
                        : trade.status === "win"
                          ? "Thắng"
                          : "Thua"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {trade.leverage}x
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex gap-3">
                    <span>Entry: ${trade.entryPrice}</span>
                    {trade.stopLoss > 0 && (
                      <span className="text-red-400">
                        SL: ${trade.stopLoss}
                      </span>
                    )}
                    {trade.takeProfit && trade.takeProfit > 0 && (
                      <span className="text-emerald-400">
                        TP: ${trade.takeProfit}
                      </span>
                    )}
                  </div>
                </div>

                {/* PnL or Actions */}
                {trade.status !== "open" ? (
                  <div
                    className={cn(
                      "text-right flex items-center gap-1.5",
                      trade.pnl && trade.pnl >= 0
                        ? "text-emerald-400"
                        : "text-red-400",
                    )}
                  >
                    <div className="font-semibold text-xs">
                      {trade.pnl && trade.pnl >= 0 ? "+" : ""}$
                      {trade.pnl?.toFixed(2)}
                    </div>
                    {trade.feeAmount && trade.feeAmount > 0 && (
                      <div className="text-[9px] text-slate-500 mt-0.5">
                        -f: ${trade.feeAmount.toFixed(2)}
                      </div>
                    )}
                    {getStatusIcon(trade.status)}
                  </div>
                ) : closingTrade === trade.id ? (
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-500 font-medium">
                          Giá đóng
                        </label>
                        <input
                          type="number"
                          value={exitPrice}
                          onChange={(e) => setExitPrice(e.target.value)}
                          placeholder="0.00"
                          step="any"
                          inputMode="decimal"
                          className="w-28 bg-slate-950 border border-emerald-500/50 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                          autoFocus
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-500 font-medium">
                          Phí đóng (%)
                        </label>
                        <input
                          type="number"
                          value={closingFeePercent}
                          onChange={(e) =>
                            setClosingFeePercent(
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.06"
                          step="any"
                          inputMode="decimal"
                          className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-slate-500 transition-all font-medium"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-5">
                        <button
                          onClick={() => handleClose(trade)}
                          disabled={!exitPrice}
                          className="p-2 bg-emerald-500/20 rounded-lg hover:bg-emerald-500/30 text-emerald-400 disabled:opacity-50"
                          title="Xác nhận đóng lệnh"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setClosingTrade(null);
                            setExitPrice("");
                          }}
                          className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 text-slate-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setClosingTrade(trade.id)}
                      className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      Đóng
                    </button>
                    {onDeleteTrade && (
                      <button
                        onClick={() => onDeleteTrade(trade.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              {trade.notes && (
                <p className="mt-2 text-xs text-slate-500 italic">
                  "{trade.notes}"
                </p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { TradingCharts } from "../components/TradingCharts";
import { TradeForm } from "../components/TradeForm";
import { TradeHistory } from "../components/TradeHistory";
import { useTradingJournal } from "../hooks/useTradingJournal";
import { cn } from "../lib/utils";

export function JournalPage() {
  const {
    trades,
    stats,
    isLoading,
    error,
    refresh,
    logTrade,
    closeTrade,
    deleteTrade,
  } = useTradingJournal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto pt-24 pb-12 px-4 space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Nhật Ký Giao Dịch</h1>
          <p className="text-slate-400 text-sm mt-1">
            Ghi lại và phân tích lịch sử trading của bạn
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all border border-slate-700"
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          Làm mới
        </button>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Analytics */}
      <TradingCharts stats={stats} />

      {/* Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-200 px-1">
            Ghi lệnh mới
          </h2>
          <TradeForm onSubmit={logTrade} isLoading={isLoading} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-200 px-1">
            Lịch sử lệnh
          </h2>
          <TradeHistory
            trades={trades}
            onCloseTrade={closeTrade}
            onDeleteTrade={deleteTrade}
            isLoading={isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
}

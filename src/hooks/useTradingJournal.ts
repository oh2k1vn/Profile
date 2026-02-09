import { useState, useEffect, useCallback } from "react";
import { googleSheetsApi } from "../services/googleSheetsApi";
import type { Trade, TradeStats, NewTradeInput } from "../types/trade";

export function useTradingJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradeStats>({
    totalTrades: 0,
    openTrades: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalPnl: 0,
    maxDrawdown: 0,
    balanceHistory: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch trades and stats
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [tradesData, statsData] = await Promise.all([
        googleSheetsApi.getTrades(),
        googleSheetsApi.getStats(),
      ]);

      setTrades(tradesData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Log new trade
  const logTrade = useCallback(async (trade: NewTradeInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await googleSheetsApi.logTrade({
        ...trade,
        status: trade.status || "open",
      });

      // Add to local state optimistically
      setTrades((prev) => [
        {
          id: result.id,
          timestamp: result.timestamp,
          ...trade,
          status: trade.status || "open",
        },
        ...prev,
      ]);

      // Refresh stats
      const statsData = await googleSheetsApi.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log trade");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Close trade
  const closeTrade = useCallback(
    async (
      id: string,
      status: "win" | "loss",
      exitPrice: number,
      pnl: number,
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const trade = trades.find((t) => t.id === id);
        const pnlPercent = trade ? (pnl / trade.positionSize) * 100 : 0;

        await googleSheetsApi.closeTrade(
          id,
          exitPrice,
          pnl,
          pnlPercent,
          status,
        );

        // Update local state
        setTrades((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, status, exitPrice, pnl, pnlPercent } : t,
          ),
        );

        // Refresh stats
        const statsData = await googleSheetsApi.getStats();
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to close trade");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [trades],
  );

  // Delete trade
  const deleteTrade = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await googleSheetsApi.deleteTrade(id);

      // Remove from local state
      setTrades((prev) => prev.filter((t) => t.id !== id));

      // Refresh stats
      const statsData = await googleSheetsApi.getStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete trade");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    trades,
    stats,
    isLoading,
    error,
    refresh,
    logTrade,
    closeTrade,
    deleteTrade,
  };
}

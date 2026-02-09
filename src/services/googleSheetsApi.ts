import type { Trade, TradeStats } from "../types/trade";

// ⚠️ Replace with your deployed Google Apps Script URL
const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || "";

export interface ApiResponse<T> {
  success?: boolean;
  error?: string;
  data?: T;
}

/**
 * Google Sheets API Service
 */
export const googleSheetsApi = {
  /**
   * Get all trades from Google Sheets
   */
  async getTrades(): Promise<Trade[]> {
    if (!API_URL) {
      console.warn("Google Sheets API URL not configured");
      return [];
    }

    const response = await fetch(`${API_URL}?action=getTrades`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.trades || [];
  },

  /**
   * Log a new trade
   */
  async logTrade(
    trade: Omit<Trade, "id" | "timestamp">,
  ): Promise<{ id: string; timestamp: string }> {
    if (!API_URL) {
      throw new Error("Google Sheets API URL not configured");
    }

    const response = await fetch(`${API_URL}?action=logTrade`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain", // Use text/plain to avoid CORS preflight OPTIONS
      },
      body: JSON.stringify(trade),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return { id: data.id, timestamp: data.timestamp };
  },

  /**
   * Update an existing trade
   */
  async updateTrade(trade: Partial<Trade> & { id: string }): Promise<void> {
    if (!API_URL) {
      throw new Error("Google Sheets API URL not configured");
    }

    const response = await fetch(`${API_URL}?action=updateTrade`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(trade),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }
  },

  /**
   * Close a trade with exit price and PnL
   */
  async closeTrade(
    id: string,
    exitPrice: number,
    pnl: number,
    pnlPercent: number,
    status: "win" | "loss",
  ): Promise<void> {
    return this.updateTrade({
      id,
      exitPrice,
      pnl,
      pnlPercent,
      status,
    });
  },

  /**
   * Delete a trade
   */
  async deleteTrade(id: string): Promise<void> {
    if (!API_URL) {
      throw new Error("Google Sheets API URL not configured");
    }

    const response = await fetch(`${API_URL}?action=deleteTrade`, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }
  },

  /**
   * Get trading statistics
   */
  async getStats(): Promise<TradeStats> {
    if (!API_URL) {
      return {
        totalTrades: 0,
        openTrades: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalPnl: 0,
        maxDrawdown: 0,
        balanceHistory: [],
      };
    }

    const response = await fetch(`${API_URL}?action=getStats`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  },
};

export type TradeDirection = "long" | "short";
export type TradeStatus = "open" | "win" | "loss";

export interface Trade {
  id: string;
  timestamp: string;
  coin: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss: number;
  takeProfit?: number;
  positionSize: number;
  leverage: number;
  status: TradeStatus;
  exitPrice?: number;
  pnl?: number;
  pnlPercent?: number;
  feeAmount?: number;
  openingFee?: number;
  closingFee?: number;
  openingFeePercent?: number;
  closingFeePercent?: number;
  notes?: string;
}

export interface TradeStats {
  totalTrades: number;
  openTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPnl: number;
  maxDrawdown: number;
  balanceHistory: Array<{
    timestamp: string;
    balance: number;
  }>;
}

export interface NewTradeInput {
  coin: string;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  leverage: number;
  exitPrice?: number;
  status?: TradeStatus;
  pnl?: number;
  pnlPercent?: number;
  feeAmount?: number;
  openingFee?: number;
  closingFee?: number;
  openingFeePercent?: number;
  closingFeePercent?: number;
}

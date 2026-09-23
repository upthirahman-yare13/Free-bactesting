export interface Candle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export type OrderType = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'OPEN' | 'CLOSED_TP' | 'CLOSED_SL' | 'CANCELLED';

export interface Position {
  id: string;
  type: OrderType;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  riskAmount: number;
  pnl: number;
  status: OrderStatus;
  openedAtTime: number;
  closedAtTime?: number;
}

export interface FairValueGap {
  id: string;
  type: 'BULLISH' | 'BEARISH';
  topPrice: number;
  bottomPrice: number;
  time: number;
  isMitigated: boolean;
}

export interface ReplaySettings {
  speed: number; // Interval in milliseconds
  stepSize: number; // Number of candles per step
  initialBalance: number;
}

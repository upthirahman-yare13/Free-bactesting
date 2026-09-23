export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Trade {
  id: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskAmount: number;
  pnl?: number;
  status: 'OPEN' | 'WON' | 'LOST';
  timestamp: number;
}

export interface SMCZone {
  type: 'FVG' | 'ORDER_BLOCK';
  top: number;
  bottom: number;
  startIndex: number;
  bias: 'BULLISH' | 'BEARISH';
}

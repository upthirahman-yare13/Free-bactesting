import { Candle } from '../types/trading';

export function generateMockGoldData(): Candle[] {
  const candles: Candle[] = [];
  let time = Math.floor(new Date('2026-01-01T00:00:00Z').getTime() / 1000);
  let open = 2050.0;

  for (let i = 0; i < 500; i++) {
    const trend = Math.sin(i / 15) * 5;
    const volatility = (Math.random() - 0.48) * 6;
    const change = trend + volatility;

    const high = Math.max(open, open + change) + Math.random() * 3;
    const low = Math.min(open, open + change) - Math.random() * 3;
    const close = open + change;

    candles.push({
      time: time + i * 3600, // 1-Hour interval candles
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 5000) + 1000,
    });

    open = close;
  }

  return candles;
}

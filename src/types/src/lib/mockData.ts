import { CandleData } from '../types/trading';

export function generateGoldData(): CandleData[] {
  const data: CandleData[] = [];
  let price = 2035.50;
  let time = Math.floor(new Date('2026-01-01').getTime() / 1000);

  for (let i = 0; i < 600; i++) {
    const delta = (Math.random() - 0.485) * 4.5;
    const open = price;
    const close = open + delta;
    const high = Math.max(open, close) + Math.random() * 2.5;
    const low = Math.min(open, close) - Math.random() * 2.5;

    data.push({
      time: time + i * 3600,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });

    price = close;
  }
  return data;
}

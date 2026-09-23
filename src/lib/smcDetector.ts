import { Candle, FairValueGap } from '../types/trading';

/**
 * Detects Fair Value Gaps (FVG) from candle history
 * Bullish FVG: Low of Candle 3 > High of Candle 1
 * Bearish FVG: High of Candle 3 < Low of Candle 1
 */
export function detectFVGs(candles: Candle[]): FairValueGap[] {
  const fvgs: FairValueGap[] = [];

  if (candles.length < 3) return fvgs;

  for (let i = 2; i < candles.length; i++) {
    const c1 = candles[i - 2];
    const c2 = candles[i - 1];
    const c3 = candles[i];

    // Bullish FVG
    if (c3.low > c1.high) {
      fvgs.push({
        id: `fvg-bull-${c2.time}`,
        type: 'BULLISH',
        topPrice: c3.low,
        bottomPrice: c1.high,
        time: c2.time,
        isMitigated: false,
      });
    }

    // Bearish FVG
    if (c3.high < c1.low) {
      fvgs.push({
        id: `fvg-bear-${c2.time}`,
        type: 'BEARISH',
        topPrice: c1.low,
        bottomPrice: c3.high,
        time: c2.time,
        isMitigated: false,
      });
    }
  }

  return fvgs;
}

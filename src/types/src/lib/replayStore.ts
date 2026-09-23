import { create } from 'zustand';
import { CandleData, Trade } from '../types/trading';

interface ReplayState {
  candles: CandleData[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;
  balance: number;
  equity: number;
  trades: Trade[];
  activeTrade: Trade | null;
  setCandles: (candles: CandleData[]) => void;
  stepForward: () => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  executeTrade: (trade: Omit<Trade, 'id' | 'status' | 'timestamp'>) => void;
}

export const useReplayStore = create<ReplayState>((set, get) => ({
  candles: [],
  currentIndex: 100,
  isPlaying: false,
  speed: 300,
  balance: 10000,
  equity: 10000,
  trades: [],
  activeTrade: null,

  setCandles: (candles) => set({ candles }),

  stepForward: () => {
    const { currentIndex, candles, activeTrade, balance } = get();
    if (currentIndex >= candles.length - 1) {
      set({ isPlaying: false });
      return;
    }

    const nextIndex = currentIndex + 1;
    const currentCandle = candles[nextIndex];

    if (activeTrade) {
      let closed = false;
      let pnl = 0;

      if (activeTrade.type === 'BUY') {
        if (currentCandle.low <= activeTrade.stopLoss) {
          pnl = -activeTrade.riskAmount;
          closed = true;
        } else if (currentCandle.high >= activeTrade.takeProfit) {
          pnl = activeTrade.riskAmount * 2;
          closed = true;
        }
      } else {
        if (currentCandle.high >= activeTrade.stopLoss) {
          pnl = -activeTrade.riskAmount;
          closed = true;
        } else if (currentCandle.low <= activeTrade.takeProfit) {
          pnl = activeTrade.riskAmount * 2;
          closed = true;
        }
      }

      if (closed) {
        const finishedTrade: Trade = { ...activeTrade, pnl, status: pnl > 0 ? 'WON' : 'LOST' };
        set({
          balance: balance + pnl,
          equity: balance + pnl,
          activeTrade: null,
          trades: [finishedTrade, ...get().trades],
        });
      }
    }

    set({ currentIndex: nextIndex });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed }),

  executeTrade: (tradeData) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'OPEN',
      timestamp: Date.now(),
    };
    set({ activeTrade: newTrade });
  },
}));

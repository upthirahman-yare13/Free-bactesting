import { create } from 'zustand';
import { Candle, Position, OrderType } from '../types/trading';

interface ReplayState {
  fullData: Candle[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number;
  balance: number;
  equity: number;
  positions: Position[];
  activePosition: Position | null;
  
  // Actions
  setFullData: (data: Candle[]) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  setSpeed: (speed: number) => void;
  openPosition: (type: OrderType, risk: number, slPips: number, tpPips: number) => void;
  closePosition: (positionId: string, exitPrice: number, reason: 'TP' | 'SL') => void;
}

export const useReplayStore = create<ReplayState>((set, get) => ({
  fullData: [],
  currentIndex: 100,
  isPlaying: false,
  speed: 300,
  balance: 10000,
  equity: 10000,
  positions: [],
  activePosition: null,

  setFullData: (data) => set({ fullData: data }),
  
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  
  stepForward: () => {
    const { currentIndex, fullData, activePosition, closePosition } = get();
    if (currentIndex >= fullData.length - 1) {
      set({ isPlaying: false });
      return;
    }

    const nextIndex = currentIndex + 1;
    const currentCandle = fullData[nextIndex];

    // Check Active Orders SL/TP Execution
    if (activePosition && activePosition.status === 'OPEN') {
      if (activePosition.type === 'BUY') {
        if (currentCandle.low <= activePosition.stopLoss) {
          closePosition(activePosition.id, activePosition.stopLoss, 'SL');
        } else if (currentCandle.high >= activePosition.takeProfit) {
          closePosition(activePosition.id, activePosition.takeProfit, 'TP');
        }
      } else if (activePosition.type === 'SELL') {
        if (currentCandle.high >= activePosition.stopLoss) {
          closePosition(activePosition.id, activePosition.stopLoss, 'SL');
        } else if (currentCandle.low <= activePosition.takeProfit) {
          closePosition(activePosition.id, activePosition.takeProfit, 'TP');
        }
      }
    }

    set({ currentIndex: nextIndex });
  },

  setSpeed: (speed) => set({ speed }),

  openPosition: (type, riskAmount, slPips, tpPips) => {
    const { fullData, currentIndex, balance, activePosition } = get();
    if (activePosition) return; // Only 1 position for professional strict risk management

    const currentCandle = fullData[currentIndex];
    const entryPrice = currentCandle.close;
    const pipSize = 0.1; // Gold / FX Scaled Pip size

    const stopLoss = type === 'BUY' ? entryPrice - (slPips * pipSize) : entryPrice + (slPips * pipSize);
    const takeProfit = type === 'BUY' ? entryPrice + (tpPips * pipSize) : entryPrice - (tpPips * pipSize);

    const newPos: Position = {
      id: `pos-${Date.now()}`,
      type,
      entryPrice,
      stopLoss,
      takeProfit,
      lotSize: riskAmount / slPips,
      riskAmount,
      pnl: 0,
      status: 'OPEN',
      openedAtTime: currentCandle.time,
    };

    set({ activePosition: newPos });
  },

  closePosition: (positionId, exitPrice, reason) => {
    const { activePosition, balance, positions } = get();
    if (!activePosition || activePosition.id !== positionId) return;

    const rewardRatio = 2; // Fixed 1:2 R:R Ratio or Dynamic
    const profitOrLoss = reason === 'TP' ? activePosition.riskAmount * rewardRatio : -activePosition.riskAmount;
    
    const updatedPosition: Position = {
      ...activePosition,
      status: reason === 'TP' ? 'CLOSED_TP' : 'CLOSED_SL',
      pnl: profitOrLoss,
      closedAtTime: exitPrice,
    };

    const newBalance = balance + profitOrLoss;

    set({
      balance: newBalance,
      equity: newBalance,
      activePosition: null,
      positions: [updatedPosition, ...positions],
    });
  },
}));

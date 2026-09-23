'use client';

import React, { useState } from 'react';
import { useReplayStore } from '../lib/replayStore';
import { Target, ShieldAlert, DollarSign, History } from 'lucide-react';

export default function ExecutionPanel() {
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [risk, setRisk] = useState(100);
  const [slPips, setSlPips] = useState(20);
  const [tpPips, setTpPips] = useState(40);

  const { candles, currentIndex, executeTrade, activeTrade, trades } = useReplayStore();

  const currentCandle = candles[currentIndex - 1] || { close: 2040.0 };

  const handleExecute = () => {
    if (activeTrade) {
      alert('A trade is already open!');
      return;
    }

    const entry = currentCandle.close;
    const sl = orderType === 'BUY' ? entry - slPips * 0.1 : entry + slPips * 0.1;
    const tp = orderType === 'BUY' ? entry + tpPips * 0.1 : entry - tpPips * 0.1;

    executeTrade({
      type: orderType,
      entryPrice: parseFloat(entry.toFixed(2)),
      stopLoss: parseFloat(sl.toFixed(2)),
      takeProfit: parseFloat(tp.toFixed(2)),
      riskAmount: risk,
    });
  };

  return (
    <aside className="w-80 bg-[#161b22] border-l border-[#30363d] p-5 flex flex-col justify-between h-full select-none">
      <div className="space-y-6">
        <div className="border-b border-[#30363d] pb-3 flex justify-between items-center">
          <h3 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" /> ORDER EXECUTION
          </h3>
          <span className="text-[10px] bg-blue-900/60 border border-blue-700/50 text-blue-300 px-2 py-0.5 rounded-full font-mono font-bold">
            R:R 1:{(tpPips / slPips).toFixed(1)}
          </span>
        </div>

        {/* Buy / Sell Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-[#0d1117] p-1.5 rounded-xl border border-[#30363d]">
          <button
            onClick={() => setOrderType('BUY')}
            className={`py-2.5 text-xs font-black rounded-lg transition ${
              orderType === 'BUY' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'text-gray-400 hover:text-white'
            }`}
          >
            BUY (LONG)
          </button>
          <button
            onClick={() => setOrderType('SELL')}
            className={`py-2.5 text-xs font-black rounded-lg transition ${
              orderType === 'SELL' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' : 'text-gray-400 hover:text-white'
            }`}
          >
            SELL (SHORT)
          </button>
        </div>

        {/* Execution Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-gray-400 block mb-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" /> RISK AMOUNT ($)
            </label>
            <input
              type="number"
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-rose-400" /> SL (PIPS)
              </label>
              <input
                type="number"
                value={slPips}
                onChange={(e) => setSlPips(Number(e.target.value))}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1 flex items-center gap-1">
                <Target className="w-3 h-3 text-emerald-400" /> TP (PIPS)
              </label>
              <input
                type="number"
                value={tpPips}
                onChange={(e) => setTpPips(Number(e.target.value))}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleExecute}
          className={`w-full py-4 font-black text-xs text-white rounded-xl shadow-lg transition tracking-wider ${
            orderType === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
          }`}
        >
          {orderType === 'BUY' ? 'EXECUTE BUY ORDER' : 'EXECUTE SELL ORDER'}
        </button>
      </div>

      {/* Trade Log */}
      <div className="border-t border-[#30363d] pt-4">
        <h4 className="text-xs font-extrabold text-gray-400 mb-2 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-blue-400" /> RECENT TRADES
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto font-mono text-[11px]">
          {activeTrade && (
            <div className="p-2 rounded bg-blue-950/40 border border-blue-800/50 flex justify-between items-center text-blue-300">
              <span>{activeTrade.type} @ ${activeTrade.entryPrice}</span>
              <span className="animate-pulse text-[10px] bg-blue-900 px-1.5 py-0.5 rounded font-bold">OPEN</span>
            </div>
          )}

          {trades.map((t) => (
            <div
              key={t.id}
              className={`p-2 rounded border flex justify-between items-center ${
                t.status === 'WON' ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400' : 'bg-rose-950/30 border-rose-800/40 text-rose-400'
              }`}
            >
              <span>{t.type} @ ${t.entryPrice}</span>
              <span className="font-bold">
                {t.pnl! > 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl!)}`}
              </span>
            </div>
          ))}

          {!activeTrade && trades.length === 0 && (
            <p className="text-gray-500 italic text-[11px]">No active or closed trades.</p>
          )}
        </div>
      </div>
    </aside>
  );
}

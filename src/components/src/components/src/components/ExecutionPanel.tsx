'use client';

import React, { useState } from 'react';
import { useReplayStore } from '../lib/replayStore';
import { ShieldAlert, Target, DollarSign, History } from 'lucide-react';

export default function ExecutionPanel() {
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [riskAmount, setRiskAmount] = useState<number>(100);
  const [slPips, setSlPips] = useState<number>(20);
  const [tpPips, setTpPips] = useState<number>(40);

  const { openPosition, activePosition, positions } = useReplayStore();

  const handleExecute = () => {
    openPosition(orderType, riskAmount, slPips, tpPips);
  };

  const rrRatio = (tpPips / slPips).toFixed(1);

  return (
    <aside className="w-80 bg-[#161b22] border-l border-[#30363d] p-5 flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="border-b border-[#30363d] pb-3 flex justify-between items-center">
          <h3 className="font-bold text-white text-base tracking-wide flex items-center space-x-2">
            <span>Execution Panel</span>
          </h3>
          <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800/60 px-2 py-0.5 rounded-full font-extrabold uppercase">
            Risk: 1%
          </span>
        </div>

        {/* Order Type Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-[#0d1117] p-1.5 rounded-xl border border-[#30363d]">
          <button
            onClick={() => setOrderType('BUY')}
            className={`py-2 rounded-lg font-extrabold text-xs transition-all ${
              orderType === 'BUY'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            BUY (LONG)
          </button>
          <button
            onClick={() => setOrderType('SELL')}
            className={`py-2 rounded-lg font-extrabold text-xs transition-all ${
              orderType === 'SELL'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SELL (SHORT)
          </button>
        </div>

        {/* Risk & Order Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold mb-1 flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-blue-400" />
              <span>Risk Amount ($)</span>
            </label>
            <input
              type="number"
              value={riskAmount}
              onChange={(e) => setRiskAmount(Number(e.target.value))}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>SL (Pips)</span>
              </label>
              <input
                type="number"
                value={slPips}
                onChange={(e) => setSlPips(Number(e.target.value))}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>TP (Pips)</span>
              </label>
              <input
                type="number"
                value={tpPips}
                onChange={(e) => setTpPips(Number(e.target.value))}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Dynamic Risk to Reward Summary */}
          <div className="bg-[#0d1117] border border-[#30363d] p-3 rounded-xl flex justify-between items-center text-xs">
            <span className="text-gray-400 font-medium">Risk : Reward Ratio</span>
            <span className="font-extrabold text-blue-400 font-mono text-sm">1 : {rrRatio}</span>
          </div>
        </div>

        {/* Execute Button */}
        <button
          onClick={handleExecute}
          disabled={activePosition !== null}
          className={`w-full py-3.5 rounded-xl font-extrabold text-xs tracking-wider shadow-xl transition-all ${
            activePosition !== null
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              : orderType === 'BUY'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
          }`}
        >
          {activePosition !== null ? 'POSITION ALREADY OPEN' : `EXECUTE ${orderType} ORDER`}
        </button>
      </div>

      {/* Trade History Log */}
      <div className="border-t border-[#30363d] pt-4 mt-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 mb-3">
          <History className="w-4 h-4 text-blue-400" />
          <span>Recent Closed Trades ({positions.length})</span>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {positions.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No trades logged yet.</p>
          ) : (
            positions.map((pos) => (
              <div
                key={pos.id}
                className="bg-[#0d1117] border border-[#30363d] p-2.5 rounded-lg flex justify-between items-center text-xs font-mono"
              >
                <span className={`font-bold ${pos.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pos.type}
                </span>
                <span className="text-gray-400">${pos.entryPrice.toFixed(2)}</span>
                <span className={`font-extrabold ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pos.pnl >= 0 ? `+$${pos.pnl.toFixed(2)}` : `-$${Math.abs(pos.pnl).toFixed(2)}`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

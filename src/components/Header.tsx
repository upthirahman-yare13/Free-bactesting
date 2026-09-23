'use client';

import React from 'react';
import { Play, Pause, SkipForward, Zap, Shield, TrendingUp } from 'lucide-react';
import { useReplayStore } from '../lib/replayStore';

export default function Header() {
  const { isPlaying, togglePlay, stepForward, speed, setSpeed, balance, equity } = useReplayStore();

  return (
    <header className="h-16 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-6 z-20 select-none">
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold px-3 py-1 rounded-lg text-sm tracking-wider shadow-md">
          FX
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
            REPLAY <span className="text-blue-500 font-black">PRO</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono tracking-widest font-bold">INSTITUTIONAL SMC</span>
        </div>
        <div className="h-6 w-px bg-[#30363d] mx-2" />
        <span className="text-xs bg-[#0d1117] border border-[#30363d] px-3 py-1 rounded-md text-amber-400 font-mono font-bold flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> XAUUSD (GOLD)
        </span>
      </div>

      {/* Controller Toolbar */}
      <div className="flex items-center space-x-3 bg-[#0d1117] border border-[#30363d] px-4 py-1.5 rounded-xl shadow-inner">
        <button
          onClick={togglePlay}
          className={`font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-md ${
            isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>

        <button
          onClick={stepForward}
          className="bg-[#21262d] hover:bg-[#30363d] text-gray-200 px-3 py-2 rounded-lg transition border border-[#30363d]"
          title="Next Candle"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-[#30363d]" />

        <div className="flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-[#161b22] border border-[#30363d] text-white text-xs rounded-md px-2 py-1.5 focus:outline-none font-mono"
          >
            <option value={1000}>1s / Bar</option>
            <option value={500}>0.5s / Bar</option>
            <option value={200}>0.2s / Bar</option>
            <option value={50}>Ultra Fast</option>
          </select>
        </div>
      </div>

      {/* Account Info */}
      <div className="flex items-center space-x-6 font-mono">
        <div className="text-right">
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Balance</span>
          <span className="font-extrabold text-emerald-400 text-base">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="text-right">
          <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Equity</span>
          <span className="font-extrabold text-gray-200 text-base">${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </header>
  );
}

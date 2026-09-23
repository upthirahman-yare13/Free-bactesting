'use client';

import React, { useEffect } from 'react';
import { useReplayStore } from '../lib/replayStore';
import { Play, Pause, SkipForward, FastForward, RotateCcw, Wallet, TrendingUp } from 'lucide-react';

export default function Header() {
  const {
    isPlaying,
    play,
    pause,
    stepForward,
    speed,
    setSpeed,
    balance,
    equity,
    currentIndex,
    fullData
  } = useReplayStore();

  // Replay Loop Handler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        stepForward();
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, stepForward]);

  const currentCandle = fullData[currentIndex];
  const currentDate = currentCandle ? new Date(currentCandle.time * 1000).toLocaleDateString() : 'N/A';

  return (
    <header className="h-16 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between px-6 select-none z-20">
      {/* Brand & Market Info */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black px-2.5 py-1 rounded-lg text-sm tracking-wider shadow-lg">
            FX
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            REPLAY <span class="text-blue-500">PRO</span>
          </span>
        </div>

        <div className="h-5 w-px bg-[#30363d]"></div>

        <div className="flex items-center space-x-2 bg-[#0d1117] border border-[#30363d] px-3 py-1 rounded-lg text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-gray-200">XAUUSD / GOLD</span>
          <span className="text-gray-500">| 1H</span>
        </div>
      </div>

      {/* Replay Controls Engine */}
      <div className="flex items-center space-x-3 bg-[#0d1117] border border-[#30363d] p-1.5 rounded-xl shadow-2xl">
        <button
          onClick={isPlaying ? pause : play}
          className={`px-4 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-2 transition-all ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>

        <button
          onClick={stepForward}
          disabled={isPlaying}
          className="p-1.5 hover:bg-[#21262d] text-gray-300 disabled:opacity-40 rounded-lg transition"
          title="Step Next Candle (Forward)"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-[#30363d]"></div>

        {/* Speed Selector */}
        <div className="flex items-center space-x-2 px-1">
          <FastForward className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-[#161b22] border border-[#30363d] text-white text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
          >
            <option value={1000}>1x Speed (1s)</option>
            <option value={500}>2x Speed (0.5s)</option>
            <option value={200}>5x Speed (0.2s)</option>
            <option value={50}>20x Ultra (Fast)</option>
          </select>
        </div>

        <div className="h-5 w-px bg-[#30363d]"></div>

        {/* Current Replay Date Indicator */}
        <div className="text-xs font-mono text-blue-400 bg-[#161b22] px-2.5 py-1 rounded-md border border-[#30363d]">
          📅 {currentDate}
        </div>
      </div>

      {/* Live Account Performance Stats */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-950/60 border border-emerald-800/50 rounded-lg">
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Balance</span>
            <span className="font-extrabold text-sm text-emerald-400 font-mono">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-950/60 border border-blue-800/50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Equity</span>
            <span className="font-extrabold text-sm text-gray-200 font-mono">
              ${equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

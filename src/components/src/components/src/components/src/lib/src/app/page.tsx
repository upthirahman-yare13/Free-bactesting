'use client';

import React from 'react';
import Header from '../components/Header';
import ChartCanvas from '../components/ChartCanvas';
import ExecutionPanel from '../components/ExecutionPanel';
import { MousePointer, Slash, Square, BarChart2, Layers } from 'lucide-react';

export default function ReplayDashboard() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0d1117]">
      {/* Top Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar */}
        <aside className="w-14 bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 space-y-4 select-none z-10">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#21262d] rounded-xl transition" title="Cursor Tool">
            <MousePointer className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#21262d] rounded-xl transition" title="Trendline">
            <Slash className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#21262d] rounded-xl transition" title="FVG / Orderblock Box">
            <Square className="w-5 h-5" />
          </button>
          <button className="p-2 text-blue-400 bg-blue-950/50 border border-blue-800/50 rounded-xl transition" title="Long/Short Position Tool">
            <BarChart2 className="w-5 h-5" />
          </button>
          <div className="h-px w-8 bg-[#30363d] my-2"></div>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#21262d] rounded-xl transition" title="Indicators Overlay">
            <Layers className="w-5 h-5" />
          </button>
        </aside>

        {/* Central TradingView Lightweight Chart */}
        <ChartCanvas />

        {/* Right Execution Sidebar */}
        <ExecutionPanel />
      </div>
    </div>
  );
}

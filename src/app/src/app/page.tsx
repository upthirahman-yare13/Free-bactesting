'use client';

import React from 'react';
import Header from '../components/Header';
import ChartCanvas from '../components/ChartCanvas';
import ExecutionPanel from '../components/ExecutionPanel';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-white overflow-hidden select-none">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative bg-[#0d1117]">
          <ChartCanvas />
        </main>
        <ExecutionPanel />
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useReplayStore } from '../lib/replayStore';
import { generateMockGoldData } from '../lib/mockData';

export default function ChartCanvas() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  const { fullData, setFullData, currentIndex, activePosition } = useReplayStore();

  // Load Initial Mock Forex Data
  useEffect(() => {
    const data = generateMockGoldData();
    setFullData(data);
  }, [setFullData]);

  // Initialize TradingView Lightweight Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#0d1117' },
        textColor: '#8b949e',
      },
      grid: {
        vertLines: { color: '#161b22' },
        horzLines: { color: '#161b22' },
      },
      crosshair: {
        mode: 1,
      },
      priceScale: {
        borderColor: '#30363d',
      },
      timeScale: {
        borderColor: '#30363d',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#089981',
      downColor: '#f23645',
      borderVisible: false,
      wickUpColor: '#089981',
      wickDownColor: '#f23645',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update Chart Candles on Replay Index Change
  useEffect(() => {
    if (seriesRef.current && fullData.length > 0) {
      const visibleSlice = fullData.slice(0, currentIndex + 1);
      seriesRef.current.setData(visibleSlice);
    }
  }, [currentIndex, fullData]);

  return (
    <div className="flex-1 h-full w-full relative bg-[#0d1117] overflow-hidden">
      <div ref={chartContainerRef} className="w-full h-full" />

      {/* Position Overlay Line Indicator */}
      {activePosition && (
        <div className="absolute top-4 left-4 bg-[#161b22]/90 border border-[#30363d] backdrop-blur-md p-3 rounded-xl text-xs space-y-1 z-10 font-mono shadow-2xl">
          <div className="flex items-center justify-between space-x-4">
            <span className="text-gray-400">ACTIVE POSITION:</span>
            <span className={`font-bold ${activePosition.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
              {activePosition.type}
            </span>
          </div>
          <div className="text-gray-300">Entry: ${activePosition.entryPrice.toFixed(2)}</div>
          <div className="text-red-400">SL: ${activePosition.stopLoss.toFixed(2)}</div>
          <div className="text-emerald-400">TP: ${activePosition.takeProfit.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

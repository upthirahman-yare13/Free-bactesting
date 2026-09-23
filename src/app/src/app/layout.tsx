import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FX Replay Pro - Institutional Backtesting',
  description: 'Forex & Gold Smart Money Concepts Replay Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-gray-100 antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}

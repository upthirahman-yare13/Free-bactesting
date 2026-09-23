import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FX Replay Pro - Institutional Backtesting Platform',
  description: 'Professional Forex and Gold Smart Money Concepts Backtesting App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body class="bg-[#0d1117] text-gray-100 antialiased h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}

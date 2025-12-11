import React from 'react';

export function Ticker() {
  return (
    <div className="bg-slate-900 text-white text-[10px] font-mono py-1.5 overflow-hidden whitespace-nowrap border-b border-slate-900">
        <div className="container mx-auto px-6 flex justify-between items-center">
            <div className="flex gap-6 opacity-80">
                <span>BTC/USD <span className="text-green-400">▲ 68,420.50</span></span>
                <span>ETH/USD <span className="text-red-400">▼ 3,892.10</span></span>
                <span>SOL/USD <span className="text-green-400">▲ 145.20</span></span>
                <span className="text-slate-500">|</span>
                <span>US 10Y <span className="text-green-400">4.25%</span></span>
            </div>
            <div className="hidden md:block text-slate-400">
                SYSTEM STATUS: <span className="text-green-400">ONLINE</span>
            </div>
        </div>
    </div>
  );
}

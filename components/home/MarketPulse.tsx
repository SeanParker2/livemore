import { Zap } from 'lucide-react';

export function MarketPulse() {
  const data = [
    {
      symbol: "BTC/USD",
      price: "68,420.50",
      change: "+2.4%",
      trend: "up"
    },
    {
      symbol: "ETH/USD",
      price: "3,892.10",
      change: "-0.8%",
      trend: "down"
    },
    {
      symbol: "SOL/USD",
      price: "145.20",
      change: "+5.1%",
      trend: "up"
    }
  ];

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600 flex items-center gap-2">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          Market Pulse
        </h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {data.map((item) => (
          <div key={item.symbol} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center">
            <div>
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">{item.symbol}</div>
              <div className="font-mono font-bold text-sm text-slate-900">{item.price}</div>
            </div>
            <div className={`text-xs font-mono font-medium px-1.5 py-0.5 rounded ${
              item.trend === 'up' 
                ? 'text-green-600 bg-green-50' 
                : 'text-red-600 bg-red-50'
            }`}>
              {item.change}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-50/50 px-4 py-2 text-center border-t border-slate-100">
        <span className="text-[10px] font-mono text-slate-400">Data delayed by 15 mins</span>
      </div>
    </div>
  );
}

import { Zap, ArrowUp, ArrowDown } from 'lucide-react';

export function MarketPulse() {
  const pulses = [
    {
      id: 1,
      time: "10:42 AM",
      symbol: "BTC",
      content: "比特币短时突破 70,000 USDT，24小时涨幅达 5.2%。",
      trend: "up",
    },
    {
      id: 2,
      time: "09:15 AM",
      symbol: "MACRO",
      content: "美联储会议纪要暗示降息预期延后，纳指期货微跌。",
      trend: "down",
    },
    {
      id: 3,
      time: "08:30 AM",
      symbol: "ETH",
      content: "以太坊链上 Gas 费降至年内低点，Layer 2 活跃度激增。",
      trend: "up",
    },
  ];

  return (
    <div className="bg-card rounded-xl border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Market Pulse
        </h4>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>
      <ul className="space-y-4">
        {pulses.map((item) => (
          <li key={item.id} className="text-sm">
            <div className="flex gap-2 text-xs text-muted-foreground mb-1 items-center">
              <span className="font-mono">{item.time}</span>
              <span className={item.trend === 'up' ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                {item.symbol}
              </span>
              {item.trend === 'up' ? (
                 <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                 <ArrowDown className="w-3 h-3 text-red-500" />
              )}
            </div>
            <p className="leading-snug hover:underline cursor-pointer text-foreground/90">
              {item.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

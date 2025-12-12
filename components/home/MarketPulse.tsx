import { Activity } from 'lucide-react';

export function MarketPulse() {
  return (
    <div>
        <h4 className="font-mono text-xs font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity className="w-3 h-3" /> Live Pulse
        </h4>
        <div className="space-y-3">
            <div className="flex justify-between items-center text-sm pb-3 border-b border-dashed border-fine">
                <span className="font-medium">Bitcoin Dominance</span>
                <span className="font-mono">58.2%</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-3 border-b border-dashed border-fine">
                <span className="font-medium">ETH Gas (Gwei)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-500">8</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-3 border-b border-dashed border-fine">
                <span className="font-medium">Fear & Greed</span>
                <span className="font-mono text-amber-600 dark:text-amber-500">65 (Greed)</span>
            </div>
        </div>
    </div>
  );
}

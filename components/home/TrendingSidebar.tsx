import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function TrendingSidebar() {
  // Mock data for trending posts. 
  // In a real implementation, this would fetch from the database sorted by views or engagement.
  const trendingPosts = [
    {
      id: 1,
      title: "以太坊 ETF 获批后的资金流向全景图",
      slug: "ethereum-etf-flow-analysis"
    },
    {
      id: 2,
      title: "RWA 赛道深度解析：代币化美债的机遇",
      slug: "rwa-tokenized-treasuries"
    },
    {
      id: 3,
      title: "Solana 生态复苏：Memecoin 狂热背后的技术支撑",
      slug: "solana-ecosystem-revival"
    },
    {
      id: 4,
      title: "美联储降息周期开启：加密资产的下一个十年",
      slug: "fed-rate-cut-crypto-impact"
    }
  ];

  return (
    <div className="space-y-4 pt-4">
      <h4 className="font-semibold text-sm border-b pb-2 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Trending Analysis
      </h4>
      <ul className="space-y-4">
        {trendingPosts.map((post, index) => (
          <li key={post.id} className="group flex items-start gap-3">
            <span className="text-2xl font-bold text-muted-foreground/30 font-serif -mt-1 group-hover:text-primary/50 transition-colors">
              0{index + 1}
            </span>
            <Link href={`/posts/${post.slug}`} className="text-sm font-medium group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

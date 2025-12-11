import Link from 'next/link';

export function TrendingSidebar() {
  // Mock data for trending posts. 
  // In a real implementation, this would fetch from the database sorted by views or engagement.
  const trendingPosts = [
    {
      id: 1,
      title: "比特币减半后的矿工投降周期研究",
      slug: "bitcoin-halving-miner-capitulation"
    },
    {
      id: 2,
      title: "日本央行政策转向对全球流动性的影响",
      slug: "boj-policy-shift-global-liquidity"
    },
    {
      id: 3,
      title: "RWA 赛道：贝莱德的布局与链上国债",
      slug: "rwa-blackrock-treasuries"
    }
  ];

  return (
    <div>
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-2 mb-4">
        Trending Analysis
      </h3>
      <div className="space-y-4">
        {trendingPosts.map((post, index) => (
          <Link href={`/posts/${post.slug}`} key={post.id} className="flex gap-4 group">
            <span className="text-2xl font-serif font-bold text-slate-200 group-hover:text-slate-300 transition-colors leading-none">
              0{index + 1}
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

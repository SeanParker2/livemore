import Link from 'next/link';

export function TrendingSidebar() {
  const trendingPosts = [
    {
      id: 1,
      title: "日本央行政策转向对全球流动性的影响",
      slug: "#"
    },
    {
      id: 2,
      title: "RWA 赛道：贝莱德的布局与链上国债",
      slug: "#"
    },
    {
      id: 3,
      title: "SaaS 估值体系崩塌：AI Agent 的影响",
      slug: "#"
    }
  ];

  return (
    <div>
        <h4 className="font-mono text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">
            Trending Analysis
        </h4>
        <ul className="space-y-6">
            {trendingPosts.map((post, index) => (
                <li key={post.id} className="group cursor-pointer">
                    <div className="flex gap-4 items-baseline">
                        <span className="font-mono text-xs text-slate-300 font-bold">0{index + 1}</span>
                        <div>
                            <Link href={post.slug}>
                                <h5 className="font-serif font-bold text-base leading-tight group-hover:text-indigo-800 transition-colors text-slate-900">
                                    {post.title}
                                </h5>
                            </Link>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  );
}

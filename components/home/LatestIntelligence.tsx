import Link from "next/link";
import { Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  is_premium: boolean;
  created_at: string;
  tags?: { name: string }[];
}

interface LatestIntelligenceProps {
  posts: Post[];
}

export function LatestIntelligence({ posts }: LatestIntelligenceProps) {
  return (
    <div className="space-y-10">
        <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">Latest Intelligence</h3>
            <div className="h-[1px] flex-1 bg-slate-100 ml-4"></div>
        </div>

        {posts.map((post) => (
            <article key={post.id} className="group relative grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-fine last:border-0">
                <div className="md:col-span-3 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                        {post.tags && post.tags.length > 0 && (
                             <span className="text-indigo-600 font-bold">{post.tags[0].name}</span>
                        )}
                        {post.tags && post.tags.length > 0 && <span>•</span>}
                        <span>{formatDate(post.created_at)}</span>
                    </div>
                    <Link href={`/posts/${post.slug}`}>
                        <h2 className="font-serif text-2xl font-bold group-hover:text-indigo-900 transition-colors cursor-pointer text-slate-900">
                            {post.title}
                        </h2>
                    </Link>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {post.summary}
                    </p>
                    {post.is_premium && (
                        <div className="pt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-700 text-[10px] font-mono font-medium border border-amber-100">
                                <Lock className="w-3 h-3" /> PREMIUM
                            </span>
                        </div>
                    )}
                </div>
                <div className="hidden md:block md:col-span-1 h-full min-h-[100px] bg-slate-100 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-mono text-xs">
                        // IMAGE //
                    </div>
                </div>
            </article>
        ))}
    </div>
  );
}

import Link from "next/link";
import { Lock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Post } from "@/lib/types";

interface LatestIntelligenceProps {
  posts: Post[];
}

export function LatestIntelligence({ posts }: LatestIntelligenceProps) {
  return (
    <div className="space-y-10">
        <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest">Latest Intelligence</h3>
            <div className="h-px flex-1 bg-transparent border-b border-fine ml-4"></div>
        </div>

        {posts.map((post) => (
            <article key={post.id} className="group relative grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-fine last:border-0">
                <div className="md:col-span-3 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wide">
                        {post.tags && post.tags.length > 0 && (
                             <span className="text-primary font-bold">{post.tags[0].name}</span>
                        )}
                        {post.tags && post.tags.length > 0 && <span>•</span>}
                        <span>{formatDate(post.created_at)}</span>
                    </div>
                    <Link href={`/posts/${post.slug}`}>
                        <h2 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors cursor-pointer text-foreground">
                            {post.title}
                        </h2>
                    </Link>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {post.summary}
                    </p>
                    {post.is_premium && (
                        <div className="pt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-mono font-medium border border-amber-500/20">
                                <Lock className="w-3 h-3" /> PREMIUM
                            </span>
                        </div>
                    )}
                </div>
                <div className="hidden md:block md:col-span-1 h-full min-h-[100px] bg-muted relative overflow-hidden group-hover:opacity-90 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-mono text-xs">
                        {/* IMAGE */}
                    </div>
                </div>
            </article>
        ))}
    </div>
  );
}

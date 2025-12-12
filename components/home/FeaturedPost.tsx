import { Link } from "@/src/navigation";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Post } from "@/lib/types";

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="mb-12 pb-8 border-b border-fine">
        <span className="inline-block px-2 py-1 mb-4 text-[10px] font-mono font-bold tracking-widest bg-muted text-muted-foreground uppercase">
            Featured Deep Dive
        </span>
        <h1 className="font-serif font-bold text-4xl md:text-5xl leading-[1.1] mb-4 text-foreground">
            {post.title}
        </h1>
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mb-6">
            {post.summary}
        </p>
        <div className="flex items-center gap-4">
            <Link href={`/posts/${post.slug}`} className="group inline-flex items-center gap-2 text-sm font-bold border-b border-fine pb-0.5 hover-underline-animation text-foreground">
                Read Full Report <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <button className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-fine hover:border-primary/30 hover:bg-primary/5">
                <Sparkles className="w-3 h-3" /> AI Summary
            </button>
        </div>
    </div>
  );
}

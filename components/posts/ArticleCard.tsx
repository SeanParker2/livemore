import { Link } from "@/src/navigation";
import { format } from "date-fns";
import { Lock } from 'lucide-react';
import { AISummaryButton } from "./AISummaryButton";
import { Post } from "@/lib/types";

interface ArticleCardProps {
  post: Post;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group py-8 first:pt-0">
      <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mb-2">
        <span className="text-foreground font-bold uppercase">
          {post.tags?.[0]?.name || 'ANALYSIS'}
        </span>
        <span>/</span>
        <span className="uppercase">{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
        <span>/</span>
        {post.is_premium ? (
          <span className="text-amber-600 flex items-center gap-1">
            <Lock className="w-3 h-3" /> PREMIUM
          </span>
        ) : (
          <span>{Math.ceil((post.content || "").length / 500)} MIN READ</span>
        )}
      </div>
      
      <Link href={`/posts/${post.slug}`} className="block group-hover:opacity-80 transition-opacity">
        <h3 className="text-2xl font-serif font-bold mb-3 leading-tight text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {post.summary}
        </p>
      </Link>

      <div className="flex items-center gap-4">
        <AISummaryButton postSlug={post.slug} />
        <Link href={`/posts/${post.slug}`} className="text-xs font-bold font-mono uppercase hover:underline decoration-foreground underline-offset-4 text-foreground">
          Read Full Report -&gt;
        </Link>
      </div>
    </article>
  );
}

import Link from "next/link";
import { format } from "date-fns";
import { Lock } from 'lucide-react';
import { AISummaryButton } from "./AISummaryButton";

interface ArticleCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    summary: string;
    content: string;
    created_at: string;
    is_premium: boolean;
    tags: { name: string }[];
  };
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group py-8 first:pt-0">
      <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mb-2">
        <span className="text-slate-900 font-bold uppercase">
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
          <span>{Math.ceil(post.content.length / 500)} MIN READ</span>
        )}
      </div>
      
      <Link href={`/posts/${post.slug}`} className="block group-hover:opacity-80 transition-opacity">
        <h3 className="text-2xl font-serif font-bold mb-3 leading-tight text-slate-900 group-hover:text-blue-700 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {post.summary}
        </p>
      </Link>

      <div className="flex items-center gap-4">
        <AISummaryButton postSlug={post.slug} />
        <Link href={`/posts/${post.slug}`} className="text-xs font-bold font-mono uppercase hover:underline decoration-slate-900 underline-offset-4 text-slate-900">
          Read Full Report -&gt;
        </Link>
      </div>
    </article>
  );
}

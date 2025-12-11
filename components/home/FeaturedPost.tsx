import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Post } from "@/lib/types";

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="mb-12 pb-8 border-b border-fine">
        <span className="inline-block px-2 py-1 mb-4 text-[10px] font-mono font-bold tracking-widest bg-slate-100 text-slate-600 uppercase">
            Featured Deep Dive
        </span>
        <h1 className="font-serif font-bold text-4xl md:text-5xl leading-[1.1] mb-4 text-slate-900">
            {post.title}
        </h1>
        <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl mb-6">
            {post.summary}
        </p>
        <div className="flex items-center gap-4">
            <Link href={`/posts/${post.slug}`} className="group inline-flex items-center gap-2 text-sm font-bold border-b border-slate-900 pb-0.5 hover-underline-animation text-slate-900">
                Read Full Report <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <button className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50">
                <Sparkles className="w-3 h-3" /> AI Summary
            </button>
        </div>
    </div>
  );
}

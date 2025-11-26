

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Libre_Baskerville } from 'next/font/google';
import Link from "next/link";

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '700',
});

export default async function TagPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: tag } = await supabase
    .from('tags')
    .select('*, posts(*, author:profiles(*))')
    .eq('slug', params.slug)
    .single();

  if (!tag) {
    return <div>Tag not found</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <section className="py-16">
        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-8 ${libreBaskerville.className}`}>
          #{tag.name}
        </h1>
        <div className="space-y-8 mt-8">
          {tag.posts.map((post: any) => (
            <Link href={`/posts/${post.slug}`} key={post.id} className="block group">
              <article>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-semibold group-hover:underline ${libreBaskerville.className}`}>
                    {post.title}
                  </h3>
                  <Badge variant={post.is_premium ? 'default' : 'secondary'} className={post.is_premium ? 'bg-amber-100 text-amber-800' : ''}>
                    {post.is_premium ? 'Premium' : 'Free'}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  {post.summary}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.author.full_name}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                  <span>•</span>
                  <span>{Math.ceil(post.content.length / 500)} 分钟阅读</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "文章归档 - Livemore",
  description: "探索 Livemore 的所有历史洞察与研报。",
};

const POSTS_PER_PAGE = 10;

export default async function ArchivePage({ searchParams }: { searchParams: { page?: string } }) {
  const supabase = await createClient();
  const currentPage = Number(searchParams?.page) || 1;

  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');

  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0;

  const from = (currentPage - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          文章归档
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          探索 Livemore 的所有历史洞察与研报。
        </p>
      </header>

      <div className="space-y-8">
        {posts?.map((post, index) => (
          <div key={post.id}>
            <Link href={`/posts/${post.slug}`} className="block group">
              <article>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-semibold group-hover:underline">
                    {post.title}
                  </h2>
                  <Badge variant={post.is_premium ? 'default' : 'secondary'}>
                    {post.is_premium ? '付费' : '免费'}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">
                  {post.summary}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  {new Date(post.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
                </p>
              </article>
            </Link>
            {posts && index < posts.length - 1 && <Separator className="mt-8" />}
          </div>
        ))}
      </div>
      <div className="mt-12">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
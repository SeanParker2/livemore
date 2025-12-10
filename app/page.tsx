import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import { Libre_Baskerville } from 'next/font/google';
import { Lock } from 'lucide-react';
import { MarketPulse } from "@/components/home/MarketPulse";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { AISummaryButton } from "@/components/posts/AISummaryButton";
import { Pagination } from "@/components/ui/pagination";

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '700',
});

const POSTS_PER_PAGE = 10;

interface Author {
  avatar_url: string;
  full_name: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  is_premium: boolean;
  summary: string;
  content: string;
  created_at: string;
  author: Author;
  tags: Tag[];
}

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  const supabase = await createClient();
  const currentPage = Number(searchParams?.page) || 1;

  // Fetch posts for pagination
  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  
  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0;
  const from = (currentPage - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts } = await supabase
    .from('posts')
    .select('*, author:profiles(*), tags:tags(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  // Fetch featured collections for the first page
  const { data: collections } = await supabase
    .from('collections')
    .select('*, collection_posts(count)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Content Area (8/12) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Hero Section - Optimized & Moved Here */}
          {currentPage === 1 && (
            <section className="mb-8 border-b border-border/40 pb-8">
              <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${libreBaskerville.className}`}>
                理性投资，自在生活。
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                深度解读全球市场、加密资产与宏观趋势。
              </p>
            </section>
          )}

          {/* Featured Collections */}
          {currentPage === 1 && collections && collections.length > 0 && (
            <section className="pb-8 border-b border-border/40">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">精选集</h2>
                <Link href="/collections" className="text-sm font-medium text-primary hover:underline">
                  查看全部 →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collections.map((collection) => {
                  const postCount = collection.collection_posts[0]?.count || 0;
                  return (
                    <Link href={`/collections/${collection.slug}`} key={collection.id} className="block">
                      <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="p-0">
                          <div className="aspect-video relative">
                            <Image
                              src={collection.cover_image || `https://placehold.co/600x400?text=${collection.title}`}
                              alt={collection.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-5">
                          <CardTitle className="mb-2 text-lg group-hover:text-primary transition-colors">{collection.title}</CardTitle>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2 h-[40px]">
                            {collection.description}
                          </p>
                          <Badge variant="secondary" className="text-xs">共 {postCount} 篇文章</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Posts Feed */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
              {currentPage > 1 ? `第 ${currentPage} 页` : '最新研报'}
            </h2>
            <div className="space-y-8">
              {(posts as Post[])?.map((post) => (
                <article key={post.id} className="group relative border-b border-border/40 pb-8 last:border-0">
                  <div className="space-y-3">
                    {/* Metadata: Tags & Read Time */}
                    <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
                      {post.tags && post.tags.length > 0 ? (
                        post.tags.map((tag) => (
                          <span key={tag.id} className="bg-primary/10 px-1.5 py-0.5 rounded">
                            {tag.name}
                          </span>
                        ))
                      ) : (
                        <span className="bg-primary/10 px-1.5 py-0.5 rounded">Analysis</span>
                      )}
                      <span className="text-muted-foreground">• {Math.ceil(post.content.length / 500)} min read</span>
                    </div>

                    {/* Title */}
                    <div className="flex items-center justify-between">
                      <Link href={`/posts/${post.slug}`} className="block">
                        <h3 className={`text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors ${libreBaskerville.className}`}>
                          {post.title}
                        </h3>
                      </Link>
                      {post.is_premium && (
                        <Badge variant={'secondary'} className={'bg-amber-100 text-amber-800 shrink-0 ml-2'}>
                          <Lock className="w-3 h-3 mr-1.5" />
                          Premium
                        </Badge>
                      )}
                    </div>

                    {/* Summary */}
                    <p className="text-muted-foreground text-base line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                    
                    {/* AI Summary Button */}
                    <div className="pt-2">
                      <AISummaryButton postSlug={post.slug} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <Pagination totalPages={totalPages} />
        </div>

        {/* Right Sidebar (4/12) */}
        <aside className="lg:col-span-4 space-y-8">
          <MarketPulse />
          <TrendingSidebar />
          
          {/* Newsletter Box */}
          <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
            <h4 className={`text-lg font-bold mb-2 ${libreBaskerville.className}`}>Join the Inner Circle</h4>
            <p className="text-sm text-muted-foreground mb-4">
              获取每周深度研报与 Alpha 信号。
            </p>
            <NewsletterForm />
          </div>
        </aside>
      </div>
    </div>
  );
}


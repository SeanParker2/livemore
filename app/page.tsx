import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import { Libre_Baskerville } from 'next/font/google';
import { Lock } from 'lucide-react';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
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
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section - Only on page 1 */}
      {currentPage === 1 && (
        <>
          <section className="text-center py-16">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground ${libreBaskerville.className}`}>
              理性投资，自在生活。
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              深度解读全球市场、加密资产与宏观趋势。
            </p>
            <div className="mt-8 max-w-md mx-auto">
              <NewsletterForm />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <Link href="/archive" className="underline hover:text-foreground">
                先看看文章 →
              </Link>
            </p>
          </section>

          <section className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              深受来自高盛、摩根大通及贝莱德的专业投资者信赖。
            </p>
          </section>

          <Separator />
        </>
      )}

      {/* Featured Collections - Only on page 1 */}
      {currentPage === 1 && collections && collections.length > 0 && (
        <>
          <section className="py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">精选集</h2>
              <Link href="/collections" className="text-sm font-medium text-primary hover:underline">
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <CardContent className="p-6">
                        <CardTitle className="mb-2 text-xl group-hover:text-primary transition-colors">{collection.title}</CardTitle>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 h-[40px]">
                          {collection.description}
                        </p>
                        <Badge variant="secondary">共 {postCount} 篇文章</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
          <Separator />
        </>
      )}

      {/* Posts Feed */}
      <section className="py-16">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">
          {currentPage > 1 ? `第 ${currentPage} 页` : '最新研报'}
        </h2>
        <div className="space-y-12">
          {(posts as Post[])?.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.id} className="block group">
              <article>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-2xl font-semibold group-hover:underline ${libreBaskerville.className}`}>
                    {post.title}
                  </h3>
                  {post.is_premium && (
                    <Badge variant={'secondary'} className={'bg-amber-100 text-amber-800'}>
                      <Lock className="w-3 h-3 mr-1.5" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-base mb-4">
                  {post.summary}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar_url} />
                    <AvatarFallback>{post.author.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
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

      <Pagination totalPages={totalPages} />
    </div>
  );
}


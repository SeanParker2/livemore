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

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '700',
});

export default async function HomePage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('*, author:profiles(*)')
    .order('created_at', { ascending: false })
    .limit(10);

  const featuredPost = posts?.find(p => p.is_premium) || posts?.[0];
  const recentPosts = posts?.filter(p => p.id !== featuredPost?.id).slice(0, 5);

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
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

      {/* Social Proof Section */}
      <section className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          深受来自高盛、摩根大通及贝莱德的专业投资者信赖。
        </p>
      </section>

      <Separator />

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="py-16">
          <Card className="overflow-hidden">
            <Link href={`/posts/${featuredPost.slug}`}>
              <div className="aspect-video relative">
                <Image
                  src={`https://placehold.co/1200x675/003366/FFFFFF/png?text=Livemore`}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className={`text-2xl md:text-3xl font-bold ${libreBaskerville.className}`}>
                  {featuredPost.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {featuredPost.summary}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={featuredPost.author.avatar_url} />
                    <AvatarFallback>{featuredPost.author.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{featuredPost.author.full_name}</span>
                  <span>•</span>
                  <span>{new Date(featuredPost.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{Math.ceil(featuredPost.content.length / 500)} min read</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        </section>
      )}

      <Separator />

      {/* Recent Posts Feed */}
      <section className="py-16">
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8">
          最新研报
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {recentPosts?.slice(0, 2).map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.id} className="block group">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-semibold group-hover:underline ${libreBaskerville.className}`}>
                      {post.title}
                    </h3>
                    <Badge variant={post.is_premium ? 'default' : 'secondary'} className={post.is_premium ? 'bg-amber-100 text-amber-800' : ''}>
                      {post.is_premium && <Lock className="w-3 h-3 mr-1" />} 
                      {post.is_premium ? 'Premium' : 'Free'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{post.author.full_name}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                    <span>•</span>
                    <span>{Math.ceil(post.content.length / 500)} 分钟阅读</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {post.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags?.map((tag: any) => (
                      <Link href={`/tags/${tag.slug}`} key={tag.id}>
                        <Badge variant="outline">{tag.name}</Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="space-y-8 mt-8">
          {recentPosts?.slice(2).map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.id} className="block group">
              <article>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-semibold group-hover:underline ${libreBaskerville.className}`}>
                    {post.title}
                  </h3>
                  <Badge variant={post.is_premium ? 'default' : 'secondary'} className={post.is_premium ? 'bg-amber-100 text-amber-800' : ''}>
                    {post.is_premium && <Lock className="w-3 h-3 mr-1" />} 
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


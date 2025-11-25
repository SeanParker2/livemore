import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";

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
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Invest Smarter, Live More.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Deep dive analysis into global markets, crypto assets, and macro trends.
        </p>
        <div className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-12 text-base grow"
          />
          <Button size="lg" className="h-12 text-base">
            Subscribe
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/archive" className="underline hover:text-foreground">
            Let me read it first
          </Link>
        </p>
      </section>

      {/* Social Proof Section */}
      <section className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          Trusted by investors from Goldman Sachs, J.P. Morgan, and BlackRock.
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
                <CardTitle className="text-2xl md:text-3xl font-bold">
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
          Recent Posts
        </h2>
        <div className="space-y-8">
          {recentPosts?.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.id} className="block group">
              <article>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold group-hover:underline">
                    {post.title}
                  </h3>
                  <Badge variant={post.is_premium ? 'default' : 'secondary'}>
                    {post.is_premium ? 'Premium' : 'Free'}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                  {post.summary}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{post.author.full_name}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

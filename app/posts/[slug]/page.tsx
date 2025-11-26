import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PriceChart } from "@/components/ui/charts/price-chart";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", params.slug)
    .single();

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The post you are looking for does not exist.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*, author:profiles(*)')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();
  let userStatus = 'free';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('billing_status')
      .eq('id', user.id)
      .single();
    userStatus = profile?.billing_status || 'free';
  }

  const canViewFullContent = !post.is_premium || userStatus === 'premium' || userStatus === 'founder';

  const contentContainerClass = !canViewFullContent
    ? "relative max-h-[60vh] overflow-hidden"
    : "";

  const displayContent = canViewFullContent ? post.content : post.content.substring(0, post.content.length * 0.2) + '...';
  const contentParts = displayContent.split("<em>[Chart will be injected here]</em>");

  return (
    <article className="container relative max-w-3xl py-12">
      <div className="mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
        <div className="flex items-center justify-center space-x-4 text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar_url} alt={post.author.full_name} />
              <AvatarFallback>{post.author.full_name[0]}</AvatarFallback>
            </Avatar>
            <span>{post.author.full_name}</span>
          </div>
          <span className="text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className={contentContainerClass}>
        <div 
          className="prose prose-lg prose-slate dark:prose-invert max-w-none mx-auto"
        >
          <div dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
          
          {contentParts.length > 1 && (
            <>
              <div className="my-12">
                {/* <PriceChart data={post.chartData} /> */}
              </div>
              <div dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
            </>
          )}
        </div>
        {post.is_premium && !canViewFullContent && (
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-background to-transparent" />
        )}
      </div>

      {post.is_premium && !canViewFullContent && (
        <div className="relative flex justify-center -mt-16">
          <Card className="p-6 text-center shadow-lg">
            <CardContent className="p-0">
              <h3 className="text-xl font-bold mb-2">Subscribe to read the full analysis</h3>
              <p className="text-muted-foreground mb-4">Unlock this post and all future analysis.</p>
              <Button asChild size="lg">
                <Link href="/subscribe">Subscribe Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </article>
  );
}
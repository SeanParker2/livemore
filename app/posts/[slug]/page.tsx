import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PriceChart } from "@/components/ui/charts/price-chart";
import { getPostBySlug } from "@/lib/mock-service";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const contentContainerClass = post.isPremium 
    ? "relative max-h-[60vh] overflow-hidden"
    : "";

  const paywallContent = post.isPremium ? post.content.substring(0, post.content.length * 0.3) + '...' : post.content;
  const contentParts = paywallContent.split("<em>[Chart will be injected here]</em>");

  return (
    <article className="container relative max-w-3xl py-12">
      <div className="mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
        <div className="flex items-center justify-center space-x-4 text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <span>{post.author.name}</span>
          </div>
          <span className="text-sm">{post.date}</span>
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
                <PriceChart data={post.chartData} />
              </div>
              <div dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
            </>
          )}
        </div>
        {post.isPremium && (
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-background to-transparent" />
        )}
      </div>

      {post.isPremium && (
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
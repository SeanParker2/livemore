import { getRelatedPosts } from "@/lib/actions/post-actions";
import { Link } from "@/src/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/types";

interface RelatedPostsProps {
  postId: number;
  tagIds: number[];
}

export async function RelatedPosts({ postId, tagIds }: RelatedPostsProps) {
  const result = await getRelatedPosts(postId, tagIds);
  const relatedPosts = result?.success ? result.data : [];

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">延伸阅读</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post: Post) => (
          <Link href={`/posts/${post.slug}`} key={post.slug}>
            <Card className="h-full flex flex-col group hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="grow flex flex-col justify-end">
                <div className="flex items-center justify-between text-sm text-muted-foreground font-mono">
                  <span>{new Date(post.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                  <div className="flex gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
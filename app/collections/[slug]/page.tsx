import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("title, description")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!collection) {
    return { title: "精选集未找到" };
  }

  return {
    title: `${collection.title} - 精选集`,
    description: collection.description,
  };
}

interface Tag {
  slug: string;
  name: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  excerpt: string;
  created_at: string;
  tags: Tag[];
}

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { data: collection } = await supabase
    .from("collections")
    .select("*, posts(*, tags(name, slug))")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!collection) {
    notFound();
  }

  // The query above doesn't respect the order from the junction table.
  // We need a separate query to get the ordered posts.
  const { data: orderedPostsData } = await supabase
    .from('collection_posts')
    .select('posts(*, tags(name, slug))')
    .eq('collection_id', collection.id)
    .order('display_order', { ascending: true });

  const orderedPosts: Post[] = (orderedPostsData?.map(item => item.posts) || []).flat();

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="relative mb-12 h-80 rounded-lg overflow-hidden flex items-center justify-center text-center p-6 bg-secondary">
        {collection.cover_image && (
          <Image
            src={collection.cover_image}
            alt={collection.title}
            fill
            className="object-cover opacity-20"
          />
        )}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {collection.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {collection.description}
          </p>
        </div>
      </header>

      <div className="space-y-8">
        {orderedPosts.length > 0 ? (
          orderedPosts.map((post: Post, index) => (
            <div key={post.id}>
              <Link href={`/posts/${post.slug}`} className="block group">
                <Card className="hover:border-primary transition-colors">
                  <CardContent className="p-6 flex items-start gap-6">
                    <div className="text-4xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 group-hover:underline">{post.title}</CardTitle>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {post.summary || post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{new Date(post.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <div className="flex gap-2">
                          {post.tags.slice(0, 3).map((tag: Tag) => (
                            <Badge key={tag.slug} variant="secondary">{tag.name}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">该精选集下暂无文章。</p>
          </div>
        )}
      </div>
    </div>
  );
}

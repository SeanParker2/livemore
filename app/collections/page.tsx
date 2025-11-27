import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "精选集 - Livemore",
  description: "系统化学习，探索深度整理的系列文章。",
};

export default async function CollectionsPage() {
  const supabase = await createClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*, collection_posts(count)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          精选集
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          系统化学习，探索深度整理的系列文章。
        </p>
      </header>

      {collections && collections.length > 0 ? (
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
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">暂无精选集，敬请期待。</p>
        </div>
      )}
    </div>
  );
}

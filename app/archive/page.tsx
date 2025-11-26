import Link from "next/link";
import { Metadata } from "next";
import { dummyPosts } from "@/lib/dummy-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "文章归档 - Livemore",
  description: "探索 Livemore 的所有历史洞察与研报。",
};

export default function ArchivePage() {
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
        {dummyPosts.map((post, index) => (
          <div key={post.id}>
            <Link href={`/posts/${post.id}`} className="block group">
              <article>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-semibold group-hover:underline">
                    {post.title}
                  </h2>
                  <Badge variant={post.status === 'Paid' ? 'default' : 'secondary'}>
                    {post.status === 'Paid' ? '付费' : '免费'}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-2">
                  {post.summary}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}
                </p>
              </article>
            </Link>
            {index < dummyPosts.length - 1 && <Separator className="mt-8" />}
          </div>
        ))}
      </div>
    </div>
  );
}
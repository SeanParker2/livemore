
import { createClient } from "@/lib/supabase/server";
import RSS from "rss";

export async function GET() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("title, summary, slug, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const feed = new RSS({
    title: "Livemore | 理性投资，自在生活",
    description: "深度解读全球市场、加密资产与宏观趋势。",
    feed_url: `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
    site_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    language: "zh-CN",
  });

  posts?.forEach(post => {
    feed.item({
      title: post.title,
      description: post.summary,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${post.slug}`,
      date: post.created_at,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}

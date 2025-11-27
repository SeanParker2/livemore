import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("is_published", true);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const postEntries: MetadataRoute.Sitemap = (posts || []).map(({ slug, updated_at }) => ({
    url: `${siteUrl}/p/${slug}`,
    lastModified: updated_at ? new Date(updated_at) : new Date(),
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${siteUrl}/archive`,
      lastModified: new Date(),
      priority: 0.9,
    },
    ...postEntries,
  ];
}

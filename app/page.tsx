import { createClient } from "@/lib/supabase/server";
import { MarketPulse } from "@/components/home/MarketPulse";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { FeaturedPost } from "@/components/home/FeaturedPost";
import { LatestIntelligence } from "@/components/home/LatestIntelligence";
import { NewsletterWidget } from "@/components/home/NewsletterWidget";
import { Pagination } from "@/components/ui/pagination";
import { Post } from "@/lib/types";

const POSTS_PER_PAGE = 10;

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  // Fetch posts for pagination
  const { count } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  
  const totalPages = count ? Math.ceil(count / POSTS_PER_PAGE) : 0;
  const from = (currentPage - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts } = await supabase
    .from('posts')
    .select('*, author:profiles(*), tags:tags(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to);

  const allPosts = (posts as unknown as Post[]) || [];
  const featuredPost = currentPage === 1 ? allPosts[0] : null;
  const otherPosts = currentPage === 1 ? allPosts.slice(1) : allPosts;

  return (
    <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8">
                {featuredPost && (
                    <FeaturedPost post={featuredPost} />
                )}

                <LatestIntelligence posts={otherPosts} />
                
                <div className="mt-12">
                     <Pagination totalPages={totalPages} />
                </div>
            </div>

            <aside className="lg:col-span-4 space-y-12 pl-0 lg:pl-8 border-l border-transparent lg:border-fine">
                
                <MarketPulse />

                <TrendingSidebar />

                <NewsletterWidget />

            </aside>
        </div>
    </main>
  );
}

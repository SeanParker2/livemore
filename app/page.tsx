import { createClient } from "@/lib/supabase/server";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { MarketPulse } from "@/components/home/MarketPulse";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { ArticleCard } from "@/components/posts/ArticleCard";
import { Pagination } from "@/components/ui/pagination";

const POSTS_PER_PAGE = 10;

interface Author {
  avatar_url: string;
  full_name: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  is_premium: boolean;
  summary: string;
  content: string;
  created_at: string;
  author: Author;
  tags: Tag[];
}

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

  return (
    <>
      {/* Hero Section */}
      {currentPage === 1 && (
        <section className="border-b border-slate-100 bg-slate-50/50">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-slate-200 bg-white mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">System Online v2.0</span>
              </div>
              <h1 className="font-serif font-bold text-4xl md:text-5xl leading-[1.1] mb-6 text-slate-900">
                理性投资，自在生活。<br />
                <span className="text-slate-400">从噪音中提取 Alpha 信号。</span>
              </h1>
              <p className="text-lg text-slate-600 font-light leading-relaxed max-w-2xl">
                我们为专业投资者提供关于全球宏观市场、加密资产与前沿科技的深度解读。不追逐热点，只探究本质。
              </p>
            </div>
          </div>
        </section>
      )}

      <main className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area (8/12) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">Latest Intelligence</h2>
              <span className="text-xs font-mono text-slate-400">UPDATED: {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})} UTC</span>
            </div>

            {/* Posts Feed */}
            <div className="space-y-0">
              {(posts as unknown as Post[])?.map((post) => (
                <div key={post.id}>
                  <ArticleCard post={post} />
                  <div className="border-b border-slate-100 last:hidden"></div>
                </div>
              ))}
            </div>

            <Pagination totalPages={totalPages} />
          </div>

          {/* Right Sidebar (4/12) */}
          <aside className="lg:col-span-4 space-y-8">
            <MarketPulse />
            <TrendingSidebar />
            
            {/* Newsletter Box */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
              <h3 className="font-serif font-bold text-lg mb-2">Join the Inner Circle</h3>
              <p className="text-sm text-slate-300 mb-4 font-light">
                获取每周深度研报与高盛级别的 Alpha 信号，直接发送至您的邮箱。
              </p>
              <NewsletterForm isDark={true} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

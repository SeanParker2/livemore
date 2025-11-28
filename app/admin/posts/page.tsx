import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Edit } from "lucide-react";
import { DeletePostButton } from "../_components/DeletePostButton";
import { Search } from "../_components/Search";
import { Pagination } from "@/components/ui/pagination";
import { Suspense } from "react";
import { TableSkeleton } from "../_components/Skeletons";

import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

async function PostsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const supabase = await createClient();
  const itemsPerPage = 10;

  let supabaseQuery = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
  }

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  
  const { data: posts, count } = await supabaseQuery.range(from, to);

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>发布日期</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>阅读量</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                暂无文章
              </TableCell>
            </TableRow>
          ) : (
            posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium max-w-xs truncate" title={post.title}>
                  {post.title}
                </TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString("zh-CN")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Badge variant={post.is_premium ? "default" : "secondary"}>
                      {post.is_premium ? "付费" : "免费"}
                    </Badge>
                    <Badge variant={post.status === 'published' ? "outline" : "secondary"}>
                      {post.status === 'published' ? "已发布" : "草稿"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{post.views}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/posts/${post.slug}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>编辑文章</p>
                    </TooltipContent>
                  </Tooltip>
                  <DeletePostButton postId={post.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <div className="mt-4">
        <Pagination totalPages={totalPages} />
      </div>
    </TooltipProvider>
  );
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">文章管理</h1>
        <Button asChild>
          <Link href="/admin/posts/create">
            <PlusCircle className="w-4 h-4 mr-2" />
            撰写新文章
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>文章列表</CardTitle>
            <Search placeholder="搜索文章标题..." />
          </div>
        </CardHeader>
        <CardContent>
          <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
            <PostsTable query={query} currentPage={currentPage} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

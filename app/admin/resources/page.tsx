import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Edit, Download } from "lucide-react";
import { DeleteResourceButton } from "../_components/DeleteResourceButton";
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

async function ResourcesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const supabase = await createClient();
  const itemsPerPage = 10;

  let supabaseQuery = supabase
    .from("resources")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
  }

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  
  const { data: resources, count } = await supabaseQuery.range(from, to);
  const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>标题</TableHead>
            <TableHead>上传日期</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>下载量</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                暂无资源
              </TableCell>
            </TableRow>
          ) : (
            resources?.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium max-w-xs truncate" title={resource.title}>
                  {resource.title}
                </TableCell>
                <TableCell>{new Date(resource.created_at).toLocaleDateString("zh-CN")}</TableCell>
                <TableCell>
                  <Badge variant={resource.is_premium ? "default" : "secondary"}>
                    {resource.is_premium ? "会员专享" : "免费"}
                  </Badge>
                </TableCell>
                <TableCell>{resource.downloads || 0}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={resource.file_path} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>下载资源</p>
                    </TooltipContent>
                  </Tooltip>
                  <DeleteResourceButton resourceId={resource.id} />
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

export default async function AdminResourcesPage({
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
        <h1 className="text-3xl font-bold">资源管理</h1>
        <Button asChild>
          <Link href="/admin/resources/create">
            <PlusCircle className="w-4 h-4 mr-2" />
            上传新资源
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>资源列表</CardTitle>
            <Search placeholder="搜索资源标题..." />
          </div>
        </CardHeader>
        <CardContent>
          <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
            <ResourcesTable query={query} currentPage={currentPage} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

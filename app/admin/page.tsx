
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Edit, BookText, Users, FileArchive } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: postsCount } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true });

  const { count: resourcesCount } = await supabase
    .from("resources")
    .select("id", { count: "exact", head: true });

  const { count: subscribersCount } = await supabase
    .from("subscribers")
    .select("id", { count: "exact", head: true });
    
  const { data: latestPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
        <div className="hidden md:flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/posts/create">
              <PlusCircle className="w-4 h-4 mr-2" />
              撰写新文章
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总文章数</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总资源数</CardTitle>
            <FileArchive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resourcesCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">订阅用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribersCount ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>最新文章</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/posts">查看全部</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestPosts?.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-xs truncate" title={post.title}>{post.title}</TableCell>
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
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/posts/${post.slug}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>近期活动</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">暂无活动</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlusCircle, Edit } from "lucide-react";
import { DeletePostButton } from "./_components/DeletePostButton";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: posts, count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const { count: subscribersCount } = await supabase
    .from("subscribers")
    .select("id", { count: "exact", head: true });

  const premiumCount = posts?.filter(p => p.is_premium).length || 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <Button asChild>
          <Link href="/admin/posts/create">
            <PlusCircle className="w-4 h-4 mr-2" />
            撰写新文章
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>总文章数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{postsCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>付费文章</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{premiumCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>订阅用户</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{subscribersCount ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>文章列表</CardTitle>
        </CardHeader>
        <CardContent>
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
              {posts?.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{new Date(post.created_at).toLocaleDateString('zh-CN')}</TableCell>
                  <TableCell>
                    <Badge variant={post.is_premium ? "default" : "secondary"}>
                      {post.is_premium ? "付费" : "免费"}
                    </Badge>
                  </TableCell>
                  <TableCell>1,234</TableCell> {/* Mocked data */}
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/posts/${post.slug}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeletePostButton postId={post.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

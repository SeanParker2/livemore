
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Home, Newspaper, Users, Settings, FileText, Download, Gift } from "lucide-react";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("billing_status")
    .eq("id", user.id)
    .single();

  if (profile?.billing_status !== "founder") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">权限不足</h1>
        <p className="text-muted-foreground mb-8">此区域仅限管理员访问。</p>
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted/40 border-r p-4 flex flex-col">
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/admin">
              <Home className="w-4 h-4" />
              仪表盘
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/admin/posts">
              <FileText className="w-4 h-4" />
              文章管理
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/admin/resources">
              <Download className="w-4 h-4" />
              资源管理
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/admin/gifts">
              <Gift className="w-4 h-4" />
              兑换码
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/admin/subscribers">
              <Users className="w-4 h-4" />
              订阅者
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href="/admin/settings">
              <Settings className="w-4 h-4" />
              设置
            </Link>
          </Button>
        </nav>
        <div className="mt-auto">
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <Link href="/">
              <Newspaper className="w-4 h-4" />
              返回主站
            </Link>
          </Button>
        </div>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}

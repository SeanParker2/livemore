import { headers } from "next/headers";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Home, Newspaper, Users, Settings, FileText, Download, Gift } from "lucide-react";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const headerList = await headers();
  const adminPath = headerList.get('x-admin-path');
  
  // If we don't have the admin path header, it implies direct access or misconfiguration.
  // The middleware should have handled this, but we default to a safe path or root.
  // However, for the links to work, we need the secret.
  // If missing, links will just be /admin/... which will be 404'd by middleware.
  const basePath = adminPath ? `/admin/${adminPath}` : '/admin';

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted/40 border-r p-4 flex flex-col">
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href={basePath}>
              <Home className="w-4 h-4" />
              仪表盘
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href={`${basePath}/posts`}>
              <FileText className="w-4 h-4" />
              文章管理
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href={`${basePath}/resources`}>
              <Download className="w-4 h-4" />
              资源管理
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href={`${basePath}/gifts`}>
              <Gift className="w-4 h-4" />
              兑换码
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href={`${basePath}/subscribers`}>
              <Users className="w-4 h-4" />
              订阅者
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-2" asChild>
            <Link href={`${basePath}/settings`}>
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

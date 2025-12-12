import Link from "next/link";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Settings,
  Home,
  Users,
  Download,
  Gift,
  Newspaper
} from "lucide-react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

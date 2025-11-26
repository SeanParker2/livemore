
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { Home, Newspaper, Users, Settings } from "lucide-react";

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
    return redirect("/");
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

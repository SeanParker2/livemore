import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { signOut } from "@/lib/actions/auth-actions";
import { MobileNav } from "./MobileNav";
import { SiteSearch } from "@/components/SiteSearch";
import { ThemeToggle } from "../ThemeToggle";

import { Libre_Baskerville } from 'next/font/google';

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: '700',
});

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let billingStatus: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('billing_status')
      .eq('id', user.id)
      .single();
    if (profile) {
      billingStatus = profile.billing_status;
    }
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="h-8 bg-primary text-primary-foreground flex items-center justify-center text-sm">
        ✨ 全新深度分析报告，马上领取 →
      </div>
      <header className="border-b border-border/40">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <MobileNav isFounder={billingStatus === 'founder'} />
          <div className="flex-1 md:flex md:items-center md:justify-between">
            <div className="hidden md:flex md:items-center md:gap-6">
              <Link href="/" className="mr-6 flex items-center space-x-2">
                <span className={`font-bold text-2xl tracking-tight ${libreBaskerville.className}`}>Signal & Cipher</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Link
                  href="/archive"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  归档
                </Link>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  关于
                </Link>

                {billingStatus === 'founder' && (
                  <Link
                    href="/admin"
                    className="font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    管理后台
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <SiteSearch />
              <ThemeToggle />
              <nav className="flex items-center gap-4">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || user.email} />
                          <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.user_metadata.full_name || user.email}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">用户中心</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <form action={signOut}>
                        <DropdownMenuItem asChild>
                          <button className="w-full text-left">退出登录</button>
                        </DropdownMenuItem>
                      </form>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">登录</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/subscribe">订阅</Link>
                    </Button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
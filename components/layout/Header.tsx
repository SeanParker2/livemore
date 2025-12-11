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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Link href="/" className="flex items-center gap-2">
              <div className="h-5 w-5 bg-slate-900 rounded-sm"></div>
              <span className="font-serif font-bold text-xl tracking-tight text-slate-900">Signal & Cipher</span>
           </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Markets</Link>
          <Link href="/archive" className="hover:text-slate-900 transition-colors">Intelligence</Link>
          <Link href="/archive" className="hover:text-slate-900 transition-colors">Archive</Link>
          
          {billingStatus === 'founder' && (
             <Link href="/admin" className="hover:text-slate-900 transition-colors font-bold text-amber-600">Admin</Link>
          )}

          <div className="flex items-center gap-4 ml-4">
            <SiteSearch />
            <ThemeToggle />
            
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
                  {billingStatus === 'founder' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">管理后台</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
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
               <Link href="/subscribe" className="text-slate-900 font-bold hover:opacity-80 transition-opacity">
                 Subscribe
               </Link>
            )}
          </div>
        </nav>

        <div className="flex md:hidden items-center gap-4">
           <SiteSearch />
           {!user && (
             <Link href="/subscribe" className="text-sm font-bold text-slate-900">
               Subscribe
             </Link>
           )}
           <MobileNav isFounder={billingStatus === 'founder'} />
        </div>
      </div>
    </header>
  );
}
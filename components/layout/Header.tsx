import { Link } from "@/src/navigation";
import NextLink from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Triangle } from "lucide-react";
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
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "./LocaleSwitcher";

export async function Header() {
  const t = await getTranslations('Nav');
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-fine">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-foreground flex items-center justify-center">
                        <Triangle className="w-4 h-4 text-background fill-current" />
                    </div>
                    <span className="font-serif font-bold text-xl tracking-widest text-foreground">AXIOM</span>
                </Link>
            </div>
            
            <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground items-center">
                <Link href="/archive" className="hover:text-foreground transition-colors">{t('intelligence')}</Link>
                <Link href="/markets" className="hover:text-foreground transition-colors">{t('markets')}</Link>
                <Link href="/signals" className="hover:text-foreground transition-colors">{t('signals')}</Link>
                {billingStatus === 'founder' && (
                     <NextLink href="/admin" className="hover:text-foreground transition-colors font-bold text-amber-600">{t('admin')}</NextLink>
                )}
                <LocaleSwitcher />
            </nav>

            <div className="flex items-center gap-4">
                {/* Search Button/Component */}
                <div className="hidden md:block">
                   <SiteSearch />
                </div>

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
                            <NextLink href="/admin">{t('admin')}</NextLink>
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
                    <Link href="/subscribe">
                        <button className="bg-slate-900 text-white px-4 py-2 text-xs font-mono font-medium hover:bg-slate-800 transition-colors">
                            SUBSCRIBE ACCESS
                        </button>
                    </Link>
                )}

                 <div className="md:hidden">
                    <MobileNav isFounder={billingStatus === 'founder'} />
                 </div>
            </div>
        </div>
    </header>
  );
}

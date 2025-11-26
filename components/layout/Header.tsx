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
        ✨ New Premium Analysis: The Future of Quantum Computing. Read Now →
      </div>
      <header className="border-b border-border/40">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-serif font-bold text-2xl tracking-tight">Livemore</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/archive"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Archive
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              {billingStatus === 'founder' && (
                <Link
                  href="/admin/posts/create"
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Write
                </Link>
              )}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
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
                    <Link href="/subscribe">Subscribe</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
import { signInWithMagicLink } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Livemore",
};

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-sm p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Enter your email to receive a magic link.</p>
        </div>
        
        <form action={signInWithMagicLink} className="space-y-4">
          <div>
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-12 text-base"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold">Send Magic Link</Button>
        </form>

        {searchParams.message && (
          <p className="text-center text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {searchParams.message}
          </p>
        )}
      </div>
    </div>
  );
}
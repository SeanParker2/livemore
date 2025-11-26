import { signInWithMagicLink } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录 - Livemore",
};

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-sm p-8 space-y-6 bg-card text-card-foreground rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">欢迎回到 Livemore</h1>
          <p className="text-muted-foreground">专业投资者的每日必读。请输入邮箱登录或注册。</p>
        </div>
        
        <form action={signInWithMagicLink} className="space-y-4">
          <div>
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              className="h-12 text-base mt-1"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold">发送登录链接</Button>
        </form>

        {searchParams.message && (
          <p className="text-center text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {searchParams.message}
          </p>
        )}
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          🔒 我们尊重您的隐私。无密码登录，安全便捷。
        </p>
      </div>
    </div>
  );
}
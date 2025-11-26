import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
      <h1 className="text-4xl font-bold">404 - 迷失在市场波动中</h1>
      <p className="text-muted-foreground mt-4">您要找的页面可能已经不存在，或者暂时无法访问。</p>
      <Button asChild className="mt-8">
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}

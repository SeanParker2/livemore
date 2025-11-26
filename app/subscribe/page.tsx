import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";

export const metadata: Metadata = {
  title: "订阅 - Livemore",
  description: "投资你的大脑，加入 5,000+ 理性投资者，获取超额收益。",
};

const features = {
  free: [
    "每周一篇宏观市场简报",
    "访问部分历史归档",
    "加入读者交流群",
  ],
  pro: [
    "解锁所有深度研报 (每周更新)",
    "实盘持仓披露 & 买卖逻辑",
    "专属高净值会员群",
    "优先邮件支持",
  ],
};

export default function SubscribePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          投资你的大脑
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          加入 5,000+ 理性投资者，获取超额收益。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="border rounded-lg p-8 flex flex-col">
          <h2 className="text-2xl font-bold">免费订阅</h2>
          <p className="mt-4 text-muted-foreground">适合想要初步了解我们的读者。</p>
          <div className="mt-6">
            <span className="text-4xl font-bold">¥0</span>
            <span className="text-lg font-medium text-muted-foreground"> / 永久</span>
          </div>
          <ul className="mt-8 space-y-4">
            {features.free.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="grow" />
          <Button asChild variant="outline" className="mt-8 w-full">
            <Link href="/#newsletter">免费订阅</Link>
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="border-2 border-primary rounded-lg p-8 flex flex-col relative">
          <div className="absolute top-0 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">
            推荐
          </div>
          <h2 className="text-2xl font-bold">年度会员</h2>
          <p className="mt-4 text-muted-foreground">解锁全部内容，与顶尖投资者同行。</p>
          <div className="mt-6">
            <span className="text-4xl font-bold">¥299</span>
            <span className="text-lg font-medium text-muted-foreground"> / 年</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">每天不到 1 元</p>
          <ul className="mt-8 space-y-4">
            {features.pro.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span className={feature.includes('解锁所有') ? 'font-semibold' : ''}>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="grow" />
          <Button asChild className="mt-8 w-full">
            <Link href="/login">立即升级</Link>
          </Button>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground">30 天无理由退款保证 · 随时取消</p>
      </div>
    </div>
  );
}

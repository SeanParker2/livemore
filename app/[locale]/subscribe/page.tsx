'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import Image from "next/image";
import { Link } from "@/src/navigation";

export default function SubscribePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">会员计划</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">选择最适合您的方案，获取深度市场洞察。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle>免费版</CardTitle>
            <CardDescription>适合所有希望了解市场的投资者。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">¥0<span className="text-lg font-normal text-muted-foreground">/永久</span></div>
            <ul className="space-y-2">
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />每周市场简报</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full"><Link href="#newsletter-form">免费订阅</Link></Button>
          </CardFooter>
        </Card>

        {/* Annual Plan */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>年度会员</CardTitle>
            <CardDescription>解锁全部内容，获得最全面的分析。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">¥299<span className="text-lg font-normal text-muted-foreground">/年</span></div>
            <ul className="space-y-2">
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />解锁所有深度研报</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />查看作者实盘披露</li>
              <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />加入会员专属社群</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">立即升级</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>开通年度会员</DialogTitle>
                  <DialogDescription>
                    请扫描上方二维码添加站长微信，备注【会员】，支付完成后将为您手动开通权限。
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 text-center">
                  <div className="flex justify-center">
                    <Image src="https://placehold.co/200x200?text=WeChat" alt="WeChat QR Code" width={200} height={200} />
                  </div>
                </div>
                <DialogFooter>
                  <p className="text-sm text-muted-foreground">支持微信/支付宝。通常在 30 分钟内开通。</p>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      <div id="newsletter-form" className="mt-16 text-center">
        <h2 className="text-3xl font-bold">订阅免费周报</h2>
        <p className="text-muted-foreground mt-2">每周一，市场精华准时送达。</p>
        {/* Newsletter form will be here */}
      </div>
    </div>
  );
}

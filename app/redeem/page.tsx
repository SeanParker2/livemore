'use client';

import { useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { redeemCode } from "@/lib/actions/redemption-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          正在兑换...
        </>
      ) : (
        "立即兑换"
      )}
    </Button>
  );
}

export default function RedeemPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await redeemCode(null, formData);
      
      if (result?.failure) {
        toast.error("兑换失败", { description: result.failure });
      } else if (result?.success) {
        toast.success("兑换成功", { description: result.success });
      }
    });
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>兑换会员</CardTitle>
          <CardDescription>请输入您的兑换码，立即激活会员权益。</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">兑换码</Label>
              <Input id="code" name="code" placeholder="GIFT-2025-XYZ" required />
            </div>
            <SubmitButton isPending={isPending} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

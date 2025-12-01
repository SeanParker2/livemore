'use client';

import { useAction } from 'next-safe-action/hooks';
import { redeemCode } from '@/lib/actions/redemption-actions';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function SubmitButton({ isPending }: { isPending: boolean }) {
  return <Button type="submit" disabled={isPending} className="w-full">{isPending ? '兑换中...' : '兑换'}</Button>;
}

export default function RedeemPage() {
  const { execute, status } = useAction(redeemCode, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("兑换成功！", { description: data.success });
      }
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error("兑换失败", { description: error.serverError });
      } else if (error.validationErrors) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validationErrors = error.validationErrors as any;
        const firstError = Object.values(validationErrors).flat().shift() as string;
        if (firstError) {
          toast.error("输入无效", { description: firstError });
        }
      }
    },
  });

  const isPending = status === 'executing';

  const handleSubmit = (formData: FormData) => {
    const code = formData.get('code') as string;
    execute({ code });
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

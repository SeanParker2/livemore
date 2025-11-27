'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { redeemCode } from '@/lib/actions/redemption-actions';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  return <Button type="submit">兑换</Button>;
}

export default function RedeemPage() {
  const [state, formAction] = useFormState(redeemCode, null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? "成功" : "操作失败",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>兑换会员</CardTitle>
          <CardDescription>请输入您的兑换码，立即激活会员权益。</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Input id="code" name="code" placeholder="GIFT-2025-XYZ" required />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import React from 'react';
import { useAction } from 'next-safe-action/hooks';
import { generateCodes } from '@/lib/actions/redemption-actions';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';

function SubmitButton({ isPending }: { isPending: boolean }) {
  return <Button type="submit" disabled={isPending}>{isPending ? '生成中...' : '生成兑换码'}</Button>;
}

interface RedemptionCode {
  id: string;
  code: string;
  duration_days: number;
  is_used: boolean;
  used_by: string | null;
}

export default function AdminGiftsPage() {
  const [codes, setCodes] = React.useState<RedemptionCode[]>([]);

  async function fetchCodes() {
    const supabase = createClient();
    const { data } = await supabase.from('redemption_codes').select('*').order('created_at', { ascending: false });
    setCodes(data || []);
  }

  const { execute, status } = useAction(generateCodes, {
    onSuccess: ({ data }) => {
      if (data && "success" in data && data.success) {
        toast.success("成功", { description: data.success });
        fetchCodes();
      } else if (data && "failure" in data && data.failure) {
        toast.error("操作失败", { description: data.failure });
      }
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error("操作失败", { description: error.serverError });
      } else if (error.validationErrors) {
        const validationErrorMessages = Object.values(
          error.validationErrors,
        )
          .flat()
          .join(", ");
        toast.error("输入无效", {
          description: validationErrorMessages,
        });
      }
    },
  });

  const isPending = status === 'executing';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const count = Number(formData.get('count'));
    const duration_days = Number(formData.get('duration_days'));
    execute({ count, duration_days });
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="w-full max-w-2xl mb-8">
        <CardHeader>
          <CardTitle>生成兑换码</CardTitle>
          <CardDescription>批量生成会员兑换码，用于赠送或活动。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="count">生成数量</Label>
                <Input id="count" name="count" type="number" placeholder="例如: 10" required min={1} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration_days">有效天数</Label>
                <Input id="duration_days" name="duration_days" type="number" placeholder="例如: 30" required min={1} />
              </div>
            </div>
            <SubmitButton isPending={isPending} />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>已生成的兑换码</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {codes.map((code) => (
              <div key={code.id} className={`p-2 rounded-md text-sm ${code.is_used ? 'bg-gray-100 text-gray-500' : 'bg-green-100'}`}>
                <span className="font-mono">{code.code}</span> - {code.duration_days}天 - {code.is_used ? `已被 ${code.used_by} 使用` : '未使用'}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

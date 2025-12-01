'use client';

import React, { useEffect } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { generateCodes, generateCodesSchema, returnSchemaGenerate } from '@/lib/actions/redemption-actions';
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';

function SubmitButton({ isPending }: { isPending: boolean }) {
  return <Button type="submit" disabled={isPending}>{isPending ? '生成中...' : '生成兑换码'}</Button>;
}

export default function AdminGiftsPage() {
  const [codes, setCodes] = React.useState<any[]>([]);

  async function fetchCodes() {
    const supabase = createClient();
    const { data } = await supabase.from('redemption_codes').select('*').order('created_at', { ascending: false });
    setCodes(data || []);
  }

  useEffect(() => {
    fetchCodes();
  }, []);

  const { execute, status } = useAction(generateCodes, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success("成功", { description: data });
        fetchCodes();
      }
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast.error("操作失败", { description: error.serverError });
      }
    },
  });

  const isPending = status === 'executing';

  const handleSubmit = (formData: FormData) => {
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
          <form action={handleSubmit} className="space-y-4">
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

'use client';

import { useFormState } from 'react-dom';
import React, { useEffect } from 'react';
import { generateCodes } from '@/lib/actions/redemption-actions';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/supabase/client';

function SubmitButton() {
  return <Button type="submit">生成兑换码</Button>;
}

export default function AdminGiftsPage() {
  const [state, formAction] = useFormState(generateCodes, null);
  const { toast } = useToast();
  const [codes, setCodes] = React.useState<any[]>([]);

  async function fetchCodes() {
    const supabase = createClient();
    const { data } = await supabase.from('redemption_codes').select('*').order('created_at', { ascending: false });
    setCodes(data || []);
  }

  useEffect(() => {
    fetchCodes();
  }, []);

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? "成功" : "操作失败",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        fetchCodes();
      }
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto py-12">
      <Card className="w-full max-w-2xl mb-8">
        <CardHeader>
          <CardTitle>生成兑换码</CardTitle>
          <CardDescription>批量生成会员兑换码，用于赠送或活动。.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <Input id="count" name="count" type="number" placeholder="生成数量" required />
            <Input id="duration_days" name="duration_days" type="number" placeholder="有效天数" required />
            <SubmitButton />
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
              <div key={code.id} className={`p-2 rounded-md ${code.is_used ? 'bg-gray-100 text-gray-500' : 'bg-green-100'}`}>
                <span className="font-mono">{code.code}</span> - {code.duration_days}天 - {code.is_used ? `已被 ${code.used_by} 使用` : '未使用'}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

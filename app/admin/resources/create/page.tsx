'use client';

import { createResource } from "@/lib/actions/resource-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? '正在上传...' : '创建资源'}
    </Button>
  );
}

export default function CreateResourcePage() {
  const [state, formAction] = useFormState(createResource, null);
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
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>创建新资源</CardTitle>
          <CardDescription>上传文件并填写相关信息以创建新的可下载资源。</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input id="title" name="title" placeholder="例如：2024年宏观经济分析模型" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea id="description" name="description" placeholder="简单介绍这个资源的内容和价值。" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">资源文件 (PDF, Excel, etc.)</Label>
              <Input id="file" name="file" type="file" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover_image">封面图片 (可选)</Label>
              <Input id="cover_image" name="cover_image" type="file" accept="image/*" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="is_premium" name="is_premium" defaultChecked />
              <Label htmlFor="is_premium">此为付费会员专享资源</Label>
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

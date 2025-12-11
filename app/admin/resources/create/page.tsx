'use client';

import { createResource } from "@/lib/actions/resource-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? '正在上传...' : '创建资源'}
    </Button>
  );
}

export default function CreateResourcePage() {
  const router = useRouter();

  const createResourceAction = async (formData: FormData) => {
    const supabase = createClient();

    const resourceFile = formData.get('file') as File;
    const coverImageFile = formData.get('cover_image') as File | null;

    if (!resourceFile || resourceFile.size === 0) {
      toast.error("操作失败", { description: "资源文件不能为空" });
      return;
    }

    const resourceFilePath = `public/${Date.now()}-${resourceFile.name}`;
    const { error: fileUploadError } = await supabase.storage
      .from('resources')
      .upload(resourceFilePath, resourceFile);

    if (fileUploadError) {
      toast.error("操作失败", { description: `资源文件上传失败: ${fileUploadError.message}` });
      return;
    }

    let coverImagePath: string | null = null;
    if (coverImageFile && coverImageFile.size > 0) {
      const imagePath = `public/${Date.now()}-${coverImageFile.name}`;
      const { error: imageUploadError } = await supabase.storage
        .from('images')
        .upload(imagePath, coverImageFile);

      if (imageUploadError) {
        toast.warning("提醒", { description: `封面图片上传失败: ${imageUploadError.message}` });
      } else {
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(imagePath);
        coverImagePath = publicUrl;
      }
    }

    formData.set('file_path', resourceFilePath);
    if (coverImagePath) {
      formData.set('cover_image', coverImagePath);
    }
    // Checkbox sends 'on' if checked, otherwise null. Convert to 'true'/'false' for server action if needed,
    // but createResource expects 'true' string for boolean check.
    // formData.get('is_premium') is 'on' or null.
    formData.set('is_premium', formData.get('is_premium') === 'on' ? 'true' : 'false');

    const result = await createResource(null, formData);

    if (!result.success) {
      toast.error("操作失败", { description: result.message });
    } else {
      toast.success("成功", { description: result.message });
      router.push('/admin/resources');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>创建新资源</CardTitle>
          <CardDescription>上传文件并填写相关信息以创建新的可下载资源。</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createResourceAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">标题</Label>
              <Input id="title" name="title" placeholder="例如：2024年宏观经济分析模型" required minLength={2} />
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

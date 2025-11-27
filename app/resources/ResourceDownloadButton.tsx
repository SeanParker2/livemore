'use client';

import { Button } from "@/components/ui/button";
import { downloadResource } from "@/lib/actions/resource-actions";
import { useToast } from "@/components/ui/use-toast";

interface Resource {
  id: string;
  title: string;
  description: string;
  file_path: string;
  cover_image: string;
  is_premium: boolean;
  downloads_count: number;
  profile: {
    billing_status: string | null;
  } | null;
}

interface Props {
  resource: Resource;
  userId: string | undefined;
}

export default function ResourceDownloadButton({ resource, userId }: Props) {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!userId) {
      toast({ title: "请先登录", description: "登录后即可下载免费资源或订阅会员。", variant: "destructive" });
      return;
    }

    const result = await downloadResource(resource.id);

    if (result.success) {
      toast({ title: "已开始下载", description: "文件将在新标签页中打开。" });
      window.open(result.url, "_blank");
    } else {
      toast({ title: "下载失败", description: result.message, variant: "destructive" });
    }
  };

  const canDownload = !resource.is_premium || resource.profile?.billing_status === 'premium' || resource.profile?.billing_status === 'founder';

  return (
    <Button onClick={handleDownload} disabled={!canDownload && resource.is_premium} className="w-full">
      {resource.is_premium && !canDownload ? "🔒 订阅解锁下载" : "⬇️ 立即下载"}
    </Button>
  );
}

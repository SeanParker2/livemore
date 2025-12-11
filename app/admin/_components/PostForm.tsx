
'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Post } from "@/lib/types";
import { MultiSelect } from "./MultiSelect";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/actions/image-actions";

import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt();

function SubmitButton({ isEditing, isExecuting }: { isEditing: boolean; isExecuting: boolean }) {
  return (
    <Button type="submit" disabled={isExecuting} size="lg">
      {isExecuting ? (isEditing ? "更新中..." : "发布中...") : (isEditing ? "更新文章" : "发布文章")}
    </Button>
  );
}

interface PostFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (prevState: any, formData: FormData) => Promise<any>;
  initialData?: Post | null;
}

export function PostForm({ action, initialData }: PostFormProps) {
  const isEditing = !!initialData;
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags?.map(t => t.id.toString()) || []);
  const [content, setContent] = useState(initialData?.content || '');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchTags = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('tags').select('id, name');
      if (data) {
        setTags(data.map(t => ({ value: t.id.toString(), label: t.name })));
      }
    };
    fetchTags();
  }, []);

  async function handleImageUpload(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const result = await uploadImage(null, formData);
    if (result?.success) {
      return result.success;
    }
    if (result?.failure) {
      toast.error("图片上传失败", { description: result.failure });
    }
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // Append manually managed state to FormData
    if (initialData?.id) {
        formData.append('id', initialData.id.toString());
    }
    formData.append('content', content);
    formData.append('tags', selectedTags.join(','));
    // is_premium and broadcast_email are checkboxes/switches, 
    // if unchecked they might not be in formData, but checked ones are 'on'.
    // We should ensure they are handled correctly by the server action.
    // The server action checks `formData.get('is_premium') === 'true'`?
    // Wait, Checkbox/Switch usually sends 'on' if checked.
    // My server action logic: `const is_premium = formData.get('is_premium') === 'true';`
    // This is problematic if the value is 'on'. 
    // Let's fix the formData values here to match server expectation or update server action.
    // Easier to set explicit 'true'/'false' string in formData here.
    
    // Actually, let's override them to be safe
    formData.set('is_premium', (formData.get('is_premium') === 'on').toString());
    formData.set('broadcast_email', (formData.get('broadcast_email') === 'on').toString());

    startTransition(async () => {
        const result = await action(null, formData);
        if (result?.success) {
            toast.success("操作成功!", { description: result.success });
        } else if (result?.failure) {
            toast.error("操作失败", { description: result.failure });
        } else {
             // Fallback
             toast.error("操作失败", { description: "未知错误" });
        }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lg">标题</Label>
        <Input
          id="title"
          name="title"
          placeholder="例如：AI 在金融领域的未来"
          className="text-2xl h-14"
          required
          minLength={1}
          defaultValue={initialData?.title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">标签</Label>
        <MultiSelect 
          options={tags}
          initialValue={selectedTags}
          onValueChange={setSelectedTags}
          placeholder="选择或创建标签..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">摘要</Label>
        <Textarea
          id="summary"
          name="summary"
          placeholder="将显示在首页和归档页的简短摘要。"
          rows={3}
          defaultValue={initialData?.summary}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">正文 (支持 Markdown)</Label>
        <MdEditor
          id="content"
          value={content}
          style={{ height: '600px' }}
          className="font-mono"
          renderHTML={text => mdParser.render(text)}
          onChange={({ text }) => setContent(text)}
          onImageUpload={handleImageUpload}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base">发布状态</Label>
        <RadioGroup defaultValue={initialData?.status || "draft"} name="status" className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="published" id="published" />
            <Label htmlFor="published">✅ 直接发布</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="draft" id="draft" />
            <Label htmlFor="draft">📝 存为草稿</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="is_premium" 
          name="is_premium" 
          defaultChecked={initialData?.is_premium}
        />
        <Label htmlFor="is_premium">付费内容 (仅限订阅者)</Label>
      </div>

      <div className="mb-4 flex items-center space-x-2">
          <Checkbox id="broadcast" name="broadcast_email" />
          <label
            htmlFor="broadcast"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            📧 发布后通过邮件推送给所有订阅者
          </label>
        </div>
        <div className="flex justify-end">
          <SubmitButton isEditing={isEditing} isExecuting={isPending} />
        </div>
    </form>
  );
}

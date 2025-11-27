
'use client';

import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Post } from "@/lib/types";
import { MultiSelect } from "./MultiSelect";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/actions/image-actions";

import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';

const mdParser = new MarkdownIt();

const initialState = {
  success: false,
  message: "",
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? (isEditing ? "更新中..." : "发布中...") : (isEditing ? "更新文章" : "发布文章")}
    </Button>
  );
}

interface PostFormProps {
  action: (prevState: any, formData: FormData) => Promise<{ success: boolean; message: string; }>;
  initialData?: Post | null;
}

export function PostForm({ action, initialData }: PostFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const isEditing = !!initialData;
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags?.map(t => t.id.toString()) || []);
  const [content, setContent] = useState(initialData?.content || '');

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

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success("操作成功!", { description: state.message });
      } else {
        toast.error("操作失败", { description: state.message });
      }
    }
  }, [state]);

  async function handleImageUpload(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const result = await uploadImage(formData);
      return result.publicUrl;
    } catch (error) {
      console.error(error);
      toast.error("图片上传失败", { description: (error as Error).message });
      return null;
    }
  }

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lg">标题</Label>
        <Input
          id="title"
          name="title"
          placeholder="例如：AI 在金融领域的未来"
          className="text-2xl h-14"
          required
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
        <input type="hidden" name="tags" value={selectedTags.join(',')} />
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
        <input type="hidden" name="content" value={content} />
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
          <SubmitButton isEditing={isEditing} />
        </div>
    </form>
  );
}

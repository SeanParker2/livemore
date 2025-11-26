"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createPost } from "@/lib/actions/admin-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? "Publishing..." : "Publish Now"}
    </Button>
  );
}

export function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success("Success!", { description: state.message });
      } else {
        toast.error("Error", { description: state.message });
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lg">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="The Future of AI in Finance"
          className="text-2xl h-14"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          placeholder="auto-generated-if-empty"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          placeholder="A short summary that appears on the homepage and archive."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write your full analysis here. Markdown is supported."
          className="min-h-[500px] font-mono"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="is_premium" name="is_premium" />
        <Label htmlFor="is_premium">Premium Content (Subscribers Only)</Label>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}


import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PostForm } from "@/app/admin/_components/PostForm";
import { updatePost } from "@/lib/actions/admin-actions";
import { Post } from "@/lib/types";

export default async function EditPostPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, author:profiles(*), tags:tags(*)")
    .eq("slug", params.slug)
    .single();

  if (!post) {
    notFound();
  }

  async function updatePostAction(data: FormData) {
    'use server';

    const postData = {
      id: post.id,
      title: data.get('title') as string,
      content: data.get('content') as string,
      summary: data.get('summary') as string,
      is_premium: data.get('is_premium') === 'on',
      status: data.get('status') as 'draft' | 'published',
      tags: data.get('tags') as string,
      broadcast_email: data.get('broadcast_email') === 'on',
    };

    return updatePost(postData);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">编辑文章</h1>
      <PostForm
        action={updatePostAction}
        initialData={post as unknown as Post}
      />
    </div>
  );
}

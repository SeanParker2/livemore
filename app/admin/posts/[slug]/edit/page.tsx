
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

  const updatePostWithId = updatePost.bind(null, post.id, {} as any);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">编辑文章</h1>
      <PostForm
        action={updatePostWithId}
        initialData={post as unknown as Post}
      />
    </div>
  );
}

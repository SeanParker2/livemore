
import { PostForm } from "@/app/admin/_components/PostForm";
import { createPost } from "@/lib/actions/admin-actions";

export default function CreatePostPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">撰写新文章</h1>
      <PostForm action={createPost} />
    </div>
  );
}

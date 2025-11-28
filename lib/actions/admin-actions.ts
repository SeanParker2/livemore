'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { Resend } from "resend";
import { NewPostEmail } from "@/components/emails/NewPostEmail";
import { requireAdmin } from "@/lib/auth-helpers";
import { postSchema } from "@/lib/validations/schemas";

async function broadcastNewPostEmail({
  title,
  summary,
  slug,
  is_premium,
}: {
  title: string;
  summary: string;
  slug: string;
  is_premium: boolean;
}) {
  try {
    const supabase = await createClient();
    const { data: subscribers, error: subsError } = await supabase
      .from("subscriptions")
      .select("email")
      .eq("status", "active");

    if (subsError) throw subsError;
    if (!subscribers || subscribers.length === 0) {
      console.log("No active subscribers to broadcast to.");
      return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const postUrl = `${baseUrl}/posts/${slug}`;

    const batch = subscribers.map((subscriber: { email: string }) => ({
      from: "Livemore <noreply@livemore.io>",
      to: [subscriber.email],
      subject: `新研报发布: ${title}`,
      react: NewPostEmail({
        postTitle: title,
        postExcerpt: summary,
        postUrl: postUrl,
        isPremium: is_premium,
      }),
    }));

    const { data, error } = await resend.batch.send(batch);

    if (error) {
      console.error("Failed to send broadcast emails:", error);
    } else {
      console.log("Broadcast emails sent successfully:", data);
    }
  } catch (error: any) {
    console.error("Error in broadcastNewPostEmail:", error.message);
  }
}

export async function createPost(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();
    const auth = await requireAdmin(supabase);
    if (!auth.success) {
      return { success: false, message: auth.message };
    }
    const user = auth.user;

    const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      summary: formData.get('summary'),
      is_premium: formData.get('is_premium') === 'on',
      status: formData.get('status'),
    };

    const validation = postSchema.safeParse(rawData);
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0].message };
    }
    const { title, content, summary, is_premium, status } = validation.data;

    let slug = slugify(title, { lower: true, strict: true });

    const { data: existingPost } = await supabase.from('posts').select('slug').eq('slug', slug).single();
    if (existingPost) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const { data: post, error } = await supabase.from('posts').insert({
      title,
      slug,
      content,
      summary,
      is_premium,
      status,
      author_id: user.id,
    }).select('id').single();

    if (error || !post) throw error || new Error("Failed to create post.");

    const tagIds = (formData.get('tags') as string).split(',').filter(Boolean).map(Number);
    if (tagIds.length > 0) {
      const postTags = tagIds.map(tag_id => ({ post_id: post.id, tag_id }));
      const { error: tagsError } = await supabase.from('post_tags').insert(postTags);
      if (tagsError) throw tagsError;
    }

    const broadcast = formData.get('broadcast_email') === 'on';
    if (broadcast && status === 'published') {
      broadcastNewPostEmail({
        title,
        summary: summary || '',
        slug,
        is_premium,
      });
    }

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: true, message: "文章已成功发布！" };

  } catch (error: any) {
    return { success: false, message: error.message || "创建文章时发生错误。" };
  }
}

export async function updatePost(id: number, prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();
    const auth = await requireAdmin(supabase);
    if (!auth.success) {
      return { success: false, message: auth.message };
    }

    const rawData = {
      title: formData.get('title'),
      content: formData.get('content'),
      summary: formData.get('summary'),
      is_premium: formData.get('is_premium') === 'on',
      status: formData.get('status'),
    };

    const validation = postSchema.safeParse(rawData);
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0].message };
    }
    const { title, content, summary, is_premium, status } = validation.data;

    const { error } = await supabase.from('posts').update({
      title,
      content,
      summary,
      is_premium,
      status
    }).eq('id', id);

    if (error) throw error;

    // Handle tags
    const { error: deleteTagsError } = await supabase.from('post_tags').delete().eq('post_id', id);
    if (deleteTagsError) throw deleteTagsError;

    const tagIds = (formData.get('tags') as string).split(',').filter(Boolean).map(Number);
    if (tagIds.length > 0) {
      const postTags = tagIds.map(tag_id => ({ post_id: id, tag_id }));
      const { error: tagsError } = await supabase.from('post_tags').insert(postTags);
      if (tagsError) throw tagsError;
    }

    const broadcast = formData.get('broadcast_email') === 'on';
    if (broadcast && status === 'published') {
      const { data: post } = await supabase.from('posts').select('slug').eq('id', id).single();
      if (post) {
        broadcastNewPostEmail({
          title,
          summary: summary || '',
          slug: post.slug,
          is_premium,
        });
      }
    }

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    revalidatePath(`/posts/[slug]`, 'page');
    return { success: true, message: "文章已成功更新！" };

  } catch (error: any) {
    return { success: false, message: error.message || "更新文章时发生错误。" };
  }
}

export async function deletePost(id: number) {
  try {
    const supabase = await createClient();
    const auth = await requireAdmin(supabase);
    if (!auth.success) {
      return { success: false, message: auth.message };
    }

    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) throw error;

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: true, message: "文章已成功删除。" };

  } catch (error: any) {
    return { success: false, message: error.message || "删除文章时发生错误。" };
  }
}

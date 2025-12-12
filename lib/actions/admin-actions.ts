'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { Resend } from "resend";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { NewPostEmail } from "@/components/emails/NewPostEmail";
import { postSchema } from "@/lib/validations/schemas";

// === 内部工具：验证 Cookie ===
async function verifyAdminSession() {
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("admin_session")?.value;
  const validKey = process.env.ADMIN_ACCESS_KEY;
  return sessionKey && sessionKey === validKey;
}

// === 内部工具：获取作者 ID (自动挂靠到 Founder 账号) ===
async function getFounderAuthorId() {
  const supabase = createAdminClient();
  // 查找第一个 founder 用户
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('billing_status', 'founder')
    .limit(1)
    .single();

  return data?.id || null;
}

// === 邮件广播 ===
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
    const supabase = createAdminClient();
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
      from: "AXIOM <noreply@axiom.com>",
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
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Error in broadcastNewPostEmail:", error.message);
    } else {
        console.error("An unknown error occurred in broadcastNewPostEmail");
    }
  }
}

import { ActionResponse } from "@/lib/types";

// ... (previous imports)

// ... (helper functions verifyAdminSession, getFounderAuthorId, broadcastNewPostEmail remain unchanged)

// === Action: 创建文章 ===
export async function createPost(prevState: unknown, formData: FormData): Promise<ActionResponse> {
    // 1. 鉴权
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) return { success: false, message: "拒绝访问：无效的后台凭证" };

    // 2. 验证数据
    const rawData = {
        title: formData.get('title')?.toString() || '',
        content: formData.get('content')?.toString(),
        summary: formData.get('summary')?.toString(),
        is_premium: formData.get('is_premium') === 'true',
        status: formData.get('status')?.toString(),
        tags: formData.get('tags')?.toString(),
        broadcast_email: formData.get('broadcast_email') === 'true',
    };

    const parsed = postSchema.extend({
        tags: z.string().optional(),
        broadcast_email: z.boolean().optional(),
    }).safeParse(rawData);

    if (!parsed.success) return { success: false, message: "输入数据无效", errors: parsed.error.flatten().fieldErrors };

    // 3. 获取作者ID
    const authorId = await getFounderAuthorId();
    if (!authorId) return { success: false, message: "系统错误：未找到任何 Founder 账号用于归属文章，请先在数据库创建用户。" };

    // 4. 写入数据库
    const supabase = createAdminClient();
    let slug = slugify(rawData.title, { lower: true, strict: true });

    // 处理 Slug 冲突
    const { data: existing } = await supabase.from('posts').select('slug').eq('slug', slug).single();
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const { data: post, error } = await supabase.from('posts').insert({
      title: rawData.title,
      slug,
      content: rawData.content,
      summary: rawData.summary,
      is_premium: rawData.is_premium,
      status: rawData.status,
      author_id: authorId
    }).select('id, slug').single();

    if (error || !post) return { success: false, message: error?.message || "Failed to create post." };

    // 5. 处理标签
    if (rawData.tags) {
      const tagIds = rawData.tags.split(',').filter(Boolean).map(Number);
      if (tagIds.length > 0) {
        const postTags = tagIds.map((tag_id: number) => ({ post_id: post.id, tag_id }));
        await supabase.from('post_tags').insert(postTags);
      }
    }

    if (rawData.broadcast_email && rawData.status === 'published') {
      await broadcastNewPostEmail({
        title: rawData.title,
        summary: rawData.summary || '',
        slug,
        is_premium: rawData.is_premium,
      });
    }

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: true, message: "文章已成功发布！" };
}

// === Action: 更新文章 ===
export async function updatePost(prevState: unknown, formData: FormData): Promise<ActionResponse> {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) return { success: false, message: "拒绝访问" };

    const id = Number(formData.get('id'));
    const rawData = {
        title: formData.get('title')?.toString() || '',
        content: formData.get('content')?.toString(),
        summary: formData.get('summary')?.toString(),
        is_premium: formData.get('is_premium') === 'true',
        status: formData.get('status')?.toString(),
        tags: formData.get('tags')?.toString(),
        broadcast_email: formData.get('broadcast_email') === 'true',
    };

    const supabase = createAdminClient();
    const { error } = await supabase.from('posts').update({
      title: rawData.title,
      content: rawData.content,
      summary: rawData.summary,
      is_premium: rawData.is_premium,
      status: rawData.status
    }).eq('id', id);

    if (error) return { success: false, message: error.message };

    // 更新标签 (先删后加)
    await supabase.from('post_tags').delete().eq('post_id', id);
    if (rawData.tags) {
        const tagIds = rawData.tags.split(',').filter(Boolean).map(Number);
        if (tagIds.length > 0) {
          const postTags = tagIds.map((tag_id: number) => ({ post_id: id, tag_id }));
          await supabase.from('post_tags').insert(postTags);
        }
    }

    if (rawData.broadcast_email && rawData.status === 'published') {
        const { data: post } = await supabase.from('posts').select('slug').eq('id', id).single();
        if (post) {
            await broadcastNewPostEmail({
                title: rawData.title,
                summary: rawData.summary || '',
                slug: post.slug,
                is_premium: rawData.is_premium,
            });
        }
    }

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    revalidatePath(`/posts/[slug]`, 'page');
    return { success: true, message: "文章已成功更新！" };
}

// === Action: 删除文章 ===
export async function deletePost(prevState: unknown, formData: FormData): Promise<ActionResponse> {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) return { success: false, message: "拒绝访问" };

    const id = Number(formData.get('id'));
    
    const supabase = createAdminClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: true, message: "文章已成功删除。" };
}

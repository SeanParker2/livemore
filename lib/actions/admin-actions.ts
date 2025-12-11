'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { Resend } from "resend";
import { NewPostEmail } from "@/components/emails/NewPostEmail";
import { postSchema } from "@/lib/validations/schemas";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// 1. 新的权限验证函数：直接检查当前登录用户是否为 founder
async function verifyFounderAccess() {
  const supabase = await createClient();
  
  // 获取当前用户
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return null;
  }

  // 检查 profiles 表中的 billing_status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('billing_status')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.billing_status !== 'founder') {
    return null;
  }

  return user; // 返回用户信息以便后续使用（如设置作者ID）
}

// 邮件广播功能保持不变
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
    // 确保有默认值，防止构建失败
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
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Error in broadcastNewPostEmail:", error.message);
    } else {
        console.error("An unknown error occurred in broadcastNewPostEmail");
    }
  }
}

export async function createPost(prevState: unknown, formData: FormData) {
    // 1. 验证权限
    const currentUser = await verifyFounderAccess();
    if (!currentUser) {
        return { failure: "未授权的操作：您不是 Founder 管理员" };
    }

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const summary = formData.get('summary') as string;
    // 表单处理修正：确保获取正确的布尔值
    const is_premium = formData.get('is_premium') === 'true'; 
    const status = formData.get('status') as "draft" | "published" | "archived";
    const tags = formData.get('tags') as string;
    const broadcast_email = formData.get('broadcast_email') === 'true';

    const parsed = postSchema.extend({
        tags: z.string().optional(),
        broadcast_email: z.boolean().optional(),
    }).safeParse({ title, content, summary, is_premium, status, tags, broadcast_email });

    if (!parsed.success) {
        return { failure: "输入无效: " + JSON.stringify(parsed.error.flatten()) };
    }

    // 2. 使用 Admin Client 进行数据库写入（绕过复杂的 RLS，确保写入成功）
    const supabaseAdmin = createAdminClient();

    let slug = slugify(title, { lower: true, strict: true });

    // 检查 slug 是否重复
    const { data: existingPost } = await supabaseAdmin.from('posts').select('slug').eq('slug', slug).single();
    if (existingPost) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // 3. 插入文章 (使用当前登录用户的 ID 作为 author_id)
    const { data: post, error } = await supabaseAdmin.from('posts').insert({
      title,
      slug,
      content,
      summary,
      is_premium,
      status,
      author_id: currentUser.id, // 核心修正：绑定到当前操作者
    }).select('id').single();

    if (error || !post) {
      console.error("Create post error:", error);
      return { failure: error?.message || "发布文章失败" };
    }

    // 4. 处理标签
    if (tags) {
      const tagIds = tags.split(',').filter(Boolean).map(Number);
      if (tagIds.length > 0) {
        const postTags = tagIds.map((tag_id: number) => ({ post_id: post.id, tag_id }));
        const { error: tagsError } = await supabaseAdmin.from('post_tags').insert(postTags);
        if (tagsError) console.error("Tags error:", tagsError); // 标签失败不应阻断流程，仅记录
      }
    }

    // 5. 广播邮件
    if (broadcast_email && status === 'published') {
      await broadcastNewPostEmail({
        title,
        summary: summary || '',
        slug,
        is_premium,
      });
    }

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: "文章已成功发布！" };
}

export async function updatePost(prevState: unknown, formData: FormData) {
    // 1. 验证权限
    const currentUser = await verifyFounderAccess();
    if (!currentUser) {
        return { failure: "未授权的操作：您不是 Founder 管理员" };
    }

    const id = Number(formData.get('id'));
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const summary = formData.get('summary') as string;
    const is_premium = formData.get('is_premium') === 'true';
    const status = formData.get('status') as "draft" | "published" | "archived";
    const tags = formData.get('tags') as string;
    const broadcast_email = formData.get('broadcast_email') === 'true';

    const parsed = postSchema.extend({
        id: z.number(),
        tags: z.string().optional(),
        broadcast_email: z.boolean().optional(),
    }).safeParse({ id, title, content, summary, is_premium, status, tags, broadcast_email });

    if (!parsed.success) {
        return { failure: "输入无效" };
    }

    const supabaseAdmin = createAdminClient();

    // 2. 更新文章
    const { error } = await supabaseAdmin.from('posts').update({
      title,
      content,
      summary,
      is_premium,
      status
    }).eq('id', id);

    if (error) return { failure: error.message };

    // 3. 处理标签 (先删后加)
    const { error: deleteTagsError } = await supabaseAdmin.from('post_tags').delete().eq('post_id', id);
    if (deleteTagsError) console.error("Delete tags error:", deleteTagsError);

    if (tags) {
        const tagIds = tags.split(',').filter(Boolean).map(Number);
        if (tagIds.length > 0) {
          const postTags = tagIds.map((tag_id: number) => ({ post_id: id, tag_id }));
          const { error: tagsError } = await supabaseAdmin.from('post_tags').insert(postTags);
          if (tagsError) console.error("Insert tags error:", tagsError);
        }
    }

    // 4. 广播邮件 (仅当从未发布变为已发布，或者强制勾选了广播时触发逻辑比较复杂，这里简化为勾选即发送)
    if (broadcast_email && status === 'published') {
      const { data: post } = await supabaseAdmin.from('posts').select('slug').eq('id', id).single();
      if (post) {
        await broadcastNewPostEmail({
          title,
          summary: summary || '',
          slug: post.slug,
          is_premium,
        });
      }
    }

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    revalidatePath(`/posts/[slug]`, 'page'); // 假设 slug 没变，或者需要重新获取 slug 来 revalidate
    return { success: "文章已成功更新！" };
}

export async function deletePost(prevState: unknown, formData: FormData) {
    const currentUser = await verifyFounderAccess();
    if (!currentUser) {
        return { failure: "未授权的操作" };
    }

    const id = Number(formData.get('id'));
    const supabaseAdmin = createAdminClient();

    const { error } = await supabaseAdmin.from('posts').delete().eq('id', id);

    if (error) return { failure: error.message };

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: "文章已成功删除。" };
}
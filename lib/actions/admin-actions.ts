'use server';

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { Resend } from "resend";
import { NewPostEmail } from "@/components/emails/NewPostEmail";
import { adminAction } from "@/lib/safe-action";
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
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Error in broadcastNewPostEmail:", error.message);
    } else {
        console.error("An unknown error occurred in broadcastNewPostEmail");
    }
  }
}

export const createPost = adminAction
  .schema(postSchema.extend({
    tags: z.string().optional(),
    broadcast_email: z.boolean().optional(),
  }))
  .action(async ({ parsedInput, ctx: { user } }) => {
    const supabase = await createClient();
    const { title, content, summary, is_premium, status, tags } = parsedInput;

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

    if (tags) {
      const tagIds = tags.split(',').filter(Boolean).map(Number);
      if (tagIds.length > 0) {
        const postTags = tagIds.map((tag_id: number) => ({ post_id: post.id, tag_id }));
        const { error: tagsError } = await supabase.from('post_tags').insert(postTags);
        if (tagsError) throw tagsError;
      }
    }

    if (parsedInput.broadcast_email && status === 'published') {
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
  });

export const updatePost = adminAction
  .schema(postSchema.extend({
    id: z.number(),
    tags: z.string().optional(),
    broadcast_email: z.boolean().optional(),
  }))
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const { id, title, content, summary, is_premium, status, tags } = parsedInput;

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

    if (tags) {
        const tagIds = tags.split(',').filter(Boolean).map(Number);
        if (tagIds.length > 0) {
          const postTags = tagIds.map((tag_id: number) => ({ post_id: id, tag_id }));
          const { error: tagsError } = await supabase.from('post_tags').insert(postTags);
          if (tagsError) throw tagsError;
        }
    }


    if (parsedInput.broadcast_email && status === 'published') {
      const { data: post } = await supabase.from('posts').select('slug').eq('id', id).single();
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
    revalidatePath(`/posts/[slug]`, 'page');
    return { success: "文章已成功更新！" };
  });

export const deletePost = adminAction
    .schema(z.object({ id: z.number() }))
    .action(async ({ parsedInput: { id } }) => {
        const supabase = await createClient();
        const { error } = await supabase.from('posts').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/admin');
        revalidatePath('/', 'layout');
        return { success: "文章已成功删除。" };
    });

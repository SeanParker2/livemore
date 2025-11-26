
'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";

async function checkUserRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("billing_status")
    .eq("id", user.id)
    .single();

  if (profile?.billing_status !== 'founder') {
    throw new Error("User is not a founder");
  }
  return user;
}

export async function createPost(prevState: any, formData: FormData) {
  try {
    const user = await checkUserRole();
    const supabase = await createClient();

    const title = formData.get('title') as string;
    let slug = slugify(title, { lower: true, strict: true });

    const { data: existingPost } = await supabase.from('posts').select('slug').eq('slug', slug).single();
    if (existingPost) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const rawFormData = {
      title,
      slug,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      is_premium: formData.get('is_premium') === 'on',
      author_id: user.id,
    };

    const { data: post, error } = await supabase.from('posts').insert(rawFormData).select('id').single();

    if (error || !post) throw error || new Error("Failed to create post.");

    const tagIds = (formData.get('tags') as string).split(',').filter(Boolean).map(Number);
    if (tagIds.length > 0) {
      const postTags = tagIds.map(tag_id => ({ post_id: post.id, tag_id }));
      const { error: tagsError } = await supabase.from('post_tags').insert(postTags);
      if (tagsError) throw tagsError;
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
    await checkUserRole();
    const supabase = await createClient();

    const rawFormData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      summary: formData.get('summary') as string,
      is_premium: formData.get('is_premium') === 'on',
    };

    const { error } = await supabase.from('posts').update(rawFormData).eq('id', id);

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
    await checkUserRole();
    const supabase = await createClient();

    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) throw error;

    revalidatePath('/admin');
    revalidatePath('/', 'layout');
    return { success: true, message: "文章已成功删除。" };

  } catch (error: any) {
    return { success: false, message: error.message || "删除文章时发生错误。" };
  }
}

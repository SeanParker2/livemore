'use server';

import { createClient } from "@/lib/supabase/server";
import { ActionResponse, Post } from "@/lib/types";

export async function incrementView(slug: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc('increment_post_view', { post_slug: slug });
    if (error) {
      console.error(`Failed to increment view count for slug: ${slug}`, error);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error calling incrementView RPC:", error.message);
      return { success: false, message: error.message };
    } else {
      console.error("An unknown error occurred in incrementView RPC:", error);
      return { success: false, message: "Unknown error" };
    }
  }
}

export async function getRelatedPosts(currentPostId: number, tagIds: number[]): Promise<ActionResponse<Post[]>> {
  if (!tagIds || tagIds.length === 0) {
    return { success: true, data: [] };
  }

  const supabase = await createClient();

  const { data: postTags, error: postTagsError } = await supabase
    .from('post_tags')
    .select('post_id')
    .in('tag_id', tagIds)
    .neq('post_id', currentPostId);

  if (postTagsError || !postTags) {
    console.error("Error fetching related post IDs:", postTagsError);
    return { success: false, message: "Error fetching related post IDs", data: [] };
  }

  const relatedPostIds = [...new Set(postTags.map(pt => pt.post_id))];

  if (relatedPostIds.length === 0) {
    return { success: true, data: [] };
  }

  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*, author:profiles(*), tags:tags(*)')
    .in('id', relatedPostIds)
    .eq('status', 'published')
    .limit(3);

  if (postsError) {
    console.error("Error fetching related posts:", postsError);
    return { success: false, message: "Error fetching related posts", data: [] };
  }

  return { success: true, data: posts as unknown as Post[] };
}

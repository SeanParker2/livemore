'use server';

import { createClient } from "@/lib/supabase/server";

export async function incrementView(slug: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc('increment_post_view', { post_slug: slug });
    if (error) {
      console.error(`Failed to increment view count for slug: ${slug}`, error);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error calling incrementView RPC:", error.message);
    } else {
      console.error("An unknown error occurred in incrementView RPC:", error);
    }
  }
}

export async function getRelatedPosts(currentPostId: string, tagIds: number[]) {
  if (!tagIds || tagIds.length === 0) {
    return [];
  }

  const supabase = await createClient();

  const { data: postTags, error: postTagsError } = await supabase
    .from('post_tags')
    .select('post_id')
    .in('tag_id', tagIds)
    .neq('post_id', currentPostId);

  if (postTagsError || !postTags) {
    console.error("Error fetching related post IDs:", postTagsError);
    return [];
  }

  const relatedPostIds = [...new Set(postTags.map(pt => pt.post_id))];

  if (relatedPostIds.length === 0) {
    return [];
  }

  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('title, slug, created_at, tags(name, slug)')
    .in('id', relatedPostIds)
    .eq('status', 'published')
    .limit(3);

  if (postsError) {
    console.error("Error fetching related posts:", postsError);
    return [];
  }

  return posts;
}

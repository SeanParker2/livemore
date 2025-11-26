"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export async function createPost(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 1. Authenticate and authorize user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Authentication failed. Please log in." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("billing_status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, message: "Could not find user profile." };
  }

  if (profile.billing_status !== 'founder') {
    return { success: false, message: "Unauthorized. You are not a founder." };
  }

  // 2. Process form data
  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  // The value from formData for a checkbox/switch is "on" or null.
  const is_premium = formData.get("is_premium") === "on";

  if (!title || !content) {
    return { success: false, message: "Title and content are required." };
  }

  if (!slug) {
    slug = generateSlug(title);
  }

  // 3. Insert data into the database
  const { error: insertError } = await supabase.from("posts").insert({
    title,
    slug,
    excerpt,
    content,
    is_premium,
    author_id: user.id,
    published_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    // Check for unique slug violation
    if (insertError.code === '23505') {
        return { success: false, message: "This slug is already in use. Please choose a different one." };
    }
    return { success: false, message: "Failed to create post. Please try again." };
  }

  // 4. Revalidate paths
  revalidatePath("/");
  revalidatePath("/archive");

  // 5. Return success
  return { success: true, message: "Post published successfully!" };
}

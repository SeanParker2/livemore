'use server';

import { createClient } from "@/lib/supabase/server";

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

export async function uploadImage(formData: FormData): Promise<{ publicUrl: string }> {
  try {
    await checkUserRole();
    const supabase = await createClient();
    const file = formData.get('image') as File;

    if (!file) {
      throw new Error("No image file provided.");
    }

    const path = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(path, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(path);

    if (!data || !data.publicUrl) {
      throw new Error("Failed to get public URL for the uploaded image.");
    }

    return { publicUrl: data.publicUrl };

  } catch (error: any) {
    console.error("Image upload failed:", error.message);
    throw new Error(error.message || "An unknown error occurred during image upload.");
  }
}

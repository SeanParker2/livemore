'use server';

import { createClient } from "@/lib/supabase/server";

export async function uploadImage(prevState: unknown, formData: FormData) {
  const image = formData.get('image') as File;

  if (!image || !(image instanceof File)) {
      return { failure: "No image file provided." };
  }

  const supabase = await createClient();
  const path = `${Date.now()}-${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(path, image);

  if (uploadError) {
    console.error("Image upload failed:", uploadError.message);
    return { failure: uploadError.message };
  }

  const { data } = supabase.storage.from('images').getPublicUrl(path);

  if (!data || !data.publicUrl) {
    return { failure: "Failed to get public URL for the uploaded image." };
  }

  return { success: data.publicUrl };
}

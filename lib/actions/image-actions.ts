'use server';

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/lib/types";

export async function uploadImage(prevState: unknown, formData: FormData): Promise<ActionResponse<string>> {
  const image = formData.get('image') as File;

  if (!image || !(image instanceof File)) {
      return { success: false, message: "No image file provided." };
  }

  const supabase = await createClient();
  const path = `${Date.now()}-${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(path, image);

  if (uploadError) {
    console.error("Image upload failed:", uploadError.message);
    return { success: false, message: uploadError.message };
  }

  const { data } = supabase.storage.from('images').getPublicUrl(path);

  if (!data || !data.publicUrl) {
    return { success: false, message: "Failed to get public URL for the uploaded image." };
  }

  return { success: true, data: data.publicUrl };
}

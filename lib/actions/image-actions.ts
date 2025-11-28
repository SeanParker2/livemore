'use server';

import { createClient } from "@/lib/supabase/server";
import { createSafeAction } from "@/lib/safe-action";
import { z } from "zod";

const imageSchema = z.object({
  image: z.any().refine(file => file instanceof File, "No image file provided."),
});

const uploadImageHandler = async ({ image }: { image: File }) => {
  const supabase = await createClient();
  const path = `${Date.now()}-${image.name}`;

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(path, image);

  if (uploadError) {
    console.error("Image upload failed:", uploadError.message);
    return { serverError: uploadError.message };
  }

  const { data } = supabase.storage.from('images').getPublicUrl(path);

  if (!data || !data.publicUrl) {
    return { serverError: "Failed to get public URL for the uploaded image." };
  }

  return { data: { publicUrl: data.publicUrl } };
};

export const uploadImage = createSafeAction(
  imageSchema,
  uploadImageHandler,
  { role: 'admin' }
);

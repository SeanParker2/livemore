'use server';

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { adminAction } from "@/lib/safe-action";

const imageSchema = z.object({
  image: z.any().refine((file): file is File => file instanceof File, "No image file provided."),
});

export const uploadImage = adminAction
  .schema(imageSchema)
  .action(async ({ parsedInput: { image } }) => {
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
  });

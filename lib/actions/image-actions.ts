"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadImage(formData: FormData) {
  const supabase = await createClient();
  const imageFile = formData.get("image") as File;

  if (!imageFile) {
    throw new Error("No image provided");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 验证文件类型和大小
  const fileExtension = imageFile.name.split(".").pop();
  const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
  if (!fileExtension || !allowedExtensions.includes(fileExtension.toLowerCase())) {
    throw new Error("Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.");
  }

  if (imageFile.size > 5 * 1024 * 1024) { // 5MB
    throw new Error("File size exceeds 5MB.");
  }

  const fileName = `${Date.now()}.${fileExtension}`;
  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, imageFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image.");
  }

  const { data: { publicUrl } } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  revalidatePath("/admin/posts/create");
  revalidatePath("/admin/posts/edit/[id]");

  return { publicUrl };
}

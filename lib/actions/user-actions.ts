
'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "User not authenticated" };
  }

  const fullName = formData.get('fullName') as string;

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true, message: '昵称已成功更新！' };
}

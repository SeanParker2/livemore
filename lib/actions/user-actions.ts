
'use server'

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const updateProfileSchema = z.object({
  fullName: z.string().min(1, "昵称不能为空"),
});

export async function updateProfile(prevState: unknown, formData: FormData) {
    const fullName = formData.get('fullName') as string;
    
    const parsed = updateProfileSchema.safeParse({ fullName });
    if (!parsed.success) {
        return { success: false, message: "昵称不能为空" };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
         return { success: false, message: "未登录" };
    }

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

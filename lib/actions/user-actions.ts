
'use server'

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { userAction } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

const updateProfileSchema = z.object({
  fullName: z.string().min(1, "昵称不能为空"),
});

export const updateProfile = userAction
  .schema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: parsedInput.fullName })
      .eq('id', ctx.user.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/dashboard');
    return { success: '昵称已成功更新！' };
  });

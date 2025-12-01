'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { publicAction } from '@/lib/safe-action';

export const magicLinkSchema = z.object({
  email: z.string().email({ message: '无效的邮箱地址' }),
});

export const signInWithMagicLink = publicAction
  .schema(magicLinkSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      // Throwing an error here will be caught by the safe action client
      // and passed to the `onError` callback on the client.
      throw new Error('用户认证失败，请稍后重试');
    }

    return { success: '请检查您的邮箱，点击链接以继续登录。' };
  });

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
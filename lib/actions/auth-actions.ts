'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const magicLinkSchema = z.object({
  email: z.string().email({ message: '无效的邮箱地址' }),
});

export async function signInWithMagicLink(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;

  const parsed = magicLinkSchema.safeParse({ email });
  
  if (!parsed.success) {
    return { error: '无效的邮箱地址' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    return { error: '用户认证失败，请稍后重试' };
  }

  return { success: '请检查您的邮箱，点击链接以继续登录。' };
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
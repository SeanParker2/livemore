"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
const emailSchema = z.string().email();

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const email = formData.get('email');

  const validation = emailSchema.safeParse(email);

  if (!validation.success) {
    return { success: false, message: '无效的邮箱地址。' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('subscribers').insert({ email: validation.data });

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      return { success: false, message: '您已订阅，请勿重复操作。' };
    }
    return { success: false, message: '发生错误，请稍后重试。' };
  }

  return { success: true, message: '订阅成功！感谢您的关注。' };
}
"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
import WelcomeEmail from '@/components/emails/WelcomeEmail';
const emailSchema = z.string().email();

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const email = formData.get('email');

  const validation = emailSchema.safeParse(email);

  if (!validation.success) {
    return { success: false, message: '无效的邮箱地址。' };
  }

  const supabase = await createClient();
  const { error: dbError } = await supabase.from('subscribers').insert({ email: validation.data });

  if (dbError) {
    if (dbError.code === '23505') { // Unique constraint violation
      return { success: false, message: '您已订阅，请勿重复操作。' };
    }
    console.error('Database error:', dbError);
    return { success: false, message: '发生错误，请稍后重试。' };
  }

  try {
    await resend.emails.send({
      from: 'Livemore <noreply@livemore.io>',
      to: validation.data,
      subject: '欢迎加入 Livemore：理性投资者的第一步',
      react: WelcomeEmail({ firstName: "" }),
    });
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Do not block the process, just log the error
  }

  return { success: true, message: '订阅成功！感谢您的关注。' };
}
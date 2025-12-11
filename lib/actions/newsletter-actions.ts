"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/components/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email({ message: "无效的邮箱地址。" }),
});

export async function subscribeToNewsletter(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;

  const parsed = subscribeSchema.safeParse({ email });
  
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { 
      error: firstError || '输入无效', 
      validationErrors: parsed.error.flatten().fieldErrors 
    };
  }

  const supabase = await createClient();
  const { error: dbError } = await supabase.from('subscribers').insert({ email });

  if (dbError) {
    if (dbError.code === '23505') { // Unique constraint violation
      return { error: '您已订阅，请勿重复操作。' };
    }
    console.error('Database error:', dbError);
    return { error: '发生错误，请稍后重试。' };
  }

  try {
    await resend.emails.send({
      from: 'Signal & Cipher <noreply@livemore.io>',
      to: email,
      subject: '欢迎加入 Signal & Cipher：理性投资者的第一步',
      react: WelcomeEmail({ firstName: "" }),
    });
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Do not block the process, just log the error
  }

  return { success: '订阅成功！感谢您的关注。' };
}

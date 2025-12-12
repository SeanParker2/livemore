"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/components/emails/WelcomeEmail';
import { ActionResponse } from '@/lib/types';

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email({ message: "无效的邮箱地址。" }),
});

export async function subscribeToNewsletter(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string;

  const parsed = subscribeSchema.safeParse({ email });
  
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { 
      success: false,
      message: firstError || '输入无效', 
      errors: parsed.error.flatten().fieldErrors 
    };
  }

  const supabase = await createClient();
  const { error: dbError } = await supabase.from('subscribers').insert({ email });

  if (dbError) {
    if (dbError.code === '23505') { // Unique constraint violation
      return { success: false, message: '您已订阅，请勿重复操作。' };
    }
    console.error('Database error:', dbError);
    return { success: false, message: '发生错误，请稍后重试。' };
  }

  try {
    await resend.emails.send({
      from: 'AXIOM <noreply@axiom.com>',
      to: email,
      subject: '欢迎加入 AXIOM：理性投资者的第一步',
      react: WelcomeEmail({ firstName: "" }),
    });
  } catch (emailError) {
    console.error('Failed to send welcome email:', emailError);
    // Do not block the process, just log the error
  }

  return { success: true, message: '订阅成功！感谢您的关注。' };
}

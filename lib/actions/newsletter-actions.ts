"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/components/emails/WelcomeEmail';
import { publicAction } from '@/lib/safe-action';

const resend = new Resend(process.env.RESEND_API_KEY);

export const subscribeSchema = z.object({
  email: z.string().email({ message: "无效的邮箱地址。" }),
});

export const subscribeToNewsletter = publicAction
  .schema(subscribeSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();
    const { error: dbError } = await supabase.from('subscribers').insert({ email });

    if (dbError) {
      if (dbError.code === '23505') { // Unique constraint violation
        throw new Error('您已订阅，请勿重复操作。');
      }
      console.error('Database error:', dbError);
      throw new Error('发生错误，请稍后重试。');
    }

    try {
      await resend.emails.send({
        from: 'Livemore <noreply@livemore.io>',
        to: email,
        subject: '欢迎加入 Livemore：理性投资者的第一步',
        react: WelcomeEmail({ firstName: "" }),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Do not block the process, just log the error
    }

    return { success: '订阅成功！感谢您的关注。' };
  });

"use server";

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';
import WelcomeEmail from '@/components/emails/WelcomeEmail';

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
      return { success: false, message: 'You are already subscribed.' };
    }
    return { success: false, message: 'An error occurred. Please try again.' };
  }

  try {
    await resend.emails.send({
      from: 'Livemore <noreply@yourdomain.com>', // Replace with your domain
      to: validation.data,
      subject: 'Welcome to Livemore',
      react: WelcomeEmail({ name: validation.data }),
    });
  } catch (emailError) {
    // Log the error, but don't block the user from seeing a success message
    console.error('Resend error:', emailError);
  }

  return { success: true, message: '订阅成功！请检查您的邮箱以确认订阅。' };
}
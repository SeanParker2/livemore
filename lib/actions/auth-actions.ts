'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/safe-action'

const magicLinkSchema = z.object({
  email: z.string().email({ message: '无效的邮箱地址' }),
})

// 推断并导出 signInWithMagicLink 的类型
export type InputTypeMagicLink = z.infer<typeof magicLinkSchema>;
export const returnSchemaMagicLink = z.object({
  message: z.string(),
});

const magicLinkHandler = async ({ email }: { email: string }) => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error(error)
    return { serverError: '用户认证失败，请稍后重试' }
  }

  return { data: { message: '请检查您的邮箱，点击链接以继续登录。' } }
}

export const signInWithMagicLink = createSafeAction(
  magicLinkSchema,
  magicLinkHandler
)

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
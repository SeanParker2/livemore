'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redeemCodeSchema, generateCodesSchema } from "@/lib/validations/schemas";
import { createSafeAction } from "@/lib/safe-action";
import { User } from "@supabase/supabase-js";
import { z } from "zod";

// 推断并导出 generateCodes 的类型
export type InputTypeGenerate = z.infer<typeof generateCodesSchema>;
export type ReturnTypeGenerate = {
  message: string;
};

export const returnSchemaGenerate = z.object({
  message: z.string(),
});

// 推断并导出 redeemCode 的类型
export type InputTypeRedeem = z.infer<typeof redeemCodeSchema>;
export const returnSchemaRedeem = z.object({
  message: z.string(),
});


const redeemCodeHandler = async (input: { code: string }, user?: User) => {
  if (!user) {
    return { serverError: "用户未登录" };
  }

  const supabase = await createClient();

  // 3. 查找兑换码
  const { data: redemptionCode, error } = await supabase
    .from("redemption_codes")
    .select("*")
    .eq("code", input.code)
    .single();

  if (error || !redemptionCode) {
    return { serverError: "无效的兑换码" };
  }

  if (redemptionCode.is_used) {
    return { serverError: "此兑换码已被使用" };
  }

  // 4. 更新用户会员状态
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ billing_status: "premium" })
    .eq("id", user.id);

  if (profileError) {
    return { serverError: "会员状态更新失败，请联系管理员" };
  }

  // 5. 将兑换码标记为已使用
  const { error: updateCodeError } = await supabase
    .from("redemption_codes")
    .update({ is_used: true, used_by: user.id, used_at: new Date().toISOString() })
    .eq("id", redemptionCode.id);

  if (updateCodeError) {
    // 此处应有回滚逻辑，但为简化暂不处理
    return { serverError: "兑换码状态更新失败，请联系管理员" };
  }

  revalidatePath("/profile"); // 更新用户个人资料页面
  return { data: { message: `会员权益已激活！感谢您的支持。` } };
};

export const redeemCode = createSafeAction(
  redeemCodeSchema,
  redeemCodeHandler,
  { role: 'user' }
);

const generateCodesHandler = async (input: { count: number; duration_days: number }) => {
  const supabase = await createClient();

  // 3. 生成兑换码
  const codes = Array.from({ length: input.count }, () => ({
    code: `GIFT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    duration_days: input.duration_days,
  }));

  const { error } = await supabase.from("redemption_codes").insert(codes);

  if (error) {
    return { serverError: `生成兑换码失败: ${error.message}` };
  }

  revalidatePath("/admin/gifts");
  return { data: { message: `成功生成 ${input.count} 个兑换码` } };
};

export const generateCodes = createSafeAction(
  generateCodesSchema,
  generateCodesHandler,
  { role: 'admin' }
);

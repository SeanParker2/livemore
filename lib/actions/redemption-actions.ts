'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redeemCodeSchema, generateCodesSchema } from "@/lib/validations/schemas";

// Re-export the schemas
// export { redeemCodeSchema, generateCodesSchema };

export async function redeemCode(prevState: unknown, formData: FormData) {
  const code = formData.get('code') as string;

  const parsed = redeemCodeSchema.safeParse({ code });
  if (!parsed.success) {
      return { failure: "无效的兑换码格式" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
      return { failure: "请先登录" };
  }

  // 3. 查找兑换码
  const { data: redemptionCode, error } = await supabase
    .from("redemption_codes")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !redemptionCode) {
    return { failure: "无效的兑换码" };
  }

  if (redemptionCode.is_used) {
    return { failure: "此兑换码已被使用" };
  }

  // 4. 更新用户会员状态
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ billing_status: "premium" })
    .eq("id", user.id);

  if (profileError) {
    return { failure: "会员状态更新失败，请联系管理员" };
  }

  // 5. 将兑换码标记为已使用
  const { error: updateCodeError } = await supabase
    .from("redemption_codes")
    .update({ is_used: true, used_by: user.id, used_at: new Date().toISOString() })
    .eq("id", redemptionCode.id);

  if (updateCodeError) {
    // 此处应有回滚逻辑，但为简化暂不处理
    return { failure: "兑换码状态更新失败，请联系管理员" };
  }

  revalidatePath("/profile"); // 更新用户个人资料页面
  return { success: `会员权益已激活！感谢您的支持。` };
}

export async function generateCodes(prevState: unknown, formData: FormData) {
    const count = Number(formData.get('count'));
    const duration_days = Number(formData.get('duration_days'));

    const parsed = generateCodesSchema.safeParse({ count, duration_days });
    if (!parsed.success) {
        return { failure: "输入无效" };
    }

    const supabase = await createClient();
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push({
        code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        duration_days,
      });
    }

    const { error } = await supabase.from("redemption_codes").insert(codes);

    if (error) {
      return { failure: error.message };
    }

    return { success: `成功生成 ${count} 个兑换码` };
}

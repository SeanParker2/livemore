'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function redeemCode(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "请先登录再进行兑换" };
  }

  const code = formData.get("code") as string;

  if (!code) {
    return { success: false, message: "请输入兑换码" };
  }

  // 查找兑换码
  const { data: redemptionCode, error } = await supabase
    .from("redemption_codes")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !redemptionCode) {
    return { success: false, message: "无效的兑换码" };
  }

  if (redemptionCode.is_used) {
    return { success: false, message: "此兑换码已被使用" };
  }

  // 更新用户会员状态
  // 此处简化处理，直接设置为 premium。更复杂的逻辑可以基于 duration_days 计算到期时间
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ billing_status: "premium" })
    .eq("id", user.id);

  if (profileError) {
    return { success: false, message: "会员状态更新失败，请联系管理员" };
  }

  // 将兑换码标记为已使用
  const { error: updateCodeError } = await supabase
    .from("redemption_codes")
    .update({ is_used: true, used_by: user.id, used_at: new Date().toISOString() })
    .eq("id", redemptionCode.id);

  if (updateCodeError) {
    // 此处应有回滚逻辑，但为简化暂不处理
    return { success: false, message: "兑换码状态更新失败，请联系管理员" };
  }

  revalidatePath("/profile"); // 更新用户个人资料页面
  return { success: true, message: `会员权益已激活！感谢您的支持。` };
}

export async function generateCodes(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "未登录用户" };
  }

  // 检查是否为管理员
  const { data: profile } = await supabase
    .from("profiles")
    .select("billing_status")
    .eq("id", user.id)
    .single();

  if (profile?.billing_status !== 'founder') {
    return { success: false, message: "无权操作" };
  }

  const count = Number(formData.get("count"));
  const duration_days = Number(formData.get("duration_days"));

  if (isNaN(count) || isNaN(duration_days) || count <= 0 || duration_days <= 0) {
    return { success: false, message: "请输入有效的数量和天数" };
  }

  const codes = Array.from({ length: count }, () => ({
    code: `GIFT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    duration_days,
  }));

  const { error } = await supabase.from("redemption_codes").insert(codes);

  if (error) {
    return { success: false, message: `生成兑换码失败: ${error.message}` };
  }

  revalidatePath("/admin/gifts");
  return { success: true, message: `成功生成 ${count} 个兑换码` };
}


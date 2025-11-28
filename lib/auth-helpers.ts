import { SupabaseClient } from '@supabase/supabase-js';

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return profile;
}

export type AuthResult = 
  | { success: true; user: any; profile: any }
  | { success: false; message: string };

export async function requireAdmin(supabase: SupabaseClient): Promise<AuthResult> {
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "未登录用户" };
  }
  
  const profile = await getProfile(supabase, user.id);
  if (profile?.billing_status !== 'founder') {
    return { success: false, message: "无权操作" };
  }
  
  return { success: true, user, profile };
}

export async function requireUser(supabase: SupabaseClient): Promise<AuthResult> {
  const user = await getCurrentUser(supabase);
  if (!user) {
    return { success: false, message: "请先登录" };
  }

  const profile = await getProfile(supabase, user.id);
  
  return { success: true, user, profile };
}

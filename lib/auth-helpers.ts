import { SupabaseClient, User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  billing_status: string;
  // Add other profile properties here
};

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return profile;
}

export type AuthResult = 
  | { success: true; user: User; profile: Profile | null }
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

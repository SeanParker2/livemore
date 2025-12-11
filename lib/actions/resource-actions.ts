'use server';

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createResourceSchema } from "@/lib/validations/schemas";

export async function createResource(prevState: unknown, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const is_premium = formData.get('is_premium') === 'true';
  const file_path = formData.get('file_path') as string;
  const cover_image = formData.get('cover_image') as string;

  const parsed = createResourceSchema.safeParse({ title, description, is_premium, file_path, cover_image });
  if (!parsed.success) {
      return { failure: "输入无效" };
  }

  const supabase = await createClient();
  const { error: dbError } = await supabase.from('resources').insert({
    title,
    description,
    is_premium,
    file_path,
    cover_image,
  });

  if (dbError) {
    console.error("数据库插入失败:", dbError);
    return { failure: `数据库插入失败: ${dbError.message}` };
  }

  revalidatePath('/admin/resources');
  revalidatePath('/resources');
  return { success: "资源创建成功！" };
}

export async function downloadResource(resourceId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 重新获取 profile 以检查 billing_status
    let profile = null;
    if (user) {
        const { data } = await supabase.from('profiles').select('billing_status').eq('id', user.id).single();
        profile = data;
    }

    const { data: resourceData } = await supabase
      .from('resources')
      .select('*')
      .eq('id', resourceId)
      .single();

    if (!resourceData) {
      return { failure: "资源不存在" };
    }

    const isVip = profile?.billing_status === 'premium' || profile?.billing_status === 'founder';
    const canDownload = !resourceData.is_premium || isVip;

    if (!canDownload) {
      return { failure: "订阅会员专享资源" };
    }

    const { data, error } = await supabase.storage
      .from('resources')
      .createSignedUrl(resourceData.file_path, 60);

    if (error) {
      console.error("生成下载链接失败:", error);
      return { failure: "无法获取下载链接" };
    }

    await supabase.rpc('increment_resource_download', { p_resource_id: resourceId });

    return { success: data.signedUrl };
}

export async function deleteResource(prevState: unknown, formData: FormData) {
    const id = formData.get('id') as string;
    const supabase = await createClient();

    // 1. 获取资源信息以获取文件路径
    const { data: resource, error: fetchError } = await supabase
      .from('resources')
      .select('file_path')
      .eq('id', id)
      .single();

    if (fetchError || !resource) {
      return { failure: "资源不存在或已被删除" };
    }

    // 2. 从存储桶删除文件
    if (resource.file_path) {
      const { error: storageError } = await supabase.storage
        .from('resources')
        .remove([resource.file_path]);
      
      if (storageError) {
        console.error("Failed to delete file from storage:", storageError);
        // 继续执行，即使文件删除失败也要删除数据库记录
      }
    }

    // 3. 删除数据库记录
    const { error: dbError } = await supabase.from('resources').delete().eq('id', id);

    if (dbError) {
      return { failure: `删除失败: ${dbError.message}` };
    }

    revalidatePath('/admin/resources');
    revalidatePath('/resources');
    return { success: "资源已成功删除" };
}

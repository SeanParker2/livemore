'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth-helpers";
import { createResourceSchema } from "@/lib/validations/schemas";
import { createSafeAction } from "@/lib/safe-action";

const createResourceHandler = async (data: any) => {
  const supabase = await createClient();
  const { title, description, is_premium, file_path, cover_image } = data;

  const { error: dbError } = await supabase.from('resources').insert({
    title,
    description,
    is_premium,
    file_path,
    cover_image,
  });

  if (dbError) {
    console.error("数据库插入失败:", dbError);
    return { serverError: `数据库插入失败: ${dbError.message}` };
  }

  revalidatePath('/admin/resources');
  revalidatePath('/resources');
  return { data: { message: "资源创建成功！" } };
};

export const createResource = createSafeAction(
  createResourceSchema,
  createResourceHandler,
  { role: 'admin' }
);

const downloadResourceHandler = async (resourceId: string) => {
    const supabase = await createClient();
    const auth = await requireUser(supabase);
    if (!auth.success) {
        return { serverError: auth.message };
    }
    const { profile } = auth;

    const { data: resourceData } = await supabase
        .from('resources')
        .select('*')
        .eq('id', resourceId)
        .single();

    if (!resourceData) {
        return { serverError: "资源不存在" };
    }

    const isVip = profile?.billing_status === 'premium' || profile?.billing_status === 'founder';
    const canDownload = !resourceData.is_premium || isVip;

    if (!canDownload) {
        return { serverError: "订阅会员专享资源" };
    }

    const { data, error } = await supabase.storage
        .from('resources')
        .createSignedUrl(resourceData.file_path, 60);

    if (error) {
        console.error("生成下载链接失败:", error);
        return { serverError: "无法获取下载链接" };
    }

    await supabase.rpc('increment_resource_download', { p_resource_id: resourceId });

    return { data: { url: data.signedUrl } };
};

export const downloadResource = createSafeAction(
    z.string(),
    downloadResourceHandler,
    { role: 'user' }
);

import { z } from "zod";

const deleteResourceHandler = async (id: string) => {
  const supabase = await createClient();

  // 1. 获取资源信息以获取文件路径
  const { data: resource, error: fetchError } = await supabase
    .from('resources')
    .select('file_path')
    .eq('id', id)
    .single();

  if (fetchError || !resource) {
    return { serverError: "资源不存在或已被删除" };
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
    return { serverError: `删除失败: ${dbError.message}` };
  }

  revalidatePath('/admin/resources');
  revalidatePath('/resources');
  return { data: { message: "资源已成功删除" } };
};

export const deleteResource = createSafeAction(
  z.string(),
  deleteResourceHandler,
  { role: 'admin' }
);

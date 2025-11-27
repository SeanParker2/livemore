'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createResource(prevState: { success: boolean; message: string; } | null, formData: FormData) {
  const supabase = await createClient();

  // 1. 验证用户权限
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "未登录用户" };
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('billing_status')
    .eq('id', user.id)
    .single();

  if (profile?.billing_status !== 'founder') {
    return { success: false, message: "无权操作" };
  }

  // 2. 获取表单数据
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const is_premium = formData.get('is_premium') === 'on';
  const resourceFile = formData.get('file') as File;
  const coverImageFile = formData.get('cover_image') as File | null;

  if (!title || !resourceFile || resourceFile.size === 0) {
    return { success: false, message: "标题和资源文件不能为空" };
  }

  // 3. 上传资源文件
  const resourceFilePath = `public/${Date.now()}-${resourceFile.name}`;
  const { error: fileUploadError } = await supabase.storage
    .from('resources') // 确保你有一个名为 'resources' 的 bucket
    .upload(resourceFilePath, resourceFile);

  if (fileUploadError) {
    console.error("资源文件上传失败:", fileUploadError);
    return { success: false, message: `资源文件上传失败: ${fileUploadError.message}` };
  }

  // 4. (可选) 上传封面图片
  let coverImagePath: string | undefined = undefined;
  if (coverImageFile && coverImageFile.size > 0) {
    const imagePath = `public/${Date.now()}-${coverImageFile.name}`;
    const { error: imageUploadError } = await supabase.storage
      .from('images')
      .upload(imagePath, coverImageFile);

    if (imageUploadError) {
      console.warn("封面图片上传失败:", imageUploadError);
      // 不中断流程，封面是可选的
    } else {
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(imagePath);
      coverImagePath = publicUrl;
    }
  }

  // 5. 插入数据到 resources 表
  const { error: dbError } = await supabase.from('resources').insert({
    title,
    description,
    is_premium,
    file_path: resourceFilePath,
    cover_image: coverImagePath,
  });

  if (dbError) {
    console.error("数据库插入失败:", dbError);
    return { success: false, message: `数据库插入失败: ${dbError.message}` };
  }

  // 6. 成功后，清理缓存并重定向
  revalidatePath('/admin/resources');
  revalidatePath('/resources');
  redirect('/admin/resources'); // 假设你将有一个后台资源列表页
}

export async function downloadResource(resourceId: string) {
    const supabase = await createClient();

    // 1. 验证用户
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, message: "请先登录" };
    }

    // 2. 获取资源信息和用户会员状态
    const { data: resource } = await supabase
        .from('resources')
        .select('*, profile:profiles!inner(billing_status)')
        .eq('id', resourceId)
        .eq('profile.id', user.id)
        .single();
        
    const { data: resourceData } = await supabase
        .from('resources')
        .select('*')
        .eq('id', resourceId)
        .single();


    if (!resourceData) {
        return { success: false, message: "资源不存在" };
    }

    // 3. 检查下载权限
    const canDownload = !resourceData.is_premium || resource?.profile?.billing_status === 'premium' || resource?.profile?.billing_status === 'founder';

    if (!canDownload) {
        return { success: false, message: "订阅会员专享资源" };
    }

    // 4. 生成安全的临时下载链接
    const { data, error } = await supabase.storage
        .from('resources')
        .createSignedUrl(resourceData.file_path, 60); // 链接 60 秒内有效

    if (error) {
        console.error("生成下载链接失败:", error);
        return { success: false, message: "无法获取下载链接" };
    }

    // 5. 增加下载计数
    await supabase.rpc('increment_resource_download', { p_resource_id: resourceId });

    return { success: true, url: data.signedUrl };
}

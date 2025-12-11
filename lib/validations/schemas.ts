import { z } from "zod";

export const createResourceSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().optional(),
  is_premium: z.boolean().default(false),
  file_path: z.string().min(1, "资源文件路径不能为空"),
  cover_image: z.string().nullable().optional(),
});

export const generateCodesSchema = z.object({
  count: z.coerce.number().min(1, "数量必须大于0"),
  duration_days: z.coerce.number().min(1, "天数必须大于0"),
});

export const redeemCodeSchema = z.object({
  code: z.string().min(1, "兑换码不能为空"),
});

export const postSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().optional(),
  summary: z.string().optional(),
  slug: z.string().optional(),
  is_premium: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export const profileSchema = z.object({
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  billing_status: z.string().nullable().optional(),
});

export const redemptionCodeSchema = z.object({
  code: z.string(),
  duration_days: z.number(),
  is_used: z.boolean().default(false),
  used_by: z.string().nullable().optional(),
});

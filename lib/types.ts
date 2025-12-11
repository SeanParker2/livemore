import { z } from "zod";
import { createResourceSchema, postSchema, profileSchema, redemptionCodeSchema } from "@/lib/validations/schemas";

/**
 * Standard API Response structure for Server Actions.
 */
export type ActionResponse<T = void> = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
};

/**
 * Profile type inferred from profileSchema with database fields.
 * Source: lib/validations/schemas.ts
 */
export type Profile = z.infer<typeof profileSchema> & {
  id: string;
};

/**
 * RedemptionCode type inferred from redemptionCodeSchema with database fields.
 * Source: lib/validations/schemas.ts
 */
export type RedemptionCode = z.infer<typeof redemptionCodeSchema> & {
  id: string;
  created_at?: string;
};

/**
 * Post type inferred from postSchema with database fields.
 * Source: lib/validations/schemas.ts
 */
export type Post = z.infer<typeof postSchema> & {
  id: number;
  created_at: string;
  updated_at?: string;
  author: Profile;
  tags: { id: number; name: string; slug: string }[];
  slug: string;
};

/**
 * Resource type inferred from createResourceSchema with database fields.
 * Source: lib/validations/schemas.ts
 */
export type Resource = z.infer<typeof createResourceSchema> & {
  id: string;
  created_at: string;
  downloads_count: number;
  // Optional profile relation often joined in queries
  profile?: Profile | null;
};

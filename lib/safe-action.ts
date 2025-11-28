import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { requireUser, requireAdmin } from '@/lib/auth-helpers';
import { User } from '@supabase/supabase-js';

export type ActionState<TInput, TOutput> = {
  validationError?: Partial<Record<keyof TInput, string[]>>;
  serverError?: string;
  data?: TOutput;
};

type AuthRequirements = { role: 'user' | 'admin' };

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedInput: TInput, user?: User) => Promise<ActionState<TInput, TOutput>>,
  auth?: AuthRequirements
) => {
  return async (input: TInput): Promise<ActionState<TInput, TOutput>> => {
    const supabase = await createClient();
    let user: User | undefined = undefined;

    if (auth) {
      const authCheck = auth.role === 'admin' 
        ? await requireAdmin(supabase)
        : await requireUser(supabase);

      if (!authCheck.success) {
        return { serverError: authCheck.message };
      }
      user = authCheck.user;
    }

    const validationResult = schema.safeParse(input);

    if (!validationResult.success) {
      const validationError = validationResult.error.flatten()
        .fieldErrors as Partial<Record<keyof TInput, string[]>>;
      return { validationError };
    }

    return handler(validationResult.data, user);
  };
};
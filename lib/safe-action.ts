import { createSafeActionClient } from 'next-safe-action';
import { requireUser, requireAdmin } from '@/lib/auth-helpers';
import { createClient } from '@/lib/supabase/server';

class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActionError';
  }
}

const handleServerError = (e: Error) => {
  if (e instanceof ActionError) {
    return e.message;
  }
  return 'An unexpected error occurred.';
};

export const publicAction = createSafeActionClient({
  handleServerError,
});

export const userAction = publicAction.use(async ({ next }) => {
  const supabase = await createClient();
  const authCheck = await requireUser(supabase);
  if (!authCheck.success) {
    throw new ActionError(authCheck.message);
  }
  return next({
    ctx: {
      user: authCheck.user,
      profile: authCheck.profile,
    },
  });
});

export const adminAction = userAction.use(async ({ ctx, next }) => {
  if (ctx.profile?.billing_status !== 'founder') {
    throw new ActionError('无权操作');
  }

  return next({ ctx });
});
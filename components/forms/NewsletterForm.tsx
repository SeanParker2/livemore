'use client';

import { useAction } from 'next-safe-action/hooks';
import { subscribeToNewsletter, subscribeSchema, returnSchemaSubscribe } from '@/lib/actions/newsletter-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

function SubmitButton({ isDark, isPending }: { isDark?: boolean, isPending: boolean }) {
  return (
    <Button 
      type="submit" 
      aria-disabled={isPending}
      disabled={isPending}
      size="lg"
      className={isDark ? 'h-12 text-base bg-white text-black hover:bg-stone-200' : 'h-12 text-base'}
    >
      {isPending ? '订阅中...' : '订阅'}
    </Button>
  );
}

export function NewsletterForm({ isDark = false }: { isDark?: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { execute, result, status } = useAction<typeof subscribeSchema, typeof returnSchemaSubscribe>(subscribeToNewsletter);

  useEffect(() => {
    if (status === 'hasSucceeded' && result.data?.message) {
      toast.success(result.data.message);
      formRef.current?.reset();
    }

    if (status === 'hasErrored') {
      if (result.serverError) {
        toast.error(result.serverError);
      }
      if (result.validationError?.email) {
        toast.error(result.validationError.email[0]);
      }
    }
  }, [status, result]);

  const isPending = status === 'executing';

  const action = (formData: FormData) => {
    const email = formData.get('email') as string;
    execute({ email });
  };

  return (
    <form action={action} ref={formRef} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className={isDark ? 'h-12 text-base bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 focus:ring-white' : 'h-12 text-base grow'}
        />
        <SubmitButton isDark={isDark} isPending={isPending} />
      </div>
    </form>
  );
}
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { subscribeToNewsletter } from '@/lib/actions/newsletter-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

const initialState = { message: '', success: false };

function SubmitButton({ isDark }: { isDark?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      aria-disabled={pending}
      size="lg"
      className={isDark ? 'h-12 text-base bg-white text-black hover:bg-stone-200' : 'h-12 text-base'}
    >
      {pending ? 'Subscribing...' : 'Subscribe'}
    </Button>
  );
}

export function NewsletterForm({ isDark = false }: { isDark?: boolean }) {
  const [state, formAction] = useFormState(subscribeToNewsletter, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className={isDark ? 'h-12 text-base bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 focus:ring-white' : 'h-12 text-base grow'}
        />
        <SubmitButton isDark={isDark} />
      </div>
      {state.message && (
        <p className={`mt-2 text-sm ${state.success ? 'text-green-500' : 'text-red-500'}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
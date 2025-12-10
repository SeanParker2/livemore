'use client';

import { useTransition } from 'react';
import { subscribeToNewsletter } from '@/lib/actions/newsletter-actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { toast } from 'sonner';

export function NewsletterForm({ isDark = false, className }: { isDark?: boolean, className?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const action = async (formData: FormData) => {
    startTransition(async () => {
      const result = await subscribeToNewsletter(null, formData);
      
      if (result.error) {
        toast.error("订阅失败", { description: result.error });
      } else if (result.success) {
        toast.success("订阅成功", { description: result.success });
        formRef.current?.reset();
      }
    });
  };

  return (
    <form action={action} ref={formRef} className={`w-full max-w-md ${className}`}>
      <div className="flex flex-col gap-3">
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className={isDark ? 'h-10 text-sm bg-stone-800 border-stone-700 text-white placeholder:text-stone-500 focus:ring-white' : 'h-10 text-sm'}
        />
        <Button 
          type="submit" 
          aria-disabled={isPending}
          disabled={isPending}
          size="default"
          className={isDark ? 'h-10 text-sm w-full bg-white text-black hover:bg-stone-200' : 'h-10 text-sm w-full'}
        >
          {isPending ? '订阅中...' : '订阅'}
        </Button>
      </div>
    </form>
  );
}

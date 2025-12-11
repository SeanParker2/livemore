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
      
      if (!result.success) {
        toast.error("订阅失败", { description: result.message });
      } else {
        toast.success("订阅成功", { description: result.message });
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
          placeholder="name@company.com"
          required
          className={isDark 
            ? 'w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 h-10' 
            : 'h-10 text-sm'}
        />
        <Button 
          type="submit" 
          aria-disabled={isPending}
          disabled={isPending}
          size="default"
          className={isDark 
            ? 'w-full bg-white text-slate-900 font-bold text-sm py-2 rounded hover:bg-slate-100 transition-colors h-10' 
            : 'h-10 text-sm w-full'}
        >
          {isPending ? 'Subscribing...' : 'Subscribe Now'}
        </Button>
      </div>
    </form>
  );
}

'use client';

import { Mail } from 'lucide-react';
import { useTransition, useRef } from 'react';
import { subscribeToNewsletter } from '@/lib/actions/newsletter-actions';
import { toast } from 'sonner';

export function NewsletterWidget() {
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
    <div className="bg-background border border-fine p-6 text-center">
        <Mail className="w-6 h-6 mx-auto mb-3 text-foreground" />
        <h4 className="font-serif font-bold text-lg mb-2 text-foreground">Join the Inner Circle</h4>
        <p className="text-xs text-muted-foreground mb-4 px-2">
            Get the alpha before the market wakes up. Weekly deep dives.
        </p>
        <form action={action} ref={formRef}>
            <input 
                type="email" 
                name="email"
                placeholder="Email address" 
                required
                className="w-full bg-background border border-fine px-3 py-2 text-sm mb-2 focus:outline-none focus:border-foreground font-mono placeholder:text-muted-foreground text-foreground" 
            />
            <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-foreground text-background py-2 text-xs font-bold uppercase hover:opacity-90 transition-opacity disabled:opacity-70"
            >
                {isPending ? 'Subscribing...' : 'Subscribe'}
            </button>
        </form>
    </div>
  );
}

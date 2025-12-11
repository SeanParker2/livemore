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
      
      if (result.error) {
        toast.error("订阅失败", { description: result.error });
      } else if (result.success) {
        toast.success("订阅成功", { description: result.success });
        formRef.current?.reset();
      }
    });
  };

  return (
    <div className="bg-slate-50 border border-fine p-6 text-center">
        <Mail className="w-6 h-6 mx-auto mb-3 text-slate-400" />
        <h4 className="font-serif font-bold text-lg mb-2 text-slate-900">Join the Inner Circle</h4>
        <p className="text-xs text-slate-500 mb-4 px-2">
            Get the alpha before the market wakes up. Weekly deep dives.
        </p>
        <form action={action} ref={formRef}>
            <input 
                type="email" 
                name="email"
                placeholder="Email address" 
                required
                className="w-full bg-white border border-slate-200 px-3 py-2 text-sm mb-2 focus:outline-none focus:border-slate-900 font-mono placeholder:text-slate-300 text-slate-900" 
            />
            <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-slate-900 text-white py-2 text-xs font-bold uppercase hover:bg-black transition-colors disabled:opacity-70"
            >
                {isPending ? 'Subscribing...' : 'Subscribe'}
            </button>
        </form>
    </div>
  );
}

'use client';

import {useRouter, usePathname} from '@/src/navigation';
import {useParams} from 'next/navigation';
import {useTransition} from 'react';

export default function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  }

  return (
    <select
      defaultValue={params.locale}
      onChange={onSelectChange}
      disabled={isPending}
      className="bg-transparent border border-fine rounded-md text-sm px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
    >
      <option value="en">EN</option>
      <option value="zh">CN</option>
    </select>
  );
}
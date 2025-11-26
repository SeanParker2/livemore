
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileNavProps {
  isFounder: boolean;
}

export function MobileNav({ isFounder }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/archive', label: '归档' },
    { href: '/about', label: '关于' },
    { href: '/subscribe', label: '订阅' },
  ];

  if (isFounder) {
    navLinks.push({ href: '/admin', label: '创作' });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex flex-col h-full">
          <div className="border-b pb-4">
            <Link href="/" className="font-serif text-2xl font-bold" onClick={() => setOpen(false)}>
              Livemore
            </Link>
          </div>
          <nav className="flex-grow mt-6">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

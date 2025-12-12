
'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Link } from '@/src/navigation';
import { ThemeToggle } from '../ThemeToggle';
import { Menu, Triangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileNavProps {
  isFounder?: boolean;
}

export function MobileNav({ isFounder }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '/archive', label: 'Intelligence' },
    { href: '/markets', label: 'Markets' },
    { href: '/signals', label: 'Signals' },
  ];

  if (isFounder) {
    navLinks.push({ href: '/admin', label: 'Admin' });
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
            <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <div className="w-8 h-8 bg-slate-900 flex items-center justify-center">
                  <Triangle className="w-4 h-4 text-white fill-current" />
              </div>
              <span className="font-serif font-bold text-xl tracking-widest text-slate-900">AXIOM</span>
            </Link>
          </div>
          <nav className="grow mt-6">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.href === '/admin' ? (
                    <NextLink
                      href={link.href}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </NextLink>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto">
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

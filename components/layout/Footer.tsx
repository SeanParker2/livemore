import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-200 overflow-hidden">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Ethos */}
          <div className="md:col-span-4">
            <h2 className="font-serif font-bold text-3xl tracking-tight">Livemore</h2>
            <p className="mt-4 text-sm text-stone-400">
              Livemore · 探索复利的力量，寻找内心的宁静。
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-stone-400">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/archive" className="hover:text-white transition-colors">Archive</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-stone-400">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-stone-400">Stay ahead of the market.</h3>
            <div className="mt-4">
              <NewsletterForm isDark={true} />
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="text-[12vw] leading-none font-serif font-black text-white/5 select-none text-center overflow-hidden whitespace-nowrap">
          LIVEMORE
        </div>
      </div>
    </footer>
  );
}
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-12">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-serif font-bold text-lg text-slate-900">Signal & Cipher</span>
          
          <div className="flex items-center gap-6 text-xs text-slate-500">
             <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
             <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
             <p>© {new Date().getFullYear()} Signal & Cipher. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
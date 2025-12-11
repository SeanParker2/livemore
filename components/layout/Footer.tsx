export function Footer() {
  return (
    <footer className="border-t border-fine mt-12 py-12 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
            <span className="font-serif font-bold text-lg tracking-tight text-slate-300">S & C</span>
            <p className="mt-4 text-[10px] font-mono text-slate-400 uppercase">
                © {new Date().getFullYear()} Signal & Cipher. All rights reserved. <br />
                Rational Investing, Free Living.
            </p>
        </div>
    </footer>
  );
}

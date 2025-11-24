import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Livemore. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">X / Twitter</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">LinkedIn</Link>
        </div>
        <p className="text-balance text-center text-xs leading-loose text-muted-foreground md:text-right">
          Risk Disclaimer: All information is for educational purposes only and is not investment advice.
        </p>
      </div>
    </footer>
  );
}
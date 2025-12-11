import type { Metadata } from "next";
import { Inter, Libre_Baskerville, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const libreBaskerville = Libre_Baskerville({ 
  subsets: ["latin"], 
  weight: ["400", "700"], 
  variable: "--font-serif" 
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono" 
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Livemore - 理性投资，自在生活。",
    template: `%s | Livemore`,
  },
  description: "深度解读全球市场、加密资产与宏观趋势。助您做出更明智的投资决策，享受更富足的生活。",
  openGraph: {
    title: 'Livemore - 理性投资，自在生活。',
    description: '深度解读全球市场、加密资产与宏观趋势。助您做出更明智的投资决策，享受更富足的生活。',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Livemore',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Livemore - 理性投资，自在生活。',
    description: '深度解读全球市场、加密资产与宏观趋势。助您做出更明智的投资决策，享受更富足的生活。',
  },
};

import { Header } from "@/components/layout/Header";
import { Ticker } from "@/components/layout/Ticker";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased leading-relaxed",
          inter.variable,
          libreBaskerville.variable,
          jetbrainsMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            <Ticker />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

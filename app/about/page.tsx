import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Livemore",
  description: "Learn more about Livemore and its mission.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <h1>About Livemore</h1>
        <p>
          Livemore is a subscription-based investment analysis platform dedicated to providing deep, unbiased insights into global markets. Our mission is to empower individual investors with the knowledge and tools typically reserved for financial institutions.
        </p>
        <p>
          We believe that financial freedom is a cornerstone of living a fulfilling life—to "live more." By cutting through the noise and delivering high-quality, data-driven analysis, we help our readers make smarter, more informed investment decisions.
        </p>
        
        <h2>Our Philosophy</h2>
        <p>
          Our core philosophy is built on three pillars: long-term perspective, fundamental analysis, and intellectual honesty. We don't chase hype. We focus on the underlying value and long-term trends that shape the markets.
        </p>

        <hr />

        <h2>Meet the Founder</h2>
        <div className="flex items-center gap-4 not-prose">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://i.pravatar.cc/80?u=founder" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold m-0">John Doe</h3>
            <p className="text-muted-foreground m-0">
              Founder & Chief Analyst at Livemore. With over 15 years of experience in asset management and equity research, John is passionate about demystifying the world of finance for everyone.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
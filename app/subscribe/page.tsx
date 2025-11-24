import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe - Livemore",
};

export default function SubscribePage() {
  return (
    <div className="container mx-auto max-w-md text-center py-24">
      <h1 className="text-4xl font-bold mb-4">Subscribe</h1>
      <p className="text-muted-foreground">
        This is a placeholder for the subscription page. Payment and subscription management will be implemented soon.
      </p>
    </div>
  );
}
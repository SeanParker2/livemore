'use client';

import { incrementView } from "@/lib/actions/post-actions";
import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    incrementView(slug);
  }, [slug]);

  return null;
}

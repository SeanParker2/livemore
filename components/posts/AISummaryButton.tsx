'use client';

import { Sparkles } from 'lucide-react';

interface AISummaryButtonProps {
  postSlug: string;
}

export function AISummaryButton({ postSlug }: AISummaryButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Trigger AI Summary for', postSlug);
  };

  return (
    <button
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
      onClick={handleClick}
    >
      <Sparkles className="w-3 h-3 text-purple-600" />
      AI 核心摘要
    </button>
  );
}

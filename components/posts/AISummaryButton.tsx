'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AISummaryButtonProps {
  postSlug: string;
}

export function AISummaryButton({ postSlug }: AISummaryButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Trigger AI Summary for', postSlug);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-colors px-3"
      onClick={handleClick}
    >
      <Sparkles className="w-3 h-3" />
      AI 摘要
    </Button>
  );
}

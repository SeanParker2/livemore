'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-4 mt-12">
      <Button asChild variant="outline" disabled={isFirstPage}>
        <Link href={createPageURL(currentPage - 1)} scroll={false}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          上一页
        </Link>
      </Button>

      <span className="text-sm font-medium">
        第 {currentPage} 页 / 共 {totalPages} 页
      </span>

      <Button asChild variant="outline" disabled={isLastPage}>
        <Link href={createPageURL(currentPage + 1)} scroll={false}>
          下一页
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

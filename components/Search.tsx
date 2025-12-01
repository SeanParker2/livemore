'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { Search as SearchIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface Post {
  id: string;
  title: string;
  slug: string;
}

export function Search() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  React.useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      fetch(`/api/search?q=${debouncedQuery}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setResults(data);
        })
        .catch((error) => {
          toast.error('搜索失败', { description: error.message });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleSelect = (slug: string) => {
    router.push(`/blog/${slug}`);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
        )}
      >
        <SearchIcon className="h-4 w-4" />
        <span>搜索...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <Command>
            <CommandInput
              placeholder="输入关键词搜索文章..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {loading && <CommandEmpty>搜索中...</CommandEmpty>}
              {!loading && results.length === 0 && debouncedQuery && (
                <CommandEmpty>没有找到结果</CommandEmpty>
              )}
              {results.length > 0 && (
                <CommandGroup heading="文章">
                  {results.map((post) => (
                    <CommandItem
                      key={post.id}
                      value={post.title}
                      onSelect={() => handleSelect(post.slug)}
                    >
                      {post.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { File, Search as SearchIcon } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "./ui/button"

interface Post {
  id: number;
  title: string;
  slug: string;
}

export function SiteSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<Post[]>([])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (query.length > 1) {
      const fetchResults = async () => {
        const res = await fetch(`/api/search?q=${query}`)
        const data = await res.json()
        setResults(data)
      }
      fetchResults()
    } else {
      setResults([])
    }
  }, [query])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">搜索文章...</span>
        <span className="sr-only">搜索文章</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <span className="text-sm">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="输入关键词搜索..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>没有找到结果。</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="文章">
              {results.map((post) => (
                <CommandItem
                  key={post.id}
                  value={post.title}
                  onSelect={() => {
                    runCommand(() => router.push(`/p/${post.slug}`))
                  }}
                >
                  <File className="mr-2 h-4 w-4" />
                  <span>{post.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

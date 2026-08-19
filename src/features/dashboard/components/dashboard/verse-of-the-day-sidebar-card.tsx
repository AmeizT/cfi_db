"use client";

import { BookOpen } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useVotd } from "@/features/dashboard/hooks/use-votd";
import { NotebookMinimalisticIcon } from '@solar-icons/react/bold-duotone/notebook-minimalistic'

export function VerseOfTheDaySidebarCard() {
  const { data: verse, isLoading, isError } = useVotd();

  if (isLoading) {
    return (
      <div className="space-y-2 rounded-xl border border-(--shell-sidebar-border) p-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  if (isError || !verse) return null;

  return (
    <aside
      aria-label="Verse of the Day"
      className="rounded-2xl border-0 border-(--shell-sidebar-border) bg-background p-3 text-(--shell-sidebar-foreground) shadow-elevation-01"
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-(--shell-sidebar-muted-foreground)">
        <NotebookMinimalisticIcon className="size-5" aria-hidden="true" />
        Verse of the Day
      </div>
      <blockquote className="line-clamp-2 text-[0.8125rem] font-serif leading-relaxed">
        &quot;{verse.text}&quot;
      </blockquote>
      <footer className="mt-2 flex flex-wrap items-center gap-0.5 text-xs font-semibold">
        <cite className="not-italic">{verse.reference}</cite>
        {verse.translation?.short_name ? (
          <span className="rounded bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground">
            {verse.translation.short_name} Version
          </span>
        ) : null}
      </footer>
    </aside>
  );
}

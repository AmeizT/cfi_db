"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, SearchIcon, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useJethroSession } from "@/features/jethro/JethroSessionProvider"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import { getReportSubmoduleHref } from "@/features/reports/modules/config/report-submodules"
import { cn } from "@/lib/utils"
import { JethroLogo } from "@/features/jethro/components/JethroLogo";

type TithesDataView = "monthly" | "cumulative"

function ViewModeSwitch({ activeView }: { activeView: TithesDataView }) {
  const searchParams = useSearchParams()
  const monthlyHref = getReportSubmoduleHref({
    section: "finance",
    module: "tithes",
    searchParams,
    submodule: null,
    updates: { status: null },
    pageContext: "workspace",
  })
  const cumulativeHref = getReportSubmoduleHref({
    section: "finance",
    module: "tithes",
    searchParams,
    submodule: "cumulative",
    pageContext: "workspace",
  })

  return (
    <div
      role="group"
      aria-label="Tithes data view"
      className="inline-flex h-8 shrink-0 items-center rounded-full p-0.5 bg-user-theme-200"
    >
      {([
        ["monthly", "Monthly", monthlyHref],
        ["cumulative", "Cumulative", cumulativeHref],
      ] as const).map(([value, label, href]) => (
        <Button
          key={value}
          asChild
          variant="ghost"
          size="sm"
          className={cn(
            "h-full rounded-full px-4 font-medium shadow-none",
            activeView === value
              ? "bg-background font-semibold text-primary hover:bg-user-theme-50 hover:text-primary"
              : "text-foreground hover:bg-transparent",
          )}
        >
          <Link href={href} aria-current={activeView === value ? "page" : undefined}>
            {label}
          </Link>
        </Button>
      ))}
    </div>
  )
}

export function TithesToolbarControls({
  activeView = "monthly",
  showSearch = true,
}: {
  activeView?: TithesDataView
  showSearch?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get("search") ?? ""

  function applySearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const search = String(formData.get("search") ?? "").trim()
    const query = createQueryString(searchParams, {
      search: search || null,
      page: 1,
    })
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-3">
      <ViewModeSwitch activeView={activeView} />
      {showSearch ? (
        <>
          <Separator orientation="vertical" className="hidden sm:block data-[orientation=vertical]:h-4.5" />
          <form onSubmit={applySearch} role="search" className="min-w-48 flex-1 sm:flex-none">
            <label className="relative block">
              <span className="sr-only">Search tithe records</span>
              <SearchIcon
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                key={currentSearch}
                name="search"
                type="search"
                defaultValue={currentSearch}
                placeholder="Search…"
                className="h-8 w-full min-w-48 rounded-full border-0 bg-zinc-100 dark:bg-neutral-800 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-zinc-200/60 dark:focus-visible:bg-neutral-900 sm:w-60 caret-primary"
              />
            </label>
            <button type="submit" className="sr-only">Search</button>
          </form>
        </>
      ) : null}
    </div>
  )
}

export function TithesSummarizeAction() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { submitMessage, isSending } = useJethroSession()

  async function summarize() {
    const period = searchParams.get("period")?.replace("year:", "")
    const prompt = period
      ? `Summarize my ${period} tithe records and highlight anything that needs attention.`
      : "Summarize my selected tithe report and highlight anything that needs attention."
    const conversationId = await submitMessage(prompt)
    if (conversationId) {
      router.push(`/ai?conversation=${encodeURIComponent(conversationId)}`)
    }
  }

  return (
    <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 rounded-full px-3 hover:bg-primary/5"
        disabled={isSending}
        onClick={() => void summarize()}
    >
        {isSending ? (
            <Loader2 className="size-4 animate-spin text-purple-500" />
        ) : (
            <JethroLogo className="size-5" aria-hidden="true" />
        )}

        <span className="bg-linear-to-r from-pink-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
          Summarize
        </span>
    </Button>
  )
}

export function TithesCumulativeToolbar() {
  return (
    <div className="py-3 flex min-h-11 flex-wrap items-center justify-between gap-3 border-b border-border-subtle">
      <TithesToolbarControls activeView="cumulative" showSearch={false} />
      <TithesSummarizeAction />
    </div>
  )
}

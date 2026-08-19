"use client"

import * as React from "react"
import { Minus, MoreHorizontal, SunMedium } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { useVotd } from "../../hooks/use-votd"

const STORAGE_KEY = "cfi-verse-of-the-day-minimized"

export function FloatingVerseCard() {
    const { data: verse, isLoading, isError } = useVotd()
    const [minimized, setMinimized] = React.useState(false)

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            setMinimized(window.localStorage.getItem(STORAGE_KEY) === "true")
        }, 0)
        return () => window.clearTimeout(timer)
    }, [])

    function updateMinimized(value: boolean) {
        setMinimized(value)
        window.localStorage.setItem(STORAGE_KEY, String(value))
    }

    if (isError) return null

    if (minimized) {
        return (
            <button
                type="button"
                onClick={() => updateMinimized(false)}
                aria-label="Show Verse of the Day"
                className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-40 grid size-12 place-items-center rounded-full border border-amber-200/70 bg-background text-amber-500 shadow-lg transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
            >
                <SunMedium className="size-5" />
            </button>
        )
    }

    return (
        <aside className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-40 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border-subtle bg-background shadow-xl sm:bottom-6 sm:right-6" aria-label="Verse of the Day">
            <div className="relative z-10 p-4 pb-16">
                <header className="flex items-center gap-2 text-xs font-semibold">
                    <span className="grid size-7 place-items-center rounded-full bg-amber-400/15 text-amber-500"><SunMedium className="size-4" /></span>
                    Verse of the Day
                    <button type="button" aria-label="Verse options" className="ml-auto grid size-7 place-items-center rounded-full hover:bg-muted"><MoreHorizontal className="size-4" /></button>
                    <button type="button" onClick={() => updateMinimized(true)} aria-label="Minimize Verse of the Day" className="grid size-7 place-items-center rounded-full hover:bg-muted"><Minus className="size-4" /></button>
                </header>
                {isLoading ? (
                    <div className="mt-4 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><Skeleton className="mt-3 h-3 w-28" /></div>
                ) : verse ? (
                    <>
                        <blockquote className="mt-4 text-sm leading-relaxed">“{verse.text}”</blockquote>
                        <p className="mt-3 text-xs font-medium text-primary">{verse.reference} ({verse.translation?.short_name})</p>
                    </>
                ) : null}
            </div>
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-14 overflow-hidden bg-gradient-to-t from-amber-300/55 to-transparent">
                <span className="absolute -bottom-7 -left-5 h-16 w-36 rotate-6 rounded-[50%] bg-amber-500/35" />
                <span className="absolute -bottom-8 left-20 h-16 w-40 -rotate-3 rounded-[50%] bg-orange-400/30" />
                <span className="absolute -bottom-9 right-[-1rem] h-16 w-36 rotate-3 rounded-[50%] bg-amber-600/35" />
            </div>
        </aside>
    )
}

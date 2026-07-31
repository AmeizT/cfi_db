"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { promptSuggestions } from "../lib/dashboard-data"
import { JethroComposer } from "../components/dashboard/jethro-composer"
import { QuickActions } from "../components/dashboard/quick-actions"
import { StatsGrid } from "../components/dashboard/stats-grid"
import { VotdCard } from "../components/dashboard/verse-of-the-day-card"
import { AppStartupSound } from "./DashboardView";
import { greetByTime } from "@/utils/greet-by-time";
import { useUser } from "@/hooks/query/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useReports } from "@/features/reports/core/hooks/use-reports";
import { useReportSummary } from "../hooks/use-report-summary";
import { InsightRotator } from "../components/insight-rotator";
import { Button } from "@/components/ui/button";
import { StatusGauge } from "../components/status-gauge";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { cn } from "@/utils/cn";
import { useTheme } from 'next-themes';

function normalizeParam(value: string | null) {
  return value ?? undefined
}

function DashboardHome() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { resolvedTheme } = useTheme();
    
    const [message, setMessage] = useState("")

    const params = { 
        year: normalizeParam(searchParams.get("year")), 
        month: normalizeParam(searchParams.get("month"))
    }
    const { data: reports, isLoading: loading } = useReports(params)

    const summary = useReportSummary(reports?.[0])

    console.log(summary)

    const { data: user, isLoading} = useUser()
    const greeting = React.useMemo(
        () =>
            greetByTime({
                username: user?.first_name,
            }),
        [user?.first_name]
    )

    const [greetingText, username] = greeting.split(",")

    function openJethro() {
        const query = message.trim()
        if (!query) return

        router.push(`/app/jethroai?q=${encodeURIComponent(query)}`)
    }

    return (
        <div className="relative isolate">
            <StarsBackground 
                starColor={resolvedTheme === 'dark' ? '#FFF' : 'var(--color-primary)'}
                className={cn(
                    'absolute z-5 inset-0 flex items-center justify-center rounded-xl',
                    'dark:bg-[radial-gradient(ellipse_at_bottom,#262626_0%,#000_100%)] bg-[radial-gradient(ellipse_at_bottom,#f5f5f5_0%,#fff_100%)]',
                )}
            />
            <div className="relative z-15 mx-auto max-w-245 h-auto px-5 pb-22.5 pt-12 sm:px-8 sm:pt-16">
            
            <header className="mb-9 text-center">
                <h1 className="mb-3 font-serif text-[32px] font-medium leading-tight text-[#1b1c27] sm:text-[42px]">
                    {greetingText}
                        {username && (
                            <React.Fragment>
                                {isLoading ? (
                                    <Skeleton className="h-4 w-62.5" />
                                ) : (
                                    <span className="text-muted-foreground">
                                        {username}
                                    </span>
                                )}
                            </React.Fragment>
                        )}
                </h1>

                <InsightRotator
                        title={summary?.title}
                        messages={summary?.messages ?? []}
                    />
            </header>

            <JethroComposer
                value={message}
                onChange={setMessage}
                onSubmit={openJethro}
            />

            <div className="mt-4 mb-8 flex flex-wrap justify-center gap-2">
                {promptSuggestions.map((suggestion) => (
                <Button
                    variant="outline"
                    key={suggestion.prompt}
                    type="button"
                    onClick={() => setMessage(suggestion.prompt)}
                    className="rounded-full border-0 border-border-subtle shadow-elevation-sm bg-background px-3.25 py-1.75 text-[13px] font-medium text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-[#26215c] focus-visible:ring-offset-2"
                >
                    {suggestion.label}
                </Button>
                ))}
            </div>

            {/* <QuickActions /> */}
            <div className="grid grid-cols-3 gap-2">
                <StatusGauge
                    title="Financial health"
                    status="at_risk"
                    description="Based on revenue, overheads, expenses and cash flow."
                />

                <StatusGauge
                    title="Financial health"
                    status="stable"
                    description="Based on revenue, overheads, expenses and cash flow."
                />
            </div>

            <StatsGrid />
            <VotdCard />
        </div>
        </div>
    )
}

export function AppDashboardView() {
    return (
        <React.Fragment>
            <AppStartupSound />
            <DashboardHome  />
        </React.Fragment>
    )
}

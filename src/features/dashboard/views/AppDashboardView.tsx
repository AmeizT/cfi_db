"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { promptSuggestions } from "../lib/dashboard-data"
import { JethroComposer } from "../components/dashboard/jethro-composer"
import { StatsGrid } from "../components/dashboard/stats-grid"
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
import { HandHeart, Landmark, Users } from "lucide-react"
import { ReportTemplateCard } from "../components/dashboard/report-template";

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
    const { data: reports } = useReports(params)

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
    starColor={
        resolvedTheme === "dark"
            ? "#FFF"
            : "var(--color-primary)"
    }
    className={cn(
        "absolute inset-0 z-5 flex items-center justify-center bg-background",

        "bg-[radial-gradient(circle_at_15%_10%,color-mix(in_srgb,var(--color-blue-50)_80%,transparent),transparent_38%),radial-gradient(circle_at_85%_25%,color-mix(in_srgb,var(--color-purple-50)_75%,transparent),transparent_40%),radial-gradient(circle_at_50%_100%,color-mix(in_srgb,var(--color-orange-100)_65%,transparent),transparent_48%)]",

        "dark:bg-[radial-gradient(circle_at_20%_15%,rgb(99_102_241/0.16),transparent_35%),radial-gradient(circle_at_80%_20%,rgb(168_85_247/0.14),transparent_35%),radial-gradient(ellipse_at_bottom,#262626_0%,#000_100%)]"
    )}
/>
            <div className="relative z-15 mx-auto max-w-245 h-auto px-5 pb-22.5 pt-12 sm:px-8 sm:pt-16">
            
            <header className="mb-9 text-center">
                <h1 className="mb-3 font-serif text-balance font-medium leading-tight text-[#1b1c27]" style={{ lineHeight: "1.5", fontSize: "clamp(1.875rem, 1.2rem + 2vw, 2.5rem)"}}>
                    {greetingText},
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

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
    <ReportTemplateCard
        title="Monthly Assembly Report"
        category="Monthly Report"
        description="Attendance, tithes, revenue, expenses and ministry activity."
        itemCount={6}
        icon={Landmark}
        onUse={() => {}}
    />

    <ReportTemplateCard
        title="Engagement Report"
        category="Engagement"
        description="Track attendance, outreach, Sunday School and member activity."
        itemCount={4}
        icon={Users}
        onUse={() => {}}
    />

    <ReportTemplateCard
        title="Outreach Report"
        category="Ministry"
        description="Record outreach programs, participation and ministry outcomes."
        itemCount={5}
        icon={HandHeart}
        onUse={() => {}}
    />
</div>
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

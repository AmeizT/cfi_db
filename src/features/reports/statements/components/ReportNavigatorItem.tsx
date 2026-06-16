"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buildTab } from "@/utils/build-tab"
import { SHORT_MONTHS } from "../config/months"
import { usePathname, useSearchParams } from "next/navigation"
import { createQueryString } from "../../core/lib/create-query-string"
import { AssemblyReport } from "@/dal/types"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    index: number
    report: AssemblyReport
    isActive?: boolean
}

export function ReportNavigatorItem({ report, index, isActive, ...rest }: Props) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const monthIdx = new Date(report.period_start + "T00:00:00").getMonth()
    const shortMonth = SHORT_MONTHS[monthIdx];
    const year = report.period_start.slice(0, 4);

    const ref = React.useRef<HTMLDivElement>(null)
    const tab = searchParams.get("tab") || buildTab("attendance", "sunday")


    React.useEffect(() => {
        if (isActive && ref.current) {
            ref.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            })
        }
    }, [isActive])

    return (
        <Link href={`${pathname}?${createQueryString(searchParams, {
            reportid: String(report?.id), 
            tab: tab,
        })}`}>
            <div
                ref={ref}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.currentTarget.click()
                    }
                }}
                {...rest}
                className={cn(
                    "group relative cursor-pointer bg-gray-200/50 hover:bg-gray-200/80 snap-center",
                    "border-[1.5px] border-transparent",
                    "px-4 py-1.5 h-fit flex flex-col gap-4 rounded-full relative",
                    "transition-all duration-200 ease-out z-0 hover:z-10",
                    isActive && "bg-primary text-theme-50 border-primary hover:bg-theme-600 scale-100 transition-transform duration-200 ease-out",
                    rest.className
                )}
                suppressHydrationWarning
                style={{
                    animationName: "fadeUp",
                    animationDuration: "0.35s",
                    animationTimingFunction: "ease",
                    animationFillMode: "both",
                    animationDelay: `${index * 0.05}s`,
                }}
            >
                <div
                    className="absolute top-0 inset-x-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "transparent" }}
                />

                <span
                    className={cn(
                        "hidden pointer-events-none select-none absolute right-0 bottom-0 text-xl font-bold leading-none text-mist-100 group-hover:text-border/60 transition-colors duration-200"
                    )}
                    aria-hidden="true"
                    suppressHydrationWarning
                >
                    {shortMonth}
                </span>

                {/* ── Header: month + status ── */}
                <div>
                    <h3 className="text-center font-semibold leading-none tracking-tight">
                        {shortMonth}
                    </h3>
                    <p className="hidden font-mono text-[10px] text-muted-foreground">
                        {year}
                    </p>
                </div>
            </div>
        </Link>
        
    )
}

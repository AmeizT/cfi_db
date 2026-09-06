"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    getReportSubmoduleGroup,
    getReportSubmoduleHref,
} from "@/features/reports/modules/config/report-submodules"
import type { TitheStatusFilter, TithesRouteView } from "../types"

const TITHES_SUBMODULE_GROUP = getReportSubmoduleGroup("finance", "tithes")
const PRIMARY_NAV = TITHES_SUBMODULE_GROUP?.tabs.filter(
    (tab) => tab.key !== "more" && tab.key !== "cumulative"
) ?? []

export function Navigation({
    view,
    status,
}: {
    view: TithesRouteView
    status: TitheStatusFilter
}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    React.useEffect(() => {
        const active = document.querySelector<HTMLElement>("[data-tithes-nav-active='true']")
        active?.scrollIntoView({ block: "nearest", inline: "center" })
    }, [pathname, status])

    return (
        <nav aria-label="Tithes views" className="w-full overflow-x-auto px-4 pb-3 no-scrollbar">
            <div className="flex min-w-max items-center gap-1">
                {PRIMARY_NAV.map((item) => {
                    const active = item.key === view && !(item.key === "transactions" && status !== "active")

                    return (
                        <Link
                            key={item.key}
                            href={getReportSubmoduleHref({
                                section: "finance",
                                module: "tithes",
                                searchParams,
                                submodule: item.submodule,
                                updates: item.key === "transactions" ? { status: null } : {},
                            })}
                            data-tithes-nav-active={active ? "true" : undefined}
                            className={cn(
                                "inline-flex h-8 items-center rounded-lg px-3 text-sm font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                active
                                    ? "bg-primary text-primary-foreground lg:bg-transparent lg:text-primary"
                                    : "text-foreground hover:bg-accent"
                            )}
                        >
                            {item.label}
                        </Link>
                    )
                })}

            </div>
        </nav>
    )
}

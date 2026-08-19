"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { MEMBERS_SECTION_NAVIGATION } from "../config/members-section-navigation"

export function MembersSectionNavigation() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const query = searchParams.toString()

    return (
        <nav
            aria-label="Members sections"
            className="shrink-0 border-b border-border-subtle bg-background px-4 lg:px-6"
        >
            <div className="flex min-h-11 gap-1 overflow-x-auto no-scrollbar">
                {MEMBERS_SECTION_NAVIGATION.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.key}
                            href={query ? `${item.href}?${query}` : item.href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "relative inline-flex shrink-0 items-center px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                                active && "font-semibold text-primary after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
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

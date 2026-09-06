"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
    MEMBERS_LIFECYCLE_NAVIGATION,
    MEMBERS_SECTION_NAVIGATION,
} from "../config/members-section-navigation"

export function MembersSectionNavigation() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const query = searchParams.toString()
    const withQuery = (href: string) => query ? `${href}?${query}` : href
    const primaryLinks = MEMBERS_SECTION_NAVIGATION.filter(
        (item) => item.key !== "lifecycle"
    )
    const activeLifecycleItem = MEMBERS_LIFECYCLE_NAVIGATION.find(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    const lifecycleHref = MEMBERS_SECTION_NAVIGATION.find(
        (item) => item.key === "lifecycle"
    )?.href
    const lifecycleActive = Boolean(activeLifecycleItem)
        || pathname === lifecycleHref

    return (
        <nav
            aria-label="Members sections"
            className="relative z-10 shrink-0 border-b border-border-subtle bg-background px-2 sm:px-4 lg:px-6"
        >
            <div className="flex h-10 max-w-full items-center gap-1 overflow-visible">
                {primaryLinks.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <Link
                            key={item.key}
                            href={withQuery(item.href)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                                "relative inline-flex h-8 shrink-0 items-center rounded-lg px-2.5 text-sm font-semibold text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
                                active && "bg-primary/10 text-primary"
                            )}
                        >
                            {item.label}
                        </Link>
                    )
                })}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-current={lifecycleActive ? "page" : undefined}
                            className={cn(
                                "inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
                                lifecycleActive && "bg-primary/10 text-primary"
                            )}
                        >
                            Lifecycle
                            <ChevronDownIcon className="size-3.5" aria-hidden="true" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" sideOffset={6} className="min-w-44">
                        {MEMBERS_LIFECYCLE_NAVIGATION.map((item) => {
                            const active = activeLifecycleItem?.key === item.key
                            return (
                                <DropdownMenuItem key={item.key} asChild>
                                    <Link
                                        href={withQuery(item.href)}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(active && "bg-accent font-medium text-primary")}
                                    >
                                        <span className="min-w-0 flex-1">{item.label}</span>
                                        {active ? <CheckIcon className="size-4 text-primary" aria-hidden="true" /> : null}
                                    </Link>
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}

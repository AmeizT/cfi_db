"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import {
    BabyIcon,
    BookOpenTextIcon,
    BriefcaseBusinessIcon,
    ChevronRightIcon,
    ChurchIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    HouseIcon,
    MenuIcon,
    UsersIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { AssemblySwitcher } from "@/layouts/dashboard/AssemblySwitcher"
import { ProfileDropdown } from "@/layouts/dashboard/ProfileDropdown"
import { cn } from "@/lib/utils"

type CreateModule = "report" | "templates"

type CreateNavigationProps = {
    active: CreateModule
    reportHref: string
    templatesHref: string
    onNavigate?: () => void
    className?: string
}

type CentralCreateWorkspaceProps = CreateNavigationProps & {
    children: ReactNode
    modeSwitcher?: ReactNode
    topbarProgress?: ReactNode
    contextPanel?: ReactNode
    contextLabel?: string
    mainClassName?: string
}

const NAVIGATION_GROUPS = [
    {
        label: "Members",
        items: [
            { label: "Members", href: "/members", icon: UsersIcon },
            { label: "Households", href: "/members/households", icon: HouseIcon },
            { label: "Baptism", href: "/members/baptisms", icon: ChurchIcon },
            {
                label: "Baby Dedication",
                href: "/members/dedications",
                icon: BabyIcon,
            },
        ],
    },
    {
        label: "Finance",
        items: [
            { label: "Assets", href: "/assets", icon: BriefcaseBusinessIcon },
        ],
    },
    {
        label: "Engagement",
        items: [
            {
                label: "Homecells",
                href: "/app/spaces/home-cells",
                icon: BookOpenTextIcon,
            },
        ],
    },
] as const

function NavigationLink({
    href,
    label,
    icon: Icon,
    active = false,
    onNavigate,
}: {
    href: string
    label: string
    icon: typeof FileTextIcon
    active?: boolean
    onNavigate?: () => void
}) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
                "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent",
            )}
        >
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {active ? (
                <ChevronRightIcon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
            ) : null}
        </Link>
    )
}

export function CentralCreateNavigation({
    active,
    reportHref,
    templatesHref,
    onNavigate,
    className,
}: CreateNavigationProps) {
    return (
        <nav
            aria-label="Create workspace"
            className={cn(
                "flex min-h-0 flex-col overflow-y-auto rounded-2xl border border-border-subtle bg-background p-3 shadow-elevation-01 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300",
                className,
            )}
        >
            <div className="px-3 pb-2 pt-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Create
            </div>
            <div className="grid gap-1">
                <NavigationLink
                    href={reportHref}
                    label="Report Wizard"
                    icon={FileTextIcon}
                    active={active === "report"}
                    onNavigate={onNavigate}
                />
                <NavigationLink
                    href={templatesHref}
                    label="Templates"
                    icon={FileSpreadsheetIcon}
                    active={active === "templates"}
                    onNavigate={onNavigate}
                />
            </div>

            {NAVIGATION_GROUPS.map((group) => (
                <div key={group.label} className="mt-4 border-t border-border-subtle pt-4">
                    <div className="px-3 pb-2 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        {group.label}
                    </div>
                    <div className="grid gap-1">
                        {group.items.map((item) => (
                            <NavigationLink
                                key={item.label}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                onNavigate={onNavigate}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <div className="mt-auto px-3 pb-2 pt-8">
                <p className="text-xs leading-5 text-muted-foreground">
                    More creation workflows will move here as they are migrated.
                </p>
            </div>
        </nav>
    )
}

export function CentralCreateWorkspace({
    active,
    reportHref,
    templatesHref,
    modeSwitcher,
    topbarProgress,
    contextPanel,
    contextLabel = "Report steps",
    mainClassName,
    children,
}: CentralCreateWorkspaceProps) {
    const navigation = (
        <CentralCreateNavigation
            active={active}
            reportHref={reportHref}
            templatesHref={templatesHref}
            className="h-full rounded-none border-0 shadow-none lg:rounded-2xl lg:border lg:shadow-elevation-01"
        />
    )

    return (
        <div className="flex h-dvh min-h-0 min-w-0 flex-col overflow-hidden bg-surface p-2 sm:p-3">
            <header className="relative z-40 flex min-h-16 shrink-0 items-center gap-3 rounded-2xl border border-border-subtle bg-background px-3 shadow-elevation-01 sm:px-4">
                <div className="flex min-w-0 flex-1 items-center gap-2 lg:max-w-72">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="shrink-0 lg:hidden"
                                aria-label="Open Create navigation"
                            >
                                <MenuIcon className="size-4" aria-hidden="true" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[min(20rem,92vw)] gap-0 p-0">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Create navigation</SheetTitle>
                                <SheetDescription>Choose a creation workflow.</SheetDescription>
                            </SheetHeader>
                            {navigation}
                        </SheetContent>
                    </Sheet>
                    <div className="min-w-0 flex-1">
                        <AssemblySwitcher />
                    </div>
                </div>

                <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
                    {modeSwitcher}
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-2">
                    {topbarProgress}
                    {contextPanel ? (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="xl:hidden"
                                >
                                    <FileTextIcon className="size-4" aria-hidden="true" />
                                    <span className="hidden sm:inline">{contextLabel}</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[min(24rem,94vw)] gap-0 p-0">
                                <SheetHeader className="sr-only">
                                    <SheetTitle>{contextLabel}</SheetTitle>
                                    <SheetDescription>
                                        Report context, status, and step navigation.
                                    </SheetDescription>
                                </SheetHeader>
                                {contextPanel}
                            </SheetContent>
                        </Sheet>
                    ) : null}
                    <ProfileDropdown />
                </div>
            </header>

            <div
                className={cn(
                    "mt-2 grid min-h-0 min-w-0 flex-1 gap-2 sm:mt-3 sm:gap-3 lg:grid-cols-[270px_minmax(0,1fr)]",
                    contextPanel && "xl:grid-cols-[270px_minmax(0,1fr)_340px]",
                )}
            >
                <aside className="hidden min-h-0 lg:block">{navigation}</aside>

                <main
                    className={cn(
                        "min-h-0 min-w-0 overflow-y-auto rounded-2xl border border-border-subtle bg-background shadow-elevation-01 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300",
                        mainClassName,
                    )}
                >
                    <div className="md:hidden">{modeSwitcher}</div>
                    {children}
                </main>

                {contextPanel ? (
                    <aside className="hidden min-h-0 xl:block">{contextPanel}</aside>
                ) : null}
            </div>
        </div>
    )
}

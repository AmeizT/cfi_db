"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { AssemblySwitcher } from "@/layouts/dashboard/AssemblySwitcher"
import { ProfileDropdown } from "@/layouts/dashboard/ProfileDropdown"

const navigation = [
    {
        label: "Home",
        pathname: "/"
    },
    {
        label: "Reports",
        pathname: "/reports"
    },
    {
        label: "Create",
        pathname: "/create"
    },

]

export function CreateTopbar() {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-7 px-4 sm:px-8">
                <div className="shrink-0 [--shell-chrome-active:var(--primary-foreground)] [--shell-chrome-foreground:var(--foreground)] [--shell-chrome-hover:var(--muted)]">
                    <AssemblySwitcher />
                </div>

                <nav className="hidden items-center gap-1 md:flex">
                    {navigation.map((item) => {
                        const isActive = pathname === item.pathname

                        return (
                            <Link
                                key={item.label}
                                href={item.pathname}
                                className={
                                    isActive
                                        ? "rounded-full bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary"
                                        : "rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition hover:bg-surface hover:text-foreground"
                                }
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    {/* <button
                        type="button"
                        className="relative grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Notifications"
                    >
                        <Bell className="size-[19px]" strokeWidth={1.75} />
                        <span className="absolute right-[3px] top-[3px] grid h-[15px] min-w-[15px] place-items-center rounded-full border-2 border-background bg-destructive px-[3px] text-[9.5px] font-bold text-destructive-foreground">
                            7
                        </span>
                    </button> */}

                    <div className="[--shell-chrome-foreground:var(--foreground)]">
                        <ProfileDropdown />
                    </div>
                </div>
            </div>
        </header>
    )
}

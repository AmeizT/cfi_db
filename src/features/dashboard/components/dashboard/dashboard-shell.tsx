import type { ReactNode } from "react"
import Link from "next/link"
import {
  Bell,
  ChevronDown,
  FileText,
  LayoutGrid,
  Search,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface DashboardShellProps {
  children: ReactNode
  activeItem?: "dashboard" | "reports" | "members" | "notifications"
}

const railItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { id: "reports", label: "Report Wizard", href: "/reports", icon: FileText },
  { id: "members", label: "Members", href: "/members", icon: Users },
  {
    id: "notifications",
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
] as const

export function DashboardShell({
  children,
  activeItem = "dashboard",
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-white text-[#1b1c27] antialiased">
      <header className="flex h-14 items-center justify-between bg-[#201c4f] px-3 sm:px-5">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-white/[0.08] px-3 py-1.5 text-sm font-semibold text-white outline-none transition hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span className="flex size-[22px] items-center justify-center rounded-md bg-[#6c5ce7] text-xs font-bold">
            O
          </span>
          <span className="hidden sm:inline">Orwetoveni</span>
          <ChevronDown className="size-3" strokeWidth={2.5} />
        </button>

        <button
          type="button"
          className="mx-3 flex max-w-[560px] flex-1 items-center gap-2.5 rounded-lg bg-white/[0.08] px-3.5 py-2 text-left text-[13.5px] text-white/55 outline-none transition hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-white/70 sm:mx-8"
        >
          <Search className="size-[15px]" />
          <span>Search...</span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-white/75 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <Bell className="size-[18px]" />
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-3.5rem)] items-stretch">
        <aside className="flex w-16 shrink-0 flex-col items-center gap-[22px] bg-[#201c4f] py-[18px]">
          {railItems.map((item) => {
            const Icon = item.icon
            const active = item.id === activeItem

            return (
              <Link
                key={item.id}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  "flex size-[34px] items-center justify-center rounded-lg text-white/55 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70",
                  active && "bg-white/[0.12] text-white"
                )}
              >
                <Icon className="size-[19px]" />
              </Link>
            )
          })}

          <div className="flex-1" />
          <button
            type="button"
            aria-label="Open user menu"
            className="flex size-8 items-center justify-center rounded-lg bg-[#6c5ce7] text-[13px] font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            N
          </button>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

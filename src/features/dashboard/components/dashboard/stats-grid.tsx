import { ArrowDown, ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { dashboardStats, type DashboardStat } from "../../lib/dashboard-data"

const badgeStyles: Record<
  NonNullable<DashboardStat["badge"]>["tone"],
  string
> = {
  healthy: "bg-[#e7f6ee] text-[#1b8a5a]",
  stable: "bg-[#eaf1fe] text-[#2f6fed]",
  strained: "bg-[#fdf1de] text-[#b5690f]",
  critical: "bg-[#fbeceb] text-[#c4362b]",
}

export function StatsGrid() {
  return (
    <div className="mb-11 grid grid-cols-1 gap-3.5 sm:grid-cols-2 min-[821px]:grid-cols-3">
      {dashboardStats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-[14px] border border-[#d7d6e3] bg-white px-[22px] py-5"
        >
          <p className="mb-3.5 text-[13px] font-medium text-[#4b4d5c]">
            {stat.label}
          </p>

          <div className="flex flex-wrap items-baseline gap-2.5">
            {stat.badge && (
              <span
                className={cn(
                  "rounded-lg px-3 py-1 text-[15px] font-extrabold tracking-[0.03em]",
                  badgeStyles[stat.badge.tone]
                )}
              >
                {stat.badge.label}
              </span>
            )}

            {stat.value && (
              <span className="text-[26px] font-bold text-[#1b1c27]">
                {stat.value}
              </span>
            )}

            {stat.inlineNote && (
              <span className="text-[12.5px] text-[#8b8d9c]">
                {stat.inlineNote}
              </span>
            )}
          </div>

          {stat.trend && (
            <div
              className={cn(
                "mt-1.5 flex items-center gap-1 text-[12.5px]",
                stat.trend.direction === "up" && "text-[#1b8a5a]",
                stat.trend.direction === "down" && "text-[#c4362b]",
                stat.trend.direction === "neutral" && "text-[#8b8d9c]"
              )}
            >
              {stat.trend.direction === "up" && (
                <ArrowUp className="size-[11px]" strokeWidth={3} />
              )}
              {stat.trend.direction === "down" && (
                <ArrowDown className="size-[11px]" strokeWidth={3} />
              )}
              {stat.trend.label}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

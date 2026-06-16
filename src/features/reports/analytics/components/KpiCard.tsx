import { TrendBadge } from "./TrendBadge"
import { KPIItem } from "../types/analytics.types"
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps extends React.HTMLAttributes<HTMLAnchorElement> {
    item: KPIItem
}



export function KpiCard({ item, ...rest }: KpiCardProps) {
    return (
        <Link 
            {...rest} 
            href={item.pathname ?? "#"} 
            className={cn(
                "group rounded-xl border-0 border-border-subtle flex flex-col items-start", 
                "relative overflow-hidden data-[active=true]:text-primary",
                // "before:absolute before:inset-0 before:bg-linear-to-b",
                // "before:from-black/0 before:from-30% before:to-black/2",
                // "shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.05),0_2px_2px_-1px_rgba(229,231,235),0_4px_4px_-2px_rgba(229,231,235),0_0_0_1px_rgba(229,231,235)]",
                rest.className
            )}
        >
            <div className="w-fit flex flex-col items-start">
                <div className="order-2 flex justify-between items-center mb-1">
                    <span className="text-[13px] text-muted font-medium">
                        {item.label}
                    </span>

                    <TrendBadge value={item.trend || 0} />
                </div>

                <div className="group-hover:text-primary text-xl md:text-4xl font-bold text-gray-800 transition-colors">
                    {item.value}
                </div>
            </div>
        </Link>
    )
}
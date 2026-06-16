import React from "react"
import { format } from "date-fns"
import { AddCircle } from "iconsax-reactjs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import { useQueryString } from "@/hooks/use-query-string"
import { getYears } from "@/utils/get-years"
import { Separator } from "@/components/ui/separator"
import { useQueryParams } from "../hooks/use-delete-params"
import { cn } from "@/lib/utils"

interface ReportFiltersProps {
    statusQuery: string | null
    yearQuery: string | null
    monthQuery: string | null
}

export function ReportFilters({ statusQuery, yearQuery, monthQuery }: ReportFiltersProps){
    const router = useRouter()
    const pathname = usePathname()
    const [searchTerm, setSearchTerm] = React.useState("")

    const statuses = [
        {
            label: "All",
            value: "All"
        },
        {
            label: "Draft",
            value: "draft"
        },
        {
            label: "Finalized",
            value: "finalized"
        }
    ]

    const months = [
        { label: "All", value: "All" },
        ...Array.from({ length: 12 }, (_, i) => ({
            label: format(new Date(2025, i, 1), "MMMM"),
            value: String(i + 1),
        })),
    ];
        
    const { createQueryString } = useQueryString()
    const years = [...getYears(2023)]

    const hasActiveFilters = !!(statusQuery || monthQuery)
    const { clearAllParams } = useQueryParams()

    const triggerClasses = "pl-1 pr-2 py-1 flex items-center gap-x-1 rounded-full border border-dashed border-gray-300 dark:border-neutral-700 font-semibold text-sm lg:text-xs text-gray-600"

    return (
        <div className="w-full lg:w-fit flex flex-wrap gap-x-2 gap-y-1">
            <DropdownMenu>
                <DropdownMenuTrigger className={triggerClasses}>
                    <AddCircle className="size-4 text-gray-500" variant="Bulk" /> Status {statusQuery &&
                        <React.Fragment>
                            <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-3/4 bg-gray-300 dark:bg-neutral-700" />
                            <span className="capitalize text-primary font-bold">{statusQuery}</span>
                        </React.Fragment>
                    }
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        Filter by: status
                    </DropdownMenuLabel>
                    {statuses?.map(status => (
                        <DropdownMenuItem key={status.label}>
                            <button className="w-full flex items-center justify-between rounded-md" onClick={() => {
                                router.push(pathname + "?" + createQueryString("status", status.value))
                            }}
                            >
                                {status.label}
                            </button>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger className={triggerClasses}>
                    <AddCircle className="size-4 text-gray-500" variant="Bulk" /> Month
                    {monthQuery && (
                        <React.Fragment>
                            <Separator
                                orientation="vertical"
                                className="mx-0.5 data-[orientation=vertical]:h-3/4 bg-gray-300 dark:bg-neutral-700"
                            />
                            <span className="capitalize text-primary font-bold">
                                {format(new Date(2025, Number(monthQuery) - 1, 1), "MMMM")}
                            </span>
                        </React.Fragment>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {months?.map(month => (
                        <DropdownMenuItem key={month.label}>
                            <button className="w-full flex items-center justify-between rounded-md" onClick={() => {
                                router.push(pathname + "?" + createQueryString("month", String(month.value)))
                            }}
                            >
                                {month.label}
                            </button>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger className={triggerClasses}>
                    <AddCircle className="size-4 text-gray-500" variant="Bulk" /> Year
                    {yearQuery &&
                        <React.Fragment>
                            <Separator orientation="vertical" className="mx-0.5 data-[orientation=vertical]:h-3/4 bg-gray-300 dark:bg-neutral-700" />
                            <span className="capitalize text-primary font-bold">{yearQuery}</span>
                        </React.Fragment>
                    }
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        Filter by: year
                    </DropdownMenuLabel>
                    {years?.map(year => (
                        <DropdownMenuItem key={year}>
                            <button className="w-full flex items-center justify-between rounded-md" onClick={() => {
                                router.push(pathname + "?" + createQueryString("year", String(year)))
                            }}
                            >
                                {year}

                            </button>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="space-y-2 hidden">
                <Label hidden htmlFor="search">Search Assembly</Label>
                <Input
                    id="search"
                    placeholder="Search by assembly name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {hasActiveFilters ? (
                <div className="flex items-center gap-2">
                    <Separator orientation="vertical" className="data-[orientation=vertical]:h-3/5 bg-gray-300 dark:bg-neutral-700" />
                    <button onClick={() => router.push(pathname + "?" + clearAllParams())} className={cn(triggerClasses, "px-2 text-sm text-primary font-semibold border-none bg-primary/10")} >
                        Clear filters
                    </button>
                </div>
            ) : null}
        </div>
    )
}
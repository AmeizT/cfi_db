import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { buildTab } from "@/utils/build-tab"
import { parseTab } from "@/utils/parse-tab"
import Link from "next/link"
import { HiCalendarDays } from "react-icons/hi2"
import { ChevronDown } from "lucide-react";

import { usePathname, useSearchParams } from "next/navigation"
import { createQueryString } from "../../core/lib/create-query-string"
import { CalendarIcon } from "@solar-icons/react/bold-duotone/calendar";

const START_YEAR = 2023

export const yearOptions = (() => {
    const now = new Date()
    const currentYear = now.getFullYear()

    return Array.from(
        { length: currentYear - START_YEAR + 1 },
        (_, index) => {
            const year = currentYear - index
            const yearsAgo = currentYear - year

            let label: string

            if (yearsAgo === 0) {
                label = `${year}`
            } else {
                label = `${year}`
            }

            return {
                year,
                value: `year:${year}`,
                label,
                query: {
                    period: `year:${year}`,
                },
                isCurrent: yearsAgo === 0,
            }
        }
    )
})()

export function PeriodSelector() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentYear = new Date().getFullYear().toString()
    const period = searchParams.get("period") ?? buildTab("year", currentYear)
    const { sub: year } = parseTab(period)

    const selectedOption = yearOptions.find((option) => option.year.toString() === year)

    function buildLink(optionValue: string) {
        const newQuery = createQueryString(searchParams, { 
            id: null,
            period: buildTab("year", optionValue),
            page: 1,
        })

        return `${pathname}?${newQuery}`
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="border-0 border-border [&_svg:not([class*='size-'])]:size-5 justify-between px-1.5 gap-3 has-[>svg]:px-1.5">
                    <div className="flex gap-1.5 items-center">
                        <CalendarIcon /> {selectedOption?.label || `Select Year`}
                    </div> 

                    <span className="pr-0 size-6 flex justify-center items-center">
                        <ChevronDown strokeWidth={2.5} className="size-4.5 text-user-theme-100" />
                    </span>
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent>
                {yearOptions.map((option) => {
                    const isSelected = option.year.toString() === year

                    return (
                        <DropdownMenuItem key={option.value} asChild>
                            <Link href={buildLink(option.year.toString())}>
                                <span 
                                    className={cn(
                                        "size-4.5 relative rounded-full border border-border mr-2 shrink-0 after:absolute after:size-2 after:bg-transparent after:rounded-full after:inset-1/2 after:-translate-x-1/2 after:-translate-y-1/2",
                                        isSelected ? "border-primary bg-primary after:bg-theme-50" : "bg-transparent"
                                    )} 
                                />
                                {option.label}
                            </Link>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

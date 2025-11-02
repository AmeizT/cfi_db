import React from "react"
import Link from "next/link"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

interface DateSelectorProps {
    date: string
    isDisabled: boolean
    type: "previous" | "next"
}

export function DateSelector({ date, isDisabled, type }: DateSelectorProps ){
    return (
        <Link href={`/finance/cashflow?${date}`} className={`size-9 lg:size-7 flex justify-center items-center rounded-lg ${isDisabled ? "pointer-events-none text-body-foreground opacity-50 border border-gray-300 dark:border-neutral-700" : "pointer-events-auto text-body bg-gray-100 dark:bg-neutral-700 dark:text-white"} transition-colors`} aria-disabled={isDisabled}>
            {type === "next" ? 
                <IconChevronRight className="size-6 lg:size-4" /> : 
                <IconChevronLeft className="size-6 lg:size-4" />
            }
        </Link>
    )
}
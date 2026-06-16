import { format } from "date-fns"
import { useReports } from "../hooks/use-reports"
import { useRouter, useSearchParams } from "next/navigation"
import { Item } from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import React from "react"

export function ReportSelector() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const period = searchParams.get("period") ?? undefined
    const currentYear = format(new Date(), "yyyy")
    const selectedPeriod = period || currentYear

    const { data, isLoading } = useReports({ year: selectedPeriod })

    const initYear = 2023

    const years = Array.from(
        { length: new Date().getFullYear() - initYear + 1 },
        (_, i) => (initYear + i).toString()
    )

    const createQueryString = React.useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null) {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })

            return params.toString()
        },
        [searchParams]
    )

    const emptyState = !data?.length

    return (
        <Item>
            <ul className="flex flex-col">
                {years.map(year => {
                    const isActive = year === selectedPeriod

                    return (
                        <li key={year}>
                            <button
                                onClick={() => {
                                    router.push(
                                        `/reports?${createQueryString({
                                            period: year,
                                        })}`
                                    )
                                }}
                                className={`px-4 py-2 rounded text-4xl font-bold ${isActive ? "text-gray-800" : "text-gray-300"}`}>
                                {year}
                            </button>
                        </li>
                    )
                })}
            </ul>

            <Separator orientation="vertical" className="mx-4 bg-gray-300" />

            <React.Fragment>
                {!emptyState ? (
                    <ul>
                        {data?.map(report => (
                            <li key={report?.id}>
                                <button
                                    onClick={() => {
                                        router.push(
                                            `/reports/stats?rid=${report?.id}&view=details&tab=attendance&period=${selectedPeriod}`
                                        )
                                    }}
                                >
                                    {format((report?.period_start), "MMMM")}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        No report for {selectedPeriod}
                    </div>
                )}
            </React.Fragment>
        </Item>
    )
}
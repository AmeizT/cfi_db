"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { parsePeriod } from "@/layouts/navigation/helpers/parse-period"
import { useReports } from "../../core/hooks/use-reports"
import { ReportNavigatorItem } from "./ReportNavigatorItem"
import { ReportStatus } from "../types/status.types"
import { Separator } from "@/components/ui/separator"
import { Flex } from "@/components/ui/box"
import { AssemblyReport } from "@/dal/types";

type FilterKey = "all" | ReportStatus

export function ReportNavigator() {
    const searchParams = useSearchParams()
    const [filter, setFilter] = useState<FilterKey>("all")
    const period = parsePeriod(searchParams.get("period") || "")
    const year = String(period?.type === "year" ? period.value : undefined)
    const { data: reports } = useReports({ year })

    const filtered = useMemo(() => {
        const reportData = reports?.data ?? []

        return filter === "all"
            ? reportData
            : reportData.filter((r: AssemblyReport) => r.status === filter)
    }, [filter, reports])

    const isActive = (pkey: string) => searchParams.get("reportid") === pkey

    return (
        <Flex
            gap={3}
            direction="column"
            className="w-full h-fit no-scrollbar"
        >
            <Flex gap={1} justify={"start"} className="w-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden"
            >
                {filtered?.map((report: AssemblyReport, index: number) => (
                    <ReportNavigatorItem
                        key={report.id}
                        index={index}
                        report={report}
                        isActive={isActive(String(report.id))}
                    />
                ))}
            </Flex>

            <Separator className="w-full hidden bg-border-subtle" />
        </Flex>
    )
}

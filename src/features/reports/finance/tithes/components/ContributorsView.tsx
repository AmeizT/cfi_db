"use client"

import * as React from "react"
import Link from "next/link"
import { DownloadCircle01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { apiRoutes } from "@/config/urls"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { DataTablePaginationProps } from "@/features/reports/core/components/DataTable.types"
import { formatCurrency } from "@/utils"
import { useUser } from "@/hooks/query/use-user"
import { useSearchParams } from "next/navigation"
import type { ContributorMeta, ContributorRecord } from "../types"
import { toNumber } from "../utils/formatters"
import { buildTithesActionQuery } from "../utils/queryBuilders"
import { EmptyState } from "./EmptyState"

type ContributorTableRow = ContributorRecord & { id: number }
type ContributorHistoryTableRow = ContributorRecord["history"][number] & { id: number }

function getContributorRowId(row: ContributorRecord, index: number) {
    return row.member_id ?? -(index + 1)
}

function getHistoryConfig(config?: TableSchema): TableSchema | undefined {
    if (!config?.children?.columns?.length) return undefined

    return {
        intent: config.intent,
        columns: config.children.columns,
        variant: config.variant,
    }
}

function getFilenameFromContentDisposition(header: string | null) {
    if (!header) return null

    const utf8Filename = header.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8Filename?.[1]) {
        return decodeURIComponent(utf8Filename[1].replace(/["]/g, ""))
    }

    const filename = header.match(/filename="?([^";]+)"?/i)
    return filename?.[1] ?? null
}

function downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}

function getSelectedPeriodSuffix(searchParams: URLSearchParams, meta?: ContributorMeta) {
    const period = searchParams.get("period")

    if (period?.startsWith("year:")) {
        return period.split(":", 2)[1]
    }

    if (period?.startsWith("month:")) {
        return period.split(":", 2)[1]
    }

    const year = searchParams.get("year") ?? (meta?.period?.year ? String(meta.period.year) : "")
    const month = searchParams.get("month")

    if (year && month) {
        return `${year}-${month.padStart(2, "0")}`
    }

    return year
}

function getFallbackHistoryFilename(row: ContributorTableRow, searchParams: URLSearchParams, meta?: ContributorMeta) {
    const slug = row.contributor.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    const period = getSelectedPeriodSuffix(searchParams, meta)

    return `tithes-history-${slug || "contributor"}${period ? `-${period}` : ""}.pdf`
}

export function ContributorsView({
    rows,
    meta,
    isLoading,
    config,
    reportId,
    totalRows,
    pagination,
}: {
    rows: ContributorRecord[]
    meta?: ContributorMeta
    isLoading: boolean
    config?: TableSchema
    reportId: string
    totalRows?: number
    pagination?: DataTablePaginationProps
}) {
    const { data: user } = useUser()
    const searchParams = useSearchParams()
    const language = user?.assembly?.locale
    const currency = user?.assembly?.currency
    const [pendingContributorId, setPendingContributorId] = React.useState<number | null>(null)
    const canExport = Boolean(
        user?.is_admin
        || user?.is_staff
        || user?.is_db_staff
        || user?.is_region_staff
    )
    const exportHref = React.useMemo(
        () => buildTithesActionQuery(
            new URLSearchParams(searchParams.toString()),
            apiRoutes.reports.tithes.contributorsPdf(reportId),
        ),
        [reportId, searchParams],
    )
    const tableRows = React.useMemo<ContributorTableRow[]>(
        () => rows.map((row, index) => ({
            ...row,
            id: getContributorRowId(row, index),
        })),
        [rows],
    )
    const historyConfig = React.useMemo(() => getHistoryConfig(config), [config])
    const downloadContributorHistoryPdf = React.useCallback(async (row: ContributorTableRow) => {
        if (!row.member_id) {
            toast.error("This contributor does not have a member record.")
            return
        }

        setPendingContributorId(row.member_id)

        try {
            const endpoint = buildTithesActionQuery(
                new URLSearchParams(searchParams.toString()),
                apiRoutes.reports.tithes.contributorHistoryPdf(reportId, row.member_id),
            )
            const response = await fetch(endpoint, { credentials: "include" })

            if (!response.ok) {
                throw new Error("Could not generate contribution history PDF.")
            }

            const blob = await response.blob()
            const filename = getFilenameFromContentDisposition(response.headers.get("Content-Disposition"))
                ?? getFallbackHistoryFilename(row, new URLSearchParams(searchParams.toString()), meta)

            downloadBlob(blob, filename)
            toast.success("Contribution history PDF downloaded.")
        } catch (error) {
            console.error(error)
            toast.error("Could not download contribution history PDF.")
        } finally {
            setPendingContributorId((current) => (current === row.member_id ? null : current))
        }
    }, [meta, reportId, searchParams])

    if (isLoading) {
        return <EmptyState>Loading tithe contributors...</EmptyState>
    }

    if (rows.length === 0) {
        return <EmptyState>No contributors have recorded tithes for this period.</EmptyState>
    }

    return (
        <div className="grid gap-4">
            <div className="flex justify-end">
                {canExport ? (
                    <Button asChild variant="outline" size="sm">
                        <Link href={exportHref}>
                            <HugeiconsIcon icon={DownloadCircle01Icon} strokeWidth={2} className="size-4" />
                            Download PDF
                        </Link>
                    </Button>
                ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-4">
                {[
                    ["Total Contributors", meta?.total_contributors ?? rows.length, "number"],
                    ["Cumulative Tithes", toNumber(meta?.cumulative_tithes), "currency"],
                    ["Average Contribution", toNumber(meta?.average_contribution), "currency"],
                    ["New Contributors", meta?.new_contributors ?? "-", "number"],
                ].map(([label, value, format]) => (
                    <div key={label} className="rounded-xl border border-border-subtle bg-card p-4">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="mt-2 text-xl font-semibold text-foreground">
                            {format === "currency" && typeof value === "number"
                                ? formatCurrency(value, { language, currency })
                                : value}
                        </p>
                    </div>
                ))}
            </div>

            <DataTable
                data={tableRows}
                config={config}
                enableDelete={false}
                totalRows={totalRows ?? tableRows.length}
                currentPage={pagination?.currentPage}
                pageSize={pagination?.pageSize}
                pageSizeOptions={pagination?.pageSizeOptions}
                onPageChange={pagination?.onPageChange}
                onPageSizeChange={pagination?.onPageSizeChange}
                showDefaultRowActions={false}
                showFilters={false}
                showRowActions
                showToolbar={false}
                rowActions={(row) => {
                    const isPending = pendingContributorId === row.member_id

                    return [{
                        label: isPending ? "Preparing PDF..." : "Download contribution history",
                        icon: DownloadCircle01Icon,
                        variant: "default",
                        disabled: pendingContributorId !== null || !row.member_id,
                        onClick: () => downloadContributorHistoryPdf(row),
                    }]
                }}
                expandedRow={(row) => {
                    const historyRows: ContributorHistoryTableRow[] = row.history.map((historyRow, index) => ({
                        ...historyRow,
                        id: Number(historyRow.month_number ?? index + 1),
                    }))

                    return (
                        <DataTable
                            data={historyRows}
                            config={historyConfig}
                            enableDelete={false}
                            options={{ pagination: false }}
                            showColumnVisibility={false}
                            showDefaultRowActions={false}
                            showExport={false}
                            showFilters={false}
                            showRowActions={false}
                            showToolbar={false}
                        />
                    )
                }}
            />
        </div>
    )
}

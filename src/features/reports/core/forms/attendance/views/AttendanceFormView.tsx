"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { apiRoutes } from "@/config/urls"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"
import { AttendanceGrid, attendanceMetrics, getSundays } from "../components/AttendanceGrid"
import { AttendanceDetailDrawer } from "../components/AttendanceDrawer"
import type { AttendanceRecord } from "../types/attendance"

const zeroMetrics = Object.fromEntries(attendanceMetrics.map((metric) => [metric, 0]))

export function serializeAttendanceRecord(record: AttendanceRecord): AttendanceRecord {
    return {
        id: record.id,
        timestamp: record.timestamp,
        service_type: record.service_type || "sunday",
        ...Object.fromEntries(attendanceMetrics.map((metric) => [metric, record[metric] ?? 0])),
        is_special_event: Boolean(record.is_special_event),
        special_event_name: record.is_special_event ? record.special_event_name || "" : "",
        preacher: record.preacher || "",
        sermon: record.sermon || "",
        scriptures: record.scriptures || "",
        weather: record.weather || null,
        notes: record.notes || "",
    } as AttendanceRecord
}

export default function AttendanceFormView({ period, reportId }: { period: string; reportId?: string | number | null }) {
    const [year, month] = period.split("-").map(Number)
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()
    const [edits, setEdits] = React.useState<Record<string, AttendanceRecord>>({})
    const [errors, setErrors] = React.useState<Record<string, string>>({})
    const [selected, setSelected] = React.useState<AttendanceRecord | null>(null)
    const queryKey = assemblyQueryKeys.key(assemblyId, "attendance", period, reportId ?? "draft")
    const query = useQuery<AttendanceRecord[]>({
        queryKey,
        enabled: Boolean(assemblyId),
        queryFn: async () => {
            const params = new URLSearchParams({ year: String(year), month: String(month), service_type: "sunday" })
            if (reportId) params.set("report", String(reportId))
            const response = await fetch(`${apiRoutes.attendance.list()}?${params}`, { credentials: "include" })
            if (!response.ok) throw new Error("Could not load attendance.")
            const body = await response.json()
            const loaded: AttendanceRecord[] = Array.isArray(body) ? body : body.results ?? []
            const existing = new Map(loaded.map((record) => [record.timestamp, record]))
            return getSundays(year, month).map((timestamp) => ({ ...zeroMetrics, service_type: "sunday", timestamp, ...existing.get(timestamp) } as AttendanceRecord))
        },
    })
    const records = React.useMemo(
        () => (query.data ?? getSundays(year, month).map((timestamp) => ({ ...zeroMetrics, service_type: "sunday", timestamp } as AttendanceRecord))).map((record) => edits[record.timestamp] ?? record),
        [edits, month, query.data, year],
    )
    const dirtyDates = React.useMemo(() => new Set(Object.keys(edits)), [edits])

    const saveEntries = React.useCallback(async (entries: AttendanceRecord[]) => {
        const response = await fetch(apiRoutes.attendance.batch(), {
            method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ period, report: reportId ? Number(reportId) : undefined, entries }),
        })
        const body = await response.json().catch(() => ({}))
        if (!response.ok) throw body
        return body
    }, [period, reportId])

    const mutation = useMutation({
        mutationFn: saveEntries,
        onSuccess: async (body) => {
            setEdits({})
            setErrors({})
            queryClient.setQueryData<AttendanceRecord[]>(queryKey, (current = []) => current.map((record) => body.records.find((saved: AttendanceRecord) => saved.timestamp === record.timestamp) ?? record))
            await Promise.all([queryClient.invalidateQueries({ queryKey }), queryClient.invalidateQueries({ queryKey: ["reports"] }), queryClient.invalidateQueries({ queryKey: ["reports-workflow"] }), queryClient.invalidateQueries({ queryKey: ["attendanceAnalytics"] })])
            toast.success(`${body.count} attendance ${body.count === 1 ? "week" : "weeks"} saved.`)
        },
        onError: (body: { message?: string; errors?: { entries?: Record<string, Record<string, string[] | string>> } }) => {
            const changed = records.filter((record) => dirtyDates.has(record.timestamp))
            const nextErrors: Record<string, string> = {}
            Object.entries(body.errors?.entries ?? {}).forEach(([index, values]) => {
                const messages = Object.values(values).flat().join(" ")
                const date = changed[Number(index)]?.timestamp
                if (date) nextErrors[date] = messages
            })
            setErrors(nextErrors)
            toast.error(body.message || "Could not save attendance. Your changes have been preserved.")
        },
    })

    const detailsMutation = useMutation({
        mutationFn: async (record: AttendanceRecord) => {
            const body = await saveEntries([
                serializeAttendanceRecord(record) as AttendanceRecord,
            ])
            return { body, timestamp: record.timestamp }
        },
        onSuccess: async ({ body, timestamp }) => {
            const saved = body.records?.find(
                (record: AttendanceRecord) => record.timestamp === timestamp
            )
            if (saved) {
                queryClient.setQueryData<AttendanceRecord[]>(queryKey, (current = []) =>
                    current.map((record) => record.timestamp === timestamp ? saved : record)
                )
            }
            setEdits((current) => {
                const next = { ...current }
                delete next[timestamp]
                return next
            })
            setErrors((current) => {
                const next = { ...current }
                delete next[timestamp]
                return next
            })
            await Promise.all([
                queryClient.invalidateQueries({ queryKey }),
                queryClient.invalidateQueries({ queryKey: ["reports"] }),
                queryClient.invalidateQueries({ queryKey: ["reports-workflow"] }),
                queryClient.invalidateQueries({ queryKey: ["attendanceAnalytics"] }),
            ])
            toast.success("Attendance details saved.")
        },
        onError: (body: { message?: string }) => {
            toast.error(body.message || "Could not save attendance details. Your changes are still open.")
        },
    })

    const updateRecord = (updated: AttendanceRecord) => {
        setEdits((current) => ({ ...current, [updated.timestamp]: updated }))
        setErrors((current) => { const next = { ...current }; delete next[updated.timestamp]; return next })
    }

    const changed = records.filter((record) => dirtyDates.has(record.timestamp))

    return (
        <div className="space-y-0">
            {query.isError ? (
                <p className="text-sm text-destructive">
                    Unable to load attendance for this reporting period.
                </p>
            ) : null}

            <AttendanceGrid
                year={year}
                month={month}
                records={records}
                dirtyDates={dirtyDates}
                errors={errors}
                disabled={mutation.isPending || detailsMutation.isPending || query.isLoading}
                updateRecord={updateRecord}
                openDetails={setSelected}
            />

            <div className="py-2 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    {changed.length} changed{" "}
                    {changed.length === 1 ? "week" : "weeks"}
                </p>

                <Button
                    type="button"
                    disabled={!changed.length || mutation.isPending}
                    onClick={() =>
                        mutation.mutate(
                            changed.map(
                                serializeAttendanceRecord
                            ) as AttendanceRecord[]
                        )
                    }
                >
                    {mutation.isPending ? (
                        <Loader2Icon className="size-4 animate-spin" />
                    ) : null}

                    Save attendance
                </Button>
            </div>

            <AttendanceDetailDrawer
                key={selected?.timestamp ?? "attendance-details-closed"}
                record={selected}
                close={() => setSelected(null)}
                saveRecord={async (record) => {
                    await detailsMutation.mutateAsync(record)
                }}
                isSaving={detailsMutation.isPending}
            />
        </div>
    )
}

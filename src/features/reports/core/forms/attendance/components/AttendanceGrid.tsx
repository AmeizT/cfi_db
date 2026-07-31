"use client"

import * as React from "react"
import type { AttendanceRecord } from "../types/attendance"

export function getSundays(year: number, month: number) {
    const sundays: string[] = []
    const date = new Date(Date.UTC(year, month - 1, 1))
    while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() + 1)
    while (date.getUTCMonth() === month - 1) {
        sundays.push(date.toISOString().slice(0, 10))
        date.setUTCDate(date.getUTCDate() + 7)
    }
    return sundays
}

export const attendanceMetrics = [
    "men", "women", "visitor_men", "visitor_women", "new_convert_men",
    "new_convert_women", "baptism_men", "baptism_women", "altar_call_men",
    "altar_call_women", "online_viewers", "volunteers_on_duty", "total_leaders_present",
] as const

type Props = {
    year: number
    month: number
    records: AttendanceRecord[]
    dirtyDates: Set<string>
    errors: Record<string, string>
    disabled?: boolean
    updateRecord: (record: AttendanceRecord) => void
    openDetails: (record: AttendanceRecord) => void
}

export function AttendanceGrid({ year, month, records, dirtyDates, errors, disabled, updateRecord, openDetails }: Props) {
    const sundays = React.useMemo(() => getSundays(year, month), [year, month])
    const recordMap = React.useMemo(() => Object.fromEntries(records.map((record) => [record.timestamp, record])), [records])
    const inputRefs = React.useRef<(HTMLInputElement | null)[][]>([])

    function move(event: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) {
        const movement: Record<string, [number, number]> = { ArrowDown: [1, 0], Enter: [1, 0], ArrowUp: [-1, 0], ArrowRight: [0, 1], ArrowLeft: [0, -1] }
        const delta = movement[event.key]
        if (!delta) return
        event.preventDefault()
        const nextRow = Math.max(0, Math.min(attendanceMetrics.length - 1, row + delta[0]))
        const nextCol = Math.max(0, Math.min(sundays.length - 1, col + delta[1]))
        inputRefs.current[nextCol]?.[nextRow]?.focus()
    }

    return (
        <div className="overflow-x-auto rounded-none border-0 border-black/7">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="border-t-0 border-border-subtle">
                        <th className="sticky left-0 top-0 z-30 min-w-48 border-b border-0 border-border-subtle py-4 text-left">
                            Metric
                        </th>
                        
                        {sundays.map((day) => <th key={day} className="sticky top-0 z-20 min-w-28 border-b border-border-subtle p-2 text-center">
                            <button 
                                type="button" 
                                className="font-semibold cursor-pointer hover:bg-surface transition-colors" 
                                onClick={() => openDetails(recordMap[day] ?? { timestamp: day } as AttendanceRecord)}
                            >
                                {new Date(`${day}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                            </button>
                            
                            <span className="mt-0 block text-[11px] font-normal text-muted-foreground">
                                {recordMap[day]?.id ? dirtyDates.has(day) ? "Unsaved changes" : "Saved" : "Not saved"}
                            </span>
                            
                            {errors[day] ? <span className="mt-1 block text-xs font-normal text-destructive" role="alert">{errors[day]}</span> : null}
                        </th>)}
                    </tr>
                </thead>

                <tbody>
                    {attendanceMetrics.map((metric, rowIndex) => (
                        <tr
                            key={metric}
                            className="border-b border-border-subtle"
                        >
                            <th className="sticky left-0 z-10 min-w-48 border-r border-border-subtle px-0 py-2 text-left text-sm font-medium capitalize">
                                {metric.replaceAll("_", " ")}
                            </th>

                            {sundays.map((day, colIndex) => {
                                const record =
                                    recordMap[day] ??
                                    ({
                                        timestamp: day,
                                    } as AttendanceRecord)

                                return (
                                    <td
                                        key={`${day}-${metric}`}
                                        className="min-w-28"
                                    >
                                        <input
                                            ref={(node) => {
                                                if (!inputRefs.current[colIndex]) {
                                                    inputRefs.current[colIndex] = []
                                                }

                                                inputRefs.current[colIndex][rowIndex] = node
                                            }}
                                            aria-label={`${metric.replaceAll("_", " ")} for ${day}`}
                                            type="number"
                                            min="0"
                                            step="1"
                                            disabled={disabled}
                                            className="w-full bg-transparent p-2 text-center outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
                                            value={record[metric] ?? 0}
                                            onChange={(event) =>
                                                updateRecord({
                                                    ...record,
                                                    [metric]: Math.max(
                                                        0,
                                                        Number(event.target.value) || 0
                                                    ),
                                                })
                                            }
                                            onKeyDown={(event) =>
                                                move(event, rowIndex, colIndex)
                                            }
                                        />
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

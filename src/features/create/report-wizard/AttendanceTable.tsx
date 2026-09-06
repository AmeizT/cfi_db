"use client"

import type { AttendanceData, AttendanceRow } from "../types"

type AttendanceTableProps = {
    title: string
    description: string
    rows: AttendanceRow[]
    weeks: string[]
    data: AttendanceData
    includeSpecialInTotal?: boolean
    showSpecialToggle?: boolean
    onToggleSpecial?: (checked: boolean) => void
    onChange: (row: string, week: string, value: string) => void
}

function sumRow(weeks: string[], values: Record<string, string>) {
    return weeks.reduce((sum, week) => sum + (Number(values[week]) || 0), 0)
}

export function AttendanceTable({
    title,
    description,
    rows,
    weeks,
    data,
    includeSpecialInTotal = false,
    showSpecialToggle = false,
    onToggleSpecial,
    onChange,
}: AttendanceTableProps) {
    const totalForWeek = (week: string) =>
        rows.reduce((sum, row) => {
            if (row.special && !includeSpecialInTotal) return sum
            return sum + (Number(data[row.key]?.[week]) || 0)
        }, 0)

    const grandTotal = weeks.reduce((sum, week) => sum + totalForWeek(week), 0)

    return (
        <>
            <div className="mb-[22px]">
                <h2 className="text-[22px] font-bold tracking-[-0.01em]">{title}</h2>
                <p className="mt-1 max-w-[60ch] text-sm leading-[1.5] text-muted-foreground">
                    {description}
                </p>
            </div>

            {showSpecialToggle && (
                <label className="mb-[18px] flex items-center gap-2.5 rounded-[10px] bg-muted px-3.5 py-3 text-[13px] text-muted-foreground">
                    <span className="relative h-5 w-[34px] shrink-0">
                        <input
                            type="checkbox"
                            checked={includeSpecialInTotal}
                            onChange={(event) => onToggleSpecial?.(event.target.checked)}
                            className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                        />
                        <span className="absolute inset-0 rounded-full bg-muted-foreground/20 transition peer-checked:bg-primary" />
                        <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-background shadow-sm transition peer-checked:translate-x-3.5" />
                    </span>
                    <span>Include new converts &amp; baptisms in the total attendance count</span>
                </label>
            )}

            <div className="overflow-x-auto rounded-[14px] border border-border bg-card text-card-foreground">
                <table className="w-full min-w-[760px] border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted">
                            <th className="px-4 py-3 text-left text-[11.5px] font-bold uppercase tracking-[0.03em] text-muted-foreground">
                                Metric
                            </th>
                            {weeks.map((week) => (
                                <th
                                    key={week}
                                    className="px-4 py-3 text-right text-[11.5px] font-bold uppercase tracking-[0.03em] text-muted-foreground"
                                >
                                    {week}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-right text-[11.5px] font-bold uppercase tracking-[0.03em] text-muted-foreground">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row) => {
                            const rowTotal = sumRow(weeks, data[row.key] ?? {})

                            return (
                                <tr key={row.key} className="border-b border-border last:border-b-0">
                                    <td className="whitespace-nowrap px-4 py-[11px] text-[13.5px] font-medium text-foreground">
                                        {row.label}
                                        {row.special && (
                                            <span className="font-normal text-muted-foreground"> (optional)</span>
                                        )}
                                    </td>
                                    {weeks.map((week) => (
                                        <td key={week} className="px-4 py-[11px] text-right">
                                            <input
                                                type="number"
                                                min={0}
                                                value={data[row.key]?.[week] ?? ""}
                                                onChange={(event) =>
                                                    onChange(row.key, week, event.target.value)
                                                }
                                                placeholder="—"
                                                className="w-16 rounded-[7px] border border-transparent bg-transparent px-2 py-1.5 text-right text-[13.5px] outline-none transition placeholder:font-semibold placeholder:text-muted-foreground hover:bg-muted focus:border-ring focus:bg-background focus:ring-4 focus:ring-ring/10"
                                            />
                                        </td>
                                    ))}
                                    <td className="px-4 py-[11px] text-right text-[13.5px] font-semibold">
                                        {rowTotal || "—"}
                                    </td>
                                </tr>
                            )
                        })}

                        <tr className="border-t-[1.5px] border-border bg-muted font-bold">
                            <td className="px-4 py-[11px] text-[13.5px]">
                                {showSpecialToggle ? "Total attendance" : "Total"}
                            </td>
                            {weeks.map((week) => (
                                <td key={week} className="px-4 py-[11px] text-right text-[13.5px]">
                                    {totalForWeek(week) || "—"}
                                </td>
                            ))}
                            <td className="px-4 py-[11px] text-right text-[13.5px]">
                                {grandTotal}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

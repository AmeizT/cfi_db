"use client";

import React, { useState, useRef, useEffect } from "react";
import { AttendanceRecord } from "../types/attendance";

export function getSundays(year: number, month: number) {
    const sundays: string[] = [];
    const date = new Date(year, month - 1, 1);

    // Move to the first Sunday in the month
    while (date.getDay() !== 0) {
        date.setDate(date.getDate() + 1);
    }

    // Add all Sundays in the month
    while (date.getMonth() === month - 1) {
        sundays.push(date.toISOString().split("T")[0]);
        date.setDate(date.getDate() + 7);
    }

    return sundays;
}

// Metrics
export const attendanceMetrics = [
    "men",
    "women",
    "visitor_men",
    "visitor_women",
    "new_convert_men",
    "new_convert_women",
    "baptism_men",
    "baptism_women",
    "altar_call_men",
    "altar_call_women",
    "online_viewers",
    "volunteers_on_duty",
    "total_leaders_present",
] as const;

// Props
type Props = {
    year: number;
    month: number;
    records: AttendanceRecord[];
    updateRecord: (record: AttendanceRecord) => Promise<void>;
    openDetails: (record: AttendanceRecord) => void;
};

export function AttendanceGrid({
    year,
    month,
    records,
    updateRecord,
    openDetails,
}: Props) {
    const sundays = getSundays(year, month);

    // Map for quick lookup
    const recordMap = Object.fromEntries(records.map((r) => [r.timestamp, r]));

    // Focus & refs
    const [, setActiveCell] = useState<{ row: number; col: number }>({ row: 0, col: 1 });
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

    useEffect(() => {
        inputRefs.current = sundays.map(() => attendanceMetrics.map(() => null));
    }, [sundays]);

    // Autosave states
    const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});

    const handleChange = async (rowIndex: number, colIndex: number, value: number) => {
        const metric = attendanceMetrics[rowIndex];
        const timestamp = sundays[colIndex];
        const record = recordMap[timestamp] ?? { timestamp };

        // Mark cell as saving
        const key = `${timestamp}-${metric}`;
        setSavingMap((prev) => ({ ...prev, [key]: true }));

        // Update backend (debounce if needed)
        await updateRecord({ ...record, [metric]: value, id: record.id });

        // Mark cell saved
        setSavingMap((prev) => ({ ...prev, [key]: false }));
    };

    // Handle keyboard navigation
    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
        let nextRow = row;
        let nextCol = col;

        switch (e.key) {
            case "ArrowDown":
                nextRow = Math.min(attendanceMetrics.length - 1, row + 1);
                break;
            case "ArrowUp":
                nextRow = Math.max(0, row - 1);
                break;
            case "ArrowRight":
                nextCol = Math.min(sundays.length - 1, col + 1);
                break;
            case "ArrowLeft":
                nextCol = Math.max(0, col - 1);
                break;
            case "Enter":
                nextRow = Math.min(attendanceMetrics.length - 1, row + 1);
                break;
            default:
                return;
        }

        e.preventDefault();
        setActiveCell({ row: nextRow, col: nextCol });
        inputRefs.current[nextCol]?.[nextRow]?.focus();
    };

    // Manual save per column (Sunday)
    const handleRowSave = async (colIndex: number) => {
        for (let rowIndex = 0; rowIndex < attendanceMetrics.length; rowIndex++) {
            const metric = attendanceMetrics[rowIndex];
            const timestamp = sundays[colIndex];
            const record = recordMap[timestamp] ?? { timestamp };

            const key = `${timestamp}-${metric}`;
            setSavingMap((prev) => ({ ...prev, [key]: true }));

            await updateRecord(record);

            setSavingMap((prev) => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th
                            className="p-2 font-semibold border-b border-r bg-muted sticky top-0 left-0 z-30 min-w-[200px]"
                        >
                            Metric
                        </th>
                        {sundays.map((d, colIndex) => (
                            <th
                                key={d}
                                className="p-2 font-semibold border-b bg-muted sticky top-0 z-20 min-w-[80px] text-center"
                            >
                                <div>
                                    <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                            openDetails(
                                                recordMap[d] ??
                                                Object.fromEntries(attendanceMetrics.map((m) => [m, 0]))
                                            )
                                        }
                                    >
                                        {new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                                    </span>
                                </div>
                                <button
                                    className="text-xs text-theme-600 mt-1"
                                    onClick={() => handleRowSave(colIndex)}
                                >
                                    Save
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {attendanceMetrics.map((metric, rowIndex) => (
                        <tr key={metric} className="border-b border-gray-200">
                            <th
                                className="p-2 font-medium border-r bg-gray-50 sticky left-0 z-20 min-w-[200px] text-left"
                            >
                                {metric.replace(/_/g, " ")}
                            </th>
                            {sundays.map((timestamp, colIndex) => {
                                const record = recordMap[timestamp] ?? { timestamp };
                                const key = `${timestamp}-${metric}`;
                                return (
                                    <td
                                        key={key}
                                        className="relative p-0 border-gray-200 min-w-[80px] text-center align-middle"
                                    >
                                        <input
                                            type="number"
                                            className="p-2 text-center w-full bg-transparent outline-none"
                                            value={record[metric] ?? 0}
                                            ref={(el) => {
                                                if (!inputRefs.current[colIndex]) {
                                                    inputRefs.current[colIndex] = [];
                                                }
                                                inputRefs.current[colIndex][rowIndex] = el;
                                            }}
                                            onFocus={() =>
                                                setActiveCell({ row: rowIndex, col: colIndex })
                                            }
                                            onChange={(e) =>
                                                handleChange(rowIndex, colIndex, Number(e.target.value))
                                            }
                                            onKeyDown={(e) => handleKey(e, rowIndex, colIndex)}
                                        />
                                        {savingMap[key] && (
                                            <span className="absolute top-0 right-1 text-xs text-gray-400 select-none pointer-events-none">
                                                Saving…
                                            </span>
                                        )}
                                        {!savingMap[key] && record.id && (
                                            <span className="absolute top-0 right-1 text-xs text-green-500 select-none pointer-events-none">
                                                ✓
                                            </span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

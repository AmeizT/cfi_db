import React from "react";
import { TableColumn } from "../types/analytics.types"

interface AnalyticsTableProps<T> {
    rows: T[]
    columns: TableColumn<T>[]
}

export function AnalyticsTable<T>({
    rows,
    columns,
}: AnalyticsTableProps<T>) {
    return (
        <table className="w-full">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={String(column.key)}>
                            {column.label}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        {columns.map((column) => (
                            <td key={String(column.key)}>
                                {column.render
                                    ? column.render(row)
                                    : (row[column.key as keyof T] as React.ReactNode)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
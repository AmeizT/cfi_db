"use client"
import React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { EditableCell } from "@/components/ui/editable-cell"
// import { SuperDataGrid } from "./DataGrid"
import VaulDrawer from "../components/AttendanceDraw"
import { StatsUploader } from "../components/StatsUploader"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"

type MockRow = {
    id: string
    name: string
    age: number
    email: string
    role: string
}

const MOCK_DATA: MockRow[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `row-${i + 1}`,
    name: `User ${i + 1}`,
    age: 20 + (i % 10),
    email: `user${i + 1}@example.com`,
    role: ["Admin", "Editor", "Viewer"][i % 3],
}))


function updateRow<K extends keyof MockRow>(
    rowIndex: number,
    columnId: K,
    value: MockRow[K]
) {
    MOCK_DATA[rowIndex][columnId] = value
    console.log("Updated row:", MOCK_DATA[rowIndex])
}

export const COLUMNS: ColumnDef<MockRow>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row, getValue }) => {
            const value = getValue<string>()
            return (
                <EditableCell<MockRow, "name"> 
                    value={value}
                    rowIndex={row.index}
                    columnId="name"
                    onSave={updateRow}
                />
            )
        },
    },
    {
        accessorKey: "age",
        header: "Age",
        cell: ({ row, getValue }) => {
            const value = getValue<number>()
            return (
                <EditableCell<MockRow, "age">
                    value={value}
                    rowIndex={row.index}
                    columnId="age"
                    onSave={updateRow}
                />
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row, getValue }) => {
            const value = getValue<string>()
            return (
                <EditableCell<MockRow, "email">
                    value={value}
                    rowIndex={row.index}
                    columnId="email"
                    onSave={updateRow}
                />
            )
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row, getValue }) => {
            const value = getValue<string>()
            return (
                <EditableCell<MockRow, "role">
                    value={value}
                    rowIndex={row.index}
                    columnId="role"
                    onSave={updateRow}
                />
            )
        },
    },
]


export default function DemoTablePage() {
    const [data, setData] = React.useState(MOCK_DATA)

    const handleCellEdit = (rowIndex: number, columnId: string, value: unknown) => {
        setData((prev) => {
            const newData = [...prev]
            newData[rowIndex] = { ...newData[rowIndex], [columnId]: value }
            return newData
        })
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Super Table Demo (20 rows)</h2>
            
            <div className="h-fit flex items-center gap-2">
                <Button asChild variant="outline" className="h-fit">
                    <Link
                        href="http://localhost:8000/api/v1/people/attendance/download_template/"
                    >
                        <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="size-4.5" />
                        Download Template
                    </Link>
                </Button>

                <StatsUploader />

                <VaulDrawer />
            </div>

            {/* <SuperDataGrid
                data={data}
                columns={COLUMNS}
                rowHeight={36}
                onCellEdit={handleCellEdit}
                
            /> */}
        </div>
    )
}


"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const columnTypes = {
    weather: (value: string) => {
        const map: Record<string, string> = {
            sunny: "☀️",
            cloudy: "☁️",
            rainy: "🌧️",
            snowy: "❄️",
        }
        return `${map[value] ?? ""} ${value}`
    },
}

type RecordDrawerProps<T> = {
    rowData: T | null
    open: boolean
    onClose: () => void
    onUpdateRow: (updatedRow: T) => void
    displayKeys?: (string)[]
}

export function RecordDrawer<T extends Record<string, unknown>>({
    rowData,
    open,
    onClose,
    onUpdateRow,
    displayKeys,
}: RecordDrawerProps<T>) {

    const [editableData, setEditableData] = React.useState<T | null>(rowData)

    React.useEffect(() => {
        setEditableData(rowData)
    }, [rowData])

    if (!editableData) return null

    const keysToDisplay = displayKeys ?? Object.keys(editableData)

    const handleChange = (key: keyof T, value: unknown) => {
        setEditableData(prev => prev ? { ...prev, [key]: value } : prev)
    }

    const handleSave = () => {
        if (editableData) onUpdateRow(editableData)
        onClose()
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-100">
                <SheetHeader>
                    <SheetTitle>Details</SheetTitle>
                    <SheetDescription>Editable row details</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-3 mt-4">
                    {keysToDisplay.map((key) => {
                        const value = editableData[key]
                        if (value === undefined) return null

                        let displayValue: unknown = value
                        if (key.toString().toLowerCase().includes("weather") && typeof value === "string") {
                            displayValue = columnTypes.weather(value)
                        }

                        return (
                            <div key={key.toString()} className="flex flex-col gap-1">
                                <Label className="font-semibold capitalize">{key.toString().replace(/_/g, " ")}:</Label>
                                <Input
                                    value={String(displayValue)}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                />
                            </div>
                        )
                    })}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <SheetClose asChild>
                        <button className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    </SheetClose>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-theme-500 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
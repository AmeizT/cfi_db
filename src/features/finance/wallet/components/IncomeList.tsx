import { formatCurrency } from "@/utils/currency"
import { useFinanceSummary } from "../hooks/use-finance-summary"
import { Skeleton } from "@/components/ui/skeleton"
import React, { useState } from "react"

interface IncomeListProps {
    ref: React.RefObject<HTMLDivElement | null>,
    editMode?: "income" | "expenses" | null
}

export function IncomeList({ ref, editMode }: IncomeListProps){
    const { data: finance, isLoading } = useFinanceSummary()

    console.log("finance", finance)
    
    const income = [
        { name: "Tithes", amount: finance?.totals?.totalTithes },
        { name: "Offering", amount: finance?.income?.breakdown?.offering },
        { name: "Thanksgiving", amount: finance?.income?.breakdown?.thanksgiving },
        { name: "Fundraising", amount: finance?.income?.breakdown?.fundraising },
        { name: "Donations", amount: finance?.income?.breakdown?.donations },
        { name: "Total", amount: finance?.totals?.totalIncome },
    ]

    const [editedIncome, setEditedIncome] = useState(
        income.map(item => ({ name: item.name, amount: item.amount || 0 }))
    )

    const [isEditing, setIsEditing] = useState(editMode?.includes("income"))

    const handleAmountChange = (index: number, value: string) => {
        const newAmount = parseFloat(value) || 0
        setEditedIncome(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], amount: newAmount }
            return updated
        })
    }

    const handleSaveChanges = () => {
        // Placeholder function to handle save action
        // Implement save logic here
        console.log("Saved income changes:", editedIncome)
        setIsEditing(false)
    }

    return (
        <div ref={ref} aria-label="Income" aria-describedby="Monthly Income" className="w-full min-h-[597px] flex flex-col gap-y-0 rounded-l-3xl border-r border-zinc-200 dark:border-neutral-700">
            <div className="px-3 xl:px-4 h-16 flex items-center text-body text-sm font-semibold rounded-t-md border-b">
                <span className="px-4 py-1 bg-green-500/10 text-green-500 rounded-full">
                    Income
                </span>

                
                {editMode && (
                    <button
                        className="ml-auto text-green-500 font-semibold hover:underline"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>

            <div className="w-full pb-0">
                <div
                    role="table"
                    aria-label="Income"
                    aria-describedby="Monthly Income Table">
                    <div role="rowgroup" className="hidden">
                        <div role="row">
                            <span role="columnheader" aria-sort="ascending"></span>
                            <span role="columnheader" aria-sort="none"></span>
                        </div>
                    </div>

                    <div role="rowgroup" className="px-4">
                        {income?.map((item, index) => (
                            <div key={index} role="row" className="py-4 w-full h-24 flex flex-col justify-center gap-y-1 last:border-b-0 border-b border-dashed border-zinc-200 dark:border-neutral-700">
                                {isLoading ? (
                                    <Skeleton className="h-3 w-[250px]" />
                                ) : (
                                    <span role="cell" className="text-left text-sm text-body-muted">
                                        {item.name}
                                    </span>
                                )}

                                {isLoading ? (
                                    <Skeleton className="h-6 w-[250px]" />
                                ) : isEditing ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        
                                        onChange={(e) => handleAmountChange(index, e.target.value)}
                                        className="border border-zinc-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-left text-2xl font-bold font-geist"
                                        defaultValue={item?.amount}
                                    />
                                ) : (
                                    <span role="cell" className="text-left text-2xl font-bold font-geist">
                                        {formatCurrency(
                                            finance?.locale?.language,
                                            finance?.locale?.currency,
                                            item.amount || 0)
                                        }
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="mt-6 px-4 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    )
}
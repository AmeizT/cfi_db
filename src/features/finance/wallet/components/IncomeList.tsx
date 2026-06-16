import { formatCurrency } from "@/utils/currency"
import { useFinanceSummary } from "../hooks/use-finance-summary"
import { Skeleton } from "@/components/ui/skeleton"
import React, { useState } from "react"

interface IncomeListProps {
    ref?: React.RefObject<HTMLDivElement | null>,
    editMode?: "income" | "expenses" | null
}

export function IncomeList({ editMode }: IncomeListProps){
    const { data: finance, isLoading } = useFinanceSummary()
    
    const income = [
        { name: "Tithes", amount: finance?.totals?.totalTithes },
        { name: "Offering", amount: finance?.income?.breakdown?.offering },
        { name: "Thanksgiving", amount: finance?.income?.breakdown?.thanksgiving },
        { name: "Fundraising", amount: finance?.income?.breakdown?.fundraising },
        { name: "Donations", amount: finance?.income?.breakdown?.donations },
        { name: "Total Income", amount: finance?.totals?.totalIncome },
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
        <div aria-label="Income" aria-describedby="Monthly Income" className="w-full h-fit flex flex-col gap-y-0">
            

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

                    <div role="rowgroup" className="">
                        {income?.map((item, index) => (
                            <div key={index} role="row" className="py-4 w-full h-10 flex justify-between items-center gap-y-1 last:border-b-0 border-b border-dashed border-slate-200 dark:border-neutral-700">
                                {isLoading ? (
                                    <Skeleton className="h-3 w-[250px]" />
                                ) : (
                                    <span role="cell" className="text-left text-sm">
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
                                    <span role="cell" className={`text-left text-sm font-bold font-geist`}>
                                        {formatCurrency(item.amount || 0, {
                                            language: finance?.locale?.language || "en-US",
                                            currency: finance?.locale?.currency || "USD",
                                        })}
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
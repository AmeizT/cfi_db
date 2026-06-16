"use client"

import { TrendingUp } from "lucide-react"
import { useFinanceSummary } from "../../wallet/hooks/use-finance-summary"
import { CashflowRow } from "./CashflowRow"
import { formatCurrency } from "@/utils"
import React from "react"
import { CashflowListSkeleton } from "./CashflowListSkeleton"

interface IncomeListProps {
    ref: React.RefObject<HTMLDivElement | null>
}

export function IncomeList({ ref }: IncomeListProps){
    const { data: finance, isLoading } = useFinanceSummary()
    const incomeList = finance?.incomeList
    const language = finance?.locale?.language
    const currency = finance?.locale?.currency

    return (
        <section
            ref={ref}
            className="h-fit bg-white rounded-xl border border-green-200 overflow-hidden"
        >
            <div className="bg-linear-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Income</h2>
                            <p className="text-sm text-gray-600">{incomeList?.length} sources</p>
                        </div>
                    </div>
                    
                </div>
            </div>

            {!isLoading ? (
                <React.Fragment>
                    <div className="p-2 overflow-y-auto flex-1">
                        {incomeList?.map((item, index) => {
                            const name = item?.name
                            const amount = item?.amount
                            const percentage = item?.percentage
                            const previous = item?.previous
                            const trend = item?.trend

                            return (
                                <CashflowRow
                                    key={index}
                                    item={{
                                        name,
                                        amount,
                                        percentage,
                                        previous,
                                        trend,
                                    }}
                                    language={language}
                                    currency={currency}
                                    type="income"
                                />
                            )
                        })}
                    </div>

                    <div className="bg-green-50 border-t border-green-200 p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">Total Income</span>
                            <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(finance?.totals?.totalIncome || 0, {
                                    language,
                                    currency,
                                })}
                            </span>
                        </div>
                    </div>
                </React.Fragment>
            ) : (
                <CashflowListSkeleton />
            )}
        </section>
    )
}
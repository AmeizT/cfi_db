import React from "react"
import { TrendingDown } from "lucide-react"
import { CashflowRow } from "./CashflowRow"
import { formatCurrency } from "@/utils"
import { useFinanceSummary } from "../../wallet/hooks/use-finance-summary"
import { CashflowListSkeleton } from "./CashflowListSkeleton"

export function ExpenseList({ incomeHeight }: {incomeHeight: number}){
    const { data: finance, isLoading } = useFinanceSummary()
    const fixedExpenses = finance?.fixedExpensesList
    const language = finance?.locale?.language
    const currency = finance?.locale?.currency

    console.log(incomeHeight)

    return (
        <section
            className="bg-white rounded-xl border border-red-100 overflow-hidden flex flex-col"
            style={{ height: incomeHeight ? `${incomeHeight}px` : "auto" }}
        >
            <div className="bg-linear-to-r from-red-50 to-pink-50 p-6 border-b border-red-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Expenses</h2>
                            <p className="text-sm text-gray-600">{fixedExpenses?.length} categories</p>
                        </div>
                    </div>
                </div>
            </div>

            {!isLoading ? (
                <React.Fragment>
                    <div className="h-full p-2 overflow-y-auto flex-1">
                        {fixedExpenses?.map((expense, index) => {
                            const name = expense?.name
                            const amount = expense?.amount
                            const percentage = expense?.percentage
                            const previous = expense?.previous
                            const trend = expense?.trend

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
                                    type="expense"
                                />
                            )
                        })}
                    </div>

                    <div className="bg-red-50 border-t border-red-100 p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">
                                Total Expenses
                            </span>

                            <span className="text-2xl font-bold text-red-600">
                                {formatCurrency(finance?.totals?.totalExpenses || 0, {
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
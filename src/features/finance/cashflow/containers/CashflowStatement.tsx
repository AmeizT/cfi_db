"use client"

import React from "react"
import { useFinanceSummary } from "@/features/finance/wallet/hooks/use-finance-summary"
import { Button } from "@/components/ui/button"
import { ExpenseList } from "../components/ExpenseList"
import { IncomeList } from "../components/IncomeList"

export default function CashflowStatement() {
    const incomeContainerRef = React.useRef<HTMLDivElement>(null)
    const [incomeHeight, setIncomeHeight] = React.useState(0)
    const { data: finance, isLoading } = useFinanceSummary()

    React.useLayoutEffect(() => {
        const measure = () => {
            if (incomeContainerRef.current) {
                setIncomeHeight(incomeContainerRef.current.offsetHeight)
            }
        }

        // Initial measure + update on resize and data load
        measure()
        window.addEventListener("resize", measure)

        return () => window.removeEventListener("resize", measure)
    }, [finance])

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                            Cashflow Statement
                        </h1>
                        <p className="text-gray-600 hidden">
                            Track income and expenses for your organization
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button size="sm" variant="outline" className="">
                            Continue editing
                        </Button>
                    </div>
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <CashflowCard
                        variant="income"
                        lang={finance?.locale?.language || "en-US"}
                        currency={finance?.locale?.currency || "USD"}
                        amount={finance?.totals?.totalIncome || 0.00}
                        isLoading={isLoading}
                    >
                        <CashflowCard.Title>
                            Total Income
                        </CashflowCard.Title>
                        <div className="flex flex-col">
                            <CashflowCard.Amount />
                            <CashflowCard.Description>
                                +3.1% from last month
                            </CashflowCard.Description>
                        </div>
                        
                    </CashflowCard>

                    <CashflowCard
                        variant="expenses"
                        lang={finance?.locale?.language || "en-US"}
                        currency={finance?.locale?.currency || "USD"}
                        amount={finance?.totals?.totalExpenses || 0.00}
                        isLoading={isLoading}
                    >
                        <CashflowCard.Title>
                            Total Expenses
                        </CashflowCard.Title>
                        
                        <div className="flex flex-col">
                            <CashflowCard.Amount />
                            <CashflowCard.Description>
                                +5.2% from last month
                            </CashflowCard.Description>
                        </div>
                    </CashflowCard>

                    <CashflowCard
                        variant="balance"
                        lang={finance?.locale?.language || "en-US"}
                        currency={finance?.locale?.currency || "USD"}
                        amount={finance?.totals?.balance || 0.00}
                        isLoading={isLoading}
                    >
                        <CashflowCard.Title>
                            Balance
                        </CashflowCard.Title>
                        <div className="flex flex-col">
                            <CashflowCard.Amount />
                            <CashflowCard.Description>
                                Net after expenses
                            </CashflowCard.Description>
                        </div>
                    </CashflowCard>

                    <CashflowCard
                        variant="rolling"
                        lang={finance?.locale?.language || "en-US"}
                        currency={finance?.locale?.currency || "USD"}
                        amount={finance?.totals?.bookBalance || 0.00}
                        isLoading={isLoading}
                    >
                        <CashflowCard.Title>
                            Rolling Balance
                        </CashflowCard.Title>
                        <div className="flex flex-col">
                            <CashflowCard.Amount />
                            <CashflowCard.Description>
                                Balance brought forward
                            </CashflowCard.Description>
                        </div>
                    </CashflowCard>
                </div> */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <IncomeList ref={incomeContainerRef} />
                    <ExpenseList incomeHeight={incomeHeight} />
                </div>
            </div>
        </div>
    )
}

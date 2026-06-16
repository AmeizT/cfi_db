"use client"

import { IncomeList } from "../components/IncomeList"
import { ExpensesList } from "../components/ExpensesList"
import { EmptyState } from "@/components/ui/empty-state"
import { CashflowBalances } from "../components/CashflowBalances"

export function WalletContainer() {
    const emptyState = false
    
    return (
        <div className="flex flex-col gap-8">
            <div className="border-b-0 border-dashed border-slate-200">
                <h3 className="font-bold text-xl">
                    Cashflow overview
                </h3>
            </div>

            <div className="w-full flex gap-8">
                <div className="h-full flex flex-col grow gap-y-6 relative">
                    {!emptyState ? (
                        <div className="w-full flex flex-col gap-3 lg:gap-8 bg-white dark:bg-neutral-900">
                            {/* <IncomeSummary /> */}
                            <div className="flex">
                                <IncomeList />
                                <ExpensesList />
                            </div>
                        </div>
                    ) : (
                        <EmptyState type="assets" />
                    )}
                </div>

                <aside className="w-1/3 h-fit rounded-2xl bg-linear-to-b from-slate-50 to-slate-100/70">
                    <CashflowBalances />
                </aside>
            </div>
        </div>
        
    )
}
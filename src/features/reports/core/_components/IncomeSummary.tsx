import { CashflowCard } from "./CashflowCard"
import { Separator } from "@/components/ui/separator"
import { CashflowSummaryChart } from "./CashflowSummaryChart"
import { useFinanceSummary } from "@/features/finance/wallet/hooks/use-finance-summary"

export function IncomeSummary(){
    const { data: finance, isLoading } = useFinanceSummary()

    return (
        <div className="w-full grid grid-cols-1 justify-between gap-4">
            <div className="flex flex-col">
                <div className={`p-0 w-full h-auto grid grid-cols-1 grid-rows-[1fr_auto] justify-between gap-2 rounded-3xl bg-white`}>
                    <header className="px-4 py-2 hidden _flex flex-col items-start border-b-0 border-slate-200">
                        <h3 className="text-lg font-bold">Balance Overview</h3>
                        <p className="text-sm text-gray-500">
                            Snapshot of this month&apos;s income and spending
                        </p>
                    </header>

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
                                Monthly net of income (incl. tithes) and expenses
                            </CashflowCard.Description>
                        </div>
                    </CashflowCard>

                    <div className="w-full h-fit grid grid-cols-[1fr_1fr] justify-end gap-2">
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
                            <CashflowCard.Amount />
                        </CashflowCard>

                        <Separator decorative orientation="vertical" className="hidden bg-slate-200" />

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
                            <CashflowCard.Amount />
                        </CashflowCard>
                    </div>
                </div>
            </div>

            {/* <Separator orientation="vertical" className="hidden bg-slate-200" />

                <CashflowSummaryChart /> */}
        </div>
    )
}
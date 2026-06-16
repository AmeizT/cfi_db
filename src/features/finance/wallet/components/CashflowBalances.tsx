import { formatCurrency } from "@/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { useFinanceSummary } from "../hooks/use-finance-summary"

export function CashflowBalances(){
    const { data: finance, isLoading } = useFinanceSummary()
    const balances = {
        "Total Income": finance?.totals?.totalIncome,
        "Total Expenses": finance?.totals?.totalExpenses,
        "Net Income": finance?.totals?.balance,
        "Rolling Balance": finance?.totals?.bookBalance,
    }

    return (
        <div className="w-full flex flex-col xl:flex-row">
            <div className="px-4 w-full flex flex-col overflow-hidden">
                <div className="py-2 flex items-center border-b border-slate-200">
                    <h4 className="text-lg font-bold">
                        Balances
                    </h4>
                </div>

                <div className="w-full h-full flex flex-col overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="hidden">
                            <tr>
                                <th className="sr-only">
                                    Item
                                </th>
                                <th className="sr-only">
                                    Value
                                </th>
                            </tr>
                        </thead>

                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            <tbody className="w-full">
                                {Object?.entries(balances)?.map(([item, amount]) => (
                                    <tr key={item} className="border-b border-solid border-slate-200 h-10">
                                        <td className="capitalize text-sm">
                                            {item.replace(/_/g, " ")}
                                        </td>

                                        <td className="text-sm font-bold text-right font-geist">
                                            {formatCurrency(Number(amount) || 0, {
                                                language: finance?.locale?.language || "en-US",
                                                currency: finance?.locale?.currency || "USD",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}

                        <tfoot>
                            <tr className="h-10 border-y border-solid border-slate-200">
                                <td className="">% Expense to Income Ratio</td>
                                <td className="xl:w-1/6 text-right font-geist font-bold">
                                    {finance?.totals?.expenseToIncomeRatio}%
                                </td>
                            </tr>
                        </tfoot>
                    </table> 

                    <div className="py-2">
                        <p className="text-xs text-slate-500">Rolling Balance is the net amount carried forward from previous months.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TableSkeleton(){
    return (
        <tbody>
            {Array.from({ length: 14 }).map((_, index) => (
                <tr key={index} className="h-10 border-b border-dashed dark:border-neutral-700">
                    <td>
                        <Skeleton className="h-4 w-[250px]" />
                    </td>

                    <td>
                        <Skeleton className="h-4 w-[60px] ml-auto" />
                    </td>
                </tr>
            ))}
        </tbody>
    )
}
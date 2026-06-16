import { formatCurrency } from "@/utils"
import { useFinanceSummary } from "../hooks/use-finance-summary"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function ExpensesList(){
    const { data: finance, isLoading } = useFinanceSummary()
    const fixedExpenses = finance?.fixedExpenses || {}

    return (
        <div className="w-full flex flex-col xl:flex-row">
            <div className="w-full flex flex-col overflow-hidden">
                <div className="w-full h-full flex flex-col overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="hidden">
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>

                        {isLoading ? (
                            <TableSkeleton />
                        ) : (
                            <tbody className="w-full">
                                {Object?.entries(fixedExpenses)?.map(([item, amount]) => (
                                    <tr key={item} className="h-10 border-b border-dashed border-slate-200">
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

                                {finance?.flexibleExpenses?.map((expense) => (
                                    <tr key={expense?.title} className="border-b border-dashed h-10">
                                        <td className="capitalize text-sm text-muted-foreground">
                                            {expense?.title} - {expense?.category} <Badge className="ml-1 w-fit h-5 px-2 py-0 inline-flex justify-center items-center">
                                                Flexible
                                            </Badge>
                                        </td>

                                        <td className="text-sm font-medium text-right font-geist">
                                            {formatCurrency(Number(expense?.amount) || 0, {
                                                language: finance?.locale?.language || "en-US",
                                                currency: finance?.locale?.currency || "USD",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}

                        <tfoot>
                            <tr className="h-10 border-t">
                                <td className="font-semibold">Total Expenses</td>
                                <td className="xl:w-1/6 text-right font-geist font-semibold">
                                    {formatCurrency(finance?.totals?.totalExpenses || 0, {
                                        language: finance?.locale?.language || "en-US",
                                        currency: finance?.locale?.currency || "USD",
                                    })}
                                </td>
                            </tr>
                        </tfoot>
                    </table> 
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
import { formatCurrency } from "@/utils"
import { useFinanceSummary } from "../hooks/use-finance-summary"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ExpensesList(){
    const { data: finance, isLoading } = useFinanceSummary()
    const fixedExpenses = finance?.fixedExpenses || {}

    return (
        <div className="w-full flex flex-col xl:flex-row rounded-r-3xl">
            <div className="w-full flex flex-col overflow-hidden">
                <div className="px-3 xl:px-4 h-16 flex items-center text-body text-sm font-semibold rounded-t-md border-b">
                    <span className="px-4 py-1 bg-red-500/10 text-red-500 rounded-full">
                        Expenses
                    </span>
                </div>

                <ScrollArea className="px-3 xl:px-4 w-full h-[576px] flex flex-col overflow-hidden">
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
                                    <tr key={item} className="border-b border-dashed h-10">
                                        <td className="capitalize text-sm text-muted-foreground">
                                            {item.replace(/_/g, " ")}
                                        </td>

                                        <td className="text-sm font-medium text-right font-geist">
                                            {formatCurrency(
                                                finance?.locale?.language,
                                                finance?.locale?.currency,
                                                Number(amount) || 0
                                            )}
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
                                            {formatCurrency(
                                                finance?.locale?.language,
                                                finance?.locale?.currency,
                                                Number(expense?.amount) || 0
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}

                        <tfoot>
                            <tr className="h-10 border-t">
                                <td className="font-semibold">Total Expenses</td>
                                <td className="xl:w-1/6 text-right font-geist font-semibold">
                                    {formatCurrency(
                                        finance?.locale?.language,
                                        finance?.locale?.currency,
                                        finance?.totals?.totalExpenses || 0
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </ScrollArea>
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
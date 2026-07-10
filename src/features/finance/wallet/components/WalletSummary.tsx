import React from "react"
import { formatCurrency } from "@/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { useFinanceSummary } from "../hooks/use-finance-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WalletSummary(){
    const { data: finance, isLoading } = useFinanceSummary()
    
    const incomeStatementSummary = [
        {
            name: "Income",
            value: finance?.totals?.totalIncome || 0,
            description: "Total funds received",
        },
        {
            name: "Expenses",
            value: finance?.totals?.totalExpenses || 0,
            description: "Total funds spent",
        },
        {
            name: "Closing Balance",
            value: finance?.totals?.bookBalance || 0,
            description: "Remaining balance",
        },
    ]

    return (
        <Card className="w-full flex gap-y-4 px-0 py-0 shadow-none rounded-3xl bg-linear-to-b from-gray-50 to-gray-50 dark:from-neutral-800 dark:to-neutral-900 border-none dark:border-neutral-600">
            <CardHeader className="hidden">
                <CardTitle />
            </CardHeader>

            <CardContent className="py-10 w-full h-fit flex flex-col lg:flex-row justify-between items-center gap-10">
                {incomeStatementSummary?.map((summary, index) => (
                    <React.Fragment key={index}>
                        <div key={index} className="px-4 w-full flex flex-col gap-y-4">
                            <span className="flex flex-col gap-y-1 text-base order-2">
                                <p className="text-body font-semibold">
                                    {summary.name}
                                </p>

                                {!summary.name.toLowerCase().includes("remittance") ? (
                                    <small className="text-sm text-body-muted">
                                        {summary?.description}
                                    </small>
                                ) : (
                                    <Badge className={`w-fit text-xs font-normal ${summary?.description.toLowerCase()?.includes("not") ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary text-primary-foreground"}`}>
                                        {summary.description}
                                    </Badge>
                                )}
                            </span>

                            {isLoading ? (
                                <Skeleton className="h-7 w-[220px] rounded-lg" />
                            ) : (
                                <h1 className={`flex flex-col text-3xl font-bold leading-snug tracking-tight font-geist ${summary.name.toLowerCase().includes("balance") && summary?.value < 0 ? "text-red-500" : summary.name.toLowerCase().includes("balance") && summary?.value > 0 ? "text-green-500" : "text-body"}`}>
                                    {formatCurrency(summary?.value, {
                                        language: finance?.locale?.language,
                                        currency: finance?.locale?.currency,
                                    })}
                                </h1>
                            )}
                        </div>

                        <Separator
                            orientation="horizontal"
                            className="h-px w-full block lg:hidden bg-gray-300 dark:bg-neutral-700 last:hidden"
                        />

                        {/* <Separator
                            orientation="vertical"
                            className="w-px hidden lg:block data-[orientation=horizontal]:h-full bg-zinc-300 dark:bg-neutral-700 last:hidden"
                        /> */}
                    </React.Fragment>
                ))}
            </CardContent>
        </Card>
    )
}

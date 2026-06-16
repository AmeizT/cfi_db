"use client"

import { createContext, useContext } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowCircleDown2, ArrowCircleUp2 } from "iconsax-reactjs"
import { formatCurrency } from "@/utils"

type Variant = "income" | "expenses" | "balance" | "rolling"

interface CashflowCardProps {
    variant: Variant
    amount: number
    currency: string
    lang: string
    isLoading?: boolean
    children: React.ReactNode
}

// Create a context to share props with subcomponents
const CashflowCardContext = createContext<Omit<CashflowCardProps, "children"> | null>(null)

function useCashflowCardContext() {
    const context = useContext(CashflowCardContext)
    if (!context) {
        throw new Error("CashflowCard.* components must be used within <CashflowCard>")
    }
    return context
}

export function CashflowCard(props: CashflowCardProps) {
    const { variant, amount, children } = props

    const isIncome = variant === "income"
    const isExpense = variant === "expenses"
    const isBalance = variant === "balance"
    const isRolling = variant === "rolling"


    const bg = isIncome || (isBalance && amount >= 0) ? 
    "bg-white" : isExpense || (isBalance && amount < 0) ? 
    "bg-white" : isRolling ? 
    "bg-linear-to-br from-purple-400 to-violet-500" : "bg-slate-100"

    return (
        <CashflowCardContext.Provider value={props}>
            <Card className={`p-4 rounded-2xl ${!isRolling ? "border shadow-sm" : ""} border-slate-300 ${bg}`}>
                <CardContent className={`px-0 py-0 h-full ${variant?.includes("balance") ? "min-h-26" : "min-h-24"}`}>
                    <div className="h-full flex flex-col justify-between">
                        {children}
                    </div>
                </CardContent>
            </Card>
        </CashflowCardContext.Provider>
    )
}

function Title({ children }: { children: React.ReactNode }) {
    const { variant } = useCashflowCardContext()

    return (
        <p className={`text-sm mb-1 ${variant === "rolling" ? "text-white" : "text-gray-500"}`}>
            {children}
        </p>
    )
}

function Amount() {
    const { amount, currency, lang, isLoading, variant } = useCashflowCardContext()
    const isPositive = amount >= 0

    const color =
        variant === "income" || (variant === "balance" && isPositive) ? 
        "text-emerald-500" : variant === "rolling" 
        ? "text-white" : "text-rose-500"

    return (
        <div className="flex items-center gap-2">
            {isLoading ? (
                <Skeleton />
            ) : (
                <>
                    {variant === "income" && (
                        <ArrowCircleUp2 className="text-emerald-400" variant="Bulk" />
                    )}
                    {variant === "expenses" && (
                        <ArrowCircleDown2 className="text-rose-400" variant="Bulk" />
                    )}
                    <h3 className={`text-3xl font-bold ${color}`}>
                        {formatCurrency(amount, {
                            language: lang,
                            currency,
                            notation: "compact",
                            compactDisplay: "short",
                        })}
                    </h3>
                </>
            )}
        </div>
    )
}

function Description({ children }: { children: React.ReactNode }) {
    const { variant } = useCashflowCardContext()

    return (
        <p className={`text-sm ${variant === "rolling" ? "text-white" : "text-gray-500"}`}>
            {children}
        </p>
    )
}

CashflowCard.Title = Title
CashflowCard.Amount = Amount
CashflowCard.Description = Description
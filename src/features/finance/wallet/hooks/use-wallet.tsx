import { useMemo } from "react"
import { format } from "date-fns"
import { useTithes } from "./use-tithes"
import { useIncome } from "./use-income"
import { useFixedExpenses, useFlexibleExpenses } from "./use-expenses"
import { FixedExpenditure, Tithe } from "@/types"
import { Expense } from "../../schemas/expenses"
import { Income } from "../../schemas/income"

export const useWallet = (dateRange: string) => {
    const { data: incomeData } = useIncome()
    const { data: tithesData } = useTithes()
    const { data: fixedExpensesData } = useFixedExpenses()
    const { data: flexibleExpensesData } = useFlexibleExpenses()

    const tithes: Tithe[] = useMemo(
        () => tithesData?.results ?? [],
        [tithesData]
    )

    const income: Income[] = useMemo(
        () => incomeData?.results ?? [],
        [incomeData]
    )

    const fixedExpenses: FixedExpenditure[] = useMemo(
        () => fixedExpensesData?.results ?? [],
        [fixedExpensesData]
    )
    
    const flexibleExpenses: Expense[] = useMemo(
        () => flexibleExpensesData?.results ?? [],
        [flexibleExpensesData]
    )

    const monthIncomeEntry = useMemo(
        () =>
        income.find(
            (inc) => format(new Date(inc.timestamp), "MMyyyy") === dateRange
        ),
        [income, dateRange]
    )

    const fixedExpensesEntry = useMemo(
        () =>
        fixedExpenses.find(
            (entry) => format(new Date(entry.timestamp), "MMyyyy") === dateRange
        ),
        [fixedExpenses, dateRange]
    )

    const flexibleExpensesEntries = useMemo(
        () =>
        flexibleExpenses.filter(
            (exp) => format(new Date(exp.invoice_date), "MMyyyy") === dateRange
        ),
        [flexibleExpenses, dateRange]
    )

    const monthTithes = useMemo(
        () =>
        tithes.filter(
            (tithe) => format(new Date(tithe.timestamp), "MMyyyy") === dateRange
        ),
        [tithes, dateRange]
    )

    const totalAdhocExpenditure = useMemo(
        () =>
        flexibleExpensesEntries.reduce(
            (acc, curr) => acc + (Number(curr.total) || 0),
            0
        ),
        [flexibleExpensesEntries]
    )

    const totalTithes = useMemo(
        () =>
        monthTithes.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0),
        [monthTithes]
    )

    const remittance = totalTithes * 0.25

    const totalIncome = useMemo(() => {
        if (!monthIncomeEntry) return totalTithes
        const { offering = 0, thanksgiving = 0, fundraising = 0, donations = 0 } =
        monthIncomeEntry
        return (
        totalTithes +
        Number(offering) +
        Number(thanksgiving) +
        Number(fundraising) +
        Number(donations)
        )
    }, [monthIncomeEntry, totalTithes])

    const totalExpenditure = useMemo(() => {
        const regular = Number(fixedExpensesEntry?.total) || 0
        return regular + totalAdhocExpenditure + remittance
    }, [fixedExpensesEntry, totalAdhocExpenditure, remittance])

    return {
        income,
        remittance,
        totalTithes,
        totalIncome,
        totalExpenditure,
        fixedExpensesEntry,
        flexibleExpensesEntries,
        closingBalance: totalIncome - totalExpenditure,
    }
}


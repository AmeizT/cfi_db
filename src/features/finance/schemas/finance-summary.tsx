import { z } from "zod";

export const financeSummarySchema = z.object({
    income: z.object({
        gross_income: z.number(),
        breakdown: z.object({
            offering: z.number(),
            thanksgiving: z.number(),
            fundraising: z.number(),
            donations: z.number(),
        }),
        tithes: z.number(),
    }),

    fixedExpenses: z.object({
        rent: z.number(),
        water: z.number(),
        electricity: z.number(),
        telephone: z.number(),
        internet: z.number(),
        security: z.number(),
        fuel: z.number(),
        wages: z.number(),
        insurance: z.number(),
        humanitarian: z.number(),
        investment: z.number(),
        car_maintenance: z.number(),
        bank_charges: z.number(),
        remittance: z.number(),
    }),

    flexibleExpenses: z.array(
        z.object({
            title: z.string(),
            category: z.string(),
            timestamp: z.string(),
            amount: z.number(),
        })
    ),

    totals: z.object({
        totalTithes: z.number(),
        totalIncome: z.number(),
        totalExpenses: z.number(),
        balance: z.number(),
        balance_carried_forward: z.number(),
        bookBalance: z.number(),
        expenseToIncomeRatio: z.number(),
    }),

    locale: z.object({
        id: z.number(),
        country_code: z.string(),
        language: z.string(),
        currency: z.string(),
    }),

    timestamp: z.object({
        year: z.number(),
        month: z.number(),
        month_name: z.string(),
    }),

    meta: z.object({
        church_id: z.number(),
        generated_at: z.string(), 
    }),
});

export type FinanceSummary = z.infer<typeof financeSummarySchema>
import z from "zod"
import { TitheSchema } from "@/features/finance/tithes/schemas/tithes"
import { AttendanceServerSchema } from "@/features/attendance/schemas/attendance"
import { financeSummarySchema } from "@/features/finance/schemas/finance-summary"
import { incomeSchema } from "@/features/finance/schemas/income"
import { fixedExpensesSchema } from "@/features/finance/schemas/fixed-expenses"

export const ReportSchema = z.object({
    id: z.number(),
    period_start: z.string(),
    period_end: z.string(),
    status: z.enum(["draft", "finalized", "missing"]),
    finalized_by: z.string().nullable().optional(),
    finalized_at: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    church: z.number(),
    data: z.object({
        attendances: z.array(AttendanceServerSchema),
        tithes: z.array(TitheSchema),
        incomes: z.array(incomeSchema),
        expenditures: z.array(fixedExpensesSchema),
    }),
    finance_summary: financeSummarySchema,
    isPlaceholder: z.boolean().optional().default(false),
})

export type MonthlyReport = z.infer<typeof ReportSchema>
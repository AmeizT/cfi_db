import { z } from "zod"

export const assemblyReportSchema = z.object({
    id: z.number(),

    assembly: z.number(),

    period_start: z.string(),
    period_end: z.string(),

    status: z.enum([
        "draft",
        "finalized",
        "reviewed",
        "approved",
        "archived",
    ]),

    finalized_at: z.string().nullable(),

    attendance_total: z.number(),
    members_total: z.number(),

    income_total: z.number(),
    expense_total: z.number(),
    tithe_total: z.number(),
    balance: z.number(),

    total_adults: z.number(),
    total_children: z.number(),
    total_guests: z.number().optional(),
    total_visitors: z.number(),
    total_new_converts: z.number(),
    total_altar_call: z.number(),
    total_baptisms: z.number(),
    total_online_viewers: z.number(),

    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
});

export type AssemblyReport = z.infer<typeof assemblyReportSchema>;

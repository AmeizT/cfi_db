import { z } from "zod"

export const incomeSchema = z.object({
    church: z.string().min(1, "Please select a church"),
    report: z.string().min(1, "Please select a report"),
    timestamp: z.string().min(1, "Date is required"),
    offering: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    fundraising: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    thanksgiving: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    donations: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    total_income: z.string(),
    notes: z.string().optional(),
})

export type Income = z.infer<typeof incomeSchema>
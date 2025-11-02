import { z } from "zod"

export const reportFormSchema = z.object({
    period_start: z.string().min(1, "Period start date is required"),
    period_end: z.string().min(1, "Period end date is required"),
    church: z.string().min(1, "Church is required"),
    status: z.enum(["draft", "finalized"]),
})

export type ReportFormValues = z.infer<typeof reportFormSchema>

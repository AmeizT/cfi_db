import { z } from "zod"

export const fixedExpensesSchema = z.object({
    assembly: z.string(),
    rent: z.coerce.number().nonnegative().default(0),
    water: z.coerce.number().nonnegative().default(0),
    electricity: z.coerce.number().nonnegative().default(0),
    telephone: z.coerce.number().nonnegative().default(0),
    internet: z.coerce.number().nonnegative().default(0),
    security: z.coerce.number().nonnegative().default(0),
    fuel: z.coerce.number().nonnegative().default(0),
    wages: z.coerce.number().nonnegative().default(0),
    insurance: z.coerce.number().nonnegative().default(0),
    humanitarian: z.coerce.number().nonnegative().default(0),
    investment: z.coerce.number().nonnegative().default(0),
    car_maintenance: z.coerce.number().nonnegative().default(0),
    bank_charges: z.coerce.number().nonnegative().default(0),
    remittance: z.coerce.number().nonnegative().default(0),
    remarks: z.string().optional(),
    timestamp: z.string().min(1, { message: "Date is required" }),
})

export type FixedExpense = z.infer<typeof fixedExpensesSchema>
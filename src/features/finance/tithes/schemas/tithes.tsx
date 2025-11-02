import { z } from "zod"
import { PaymentMethod, paymentMethods } from "./payment-methods"

export const TitheSchema = z.object({
    assembly: z.string(), 
    created_by: z.string().nullable(), 
    member: z.number().nullable(), 
    amount: z.number().nonnegative(),
    payment_method: z.enum(
        paymentMethods.map((m) => m.value) as [PaymentMethod, ...PaymentMethod[]],
        {
            error: "Payment method is required",
        }
    ),
    receipt: z.string().url().nullable().optional(), 
    timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    reference_code: z.string().max(100).optional(),
    notes: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

export const TitheFormSchema = z.object({
    tithes: z
        .array(
            z.object({
                assembly: z.string().min(1, "Assembly is required"),
                created_by: z.string().optional(),
                member: z.string().optional(),
                amount: z
                    .string()
                    .min(1, "Amount is required")
                    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a valid number greater than 0"),
                payment_method: z.enum(
                    paymentMethods.map((m) => m.value) as [PaymentMethod, ...PaymentMethod[]],
                    {
                        error: "Payment method is required",
                    }
                ),
                timestamp: z.date().refine((val) => val instanceof Date && !isNaN(val.getTime()), {
                    message: "Date is required",
                }),
                reference_code: z.string().optional(),
                notes: z.string().optional(),
                receipt: z.any().optional(),
            }),
        )
        .min(1, "At least one tithe entry is required"),
})

export type Tithe = z.infer<typeof TitheSchema>
export type TitheFormData = z.infer<typeof TitheFormSchema>
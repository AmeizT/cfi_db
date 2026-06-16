"use server"

import { url } from "@/config/urls"
import axios from "axios"
import { cookies } from "next/headers"
import { z } from "zod"
import { PaymentMethod, paymentMethods } from "../schemas/payment-methods"
import { withJwt } from "@/config/headers"

const TitheEntrySchema = z.object({
    report: z.string(),
    assembly: z.string().min(1, "Assembly is required"),
    created_by: z.string().optional(),
    member: z.string().optional(),
    amount: z.number().min(0.01, "Amount must be greater than 0"),
    payment_method: z.enum(paymentMethods.map(p => p.value) as [PaymentMethod, ...PaymentMethod[]], {
        error: "Payment method is required",
    }),
    timestamp: z.string().min(1, "Date is required"),
    reference_code: z.string().optional(),
    notes: z.string().optional(),
    receipt: z.instanceof(File).optional(),
})

const MultipleTithesSchema = z.object({
    tithes: z.array(TitheEntrySchema).min(1, "At least one tithe entry is required"),
})

export type TitheEntry = z.infer<typeof TitheEntrySchema>
export type MultipleTithesData = z.infer<typeof MultipleTithesSchema>

type PrevData = {
    message: string
    status: number
    success: boolean
}

export async function createTithes(prevData: PrevData, formData: FormData) {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined
    const jsonData = formData.get("data") as string
    const parsedData = JSON.parse(jsonData)
    const validatedData = MultipleTithesSchema.parse(parsedData)

    console.log("validatedData", validatedData)

    const processedTithes = await Promise.all(
        validatedData.tithes.map(async (tithe, index) => {
            const receiptFile = formData.get(`receipt_${index}`) as File | null

            if (receiptFile && receiptFile.size > 0) {
                // Validate file type
                const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
                if (!allowedTypes.includes(receiptFile.type)) {
                    throw new Error(`Invalid file type for receipt ${index + 1}. Only JPG, JPEG, PNG, and WEBP are allowed.`)
                }

                if (receiptFile.size > 500 * 1024) {
                    throw new Error(`Receipt ${index + 1} file size must be less than 500KB.`);
                }

                const receiptUrl = `uploads/receipts/${Date.now()}_${receiptFile.name}`

                return {
                    ...tithe,
                    receipt: {
                        file: receiptFile,
                        name: receiptFile.name,
                        type: receiptFile.type,
                        url: receiptUrl,
                    },
                }
            }

            return {
                ...tithe,
                receipt: receiptFile || null,
            }
        }),
    )

    try {
        const response = await axios.post(
            url.tithes,
            processedTithes,
            withJwt(accessToken)
        )

        // Generate reference codes for entries that don't have them
        const savedTithes = processedTithes.map((tithe, index) => ({
            ...tithe,
            id: `tithe_${Date.now()}_${index}`,
            reference_code:
                tithe.reference_code ||
                `TH-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}-${String(index + 1).padStart(3, "0")}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }))

        return {
            status: response?.status || 201,
            success: true,
            message: `Successfully saved ${savedTithes.length} tithe ${savedTithes.length === 1 ? "entry" : "entries"}`,
        }
    } catch (error) {
        console.error("Error submitting tithes:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: "Validation failed",
                errors: error.issues,
                status: 404 | 500,
            }
        }

        return {
            status: 404 | 500,
            success: false,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
        }
    }
}

"use server"

import { z } from "zod"
import axios from "axios"
import { url } from "@/config/urls"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

const createReportSchema = z.object({
    church: z.coerce.number().int().positive("Church ID is required"),
    period_start: z.string().min(1, "Period start date is required"),
    period_end: z.string().min(1, "Period end date is required"),
    status: z.enum(["draft", "finalized"]).default("draft"),
})

export type CreateReportSchema = z.infer<typeof createReportSchema>

const reportResponseSchema = z.object({
    id: z.number(),
    church: z.union([z.string(), z.number()]),
    period_start: z.string(),
    period_end: z.string(),
    status: z.string(),
})

export type ReportFormState = {
    errors?: {
        church?: string[]
        period_start?: string[]
        period_end?: string[]
        status?: string[]
        _form?: string[]
    }
    message?: string
    success?: boolean
    status: number
}

export async function createReport(prevState: ReportFormState, formData: FormData) {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const rawData = Object.fromEntries(formData.entries())
        const validatedData = createReportSchema.parse(rawData)

        const response = await axios.post(url.reports, validatedData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${accessToken}`,
            },
        })

        const report = reportResponseSchema.safeParse(response.data)
        if (!report.success) {
            console.warn("Unexpected response format:", report.error.flatten())
        }

        revalidatePath("/")

        return {
            message: "Report created successfully!",
            success: true,
            status: response.status,
            errors: {},
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                message: "Validation failed.",
                success: false,
                status: 422,
                errors: error.flatten(),
            }
        }

        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 400
            const message =
                error.response?.data?.message || "Failed to create report."

            return {
                message,
                success: false,
                status,
                errors: error.response?.data || {},
            }
        }

        return {
            message: "Unexpected error occurred.",
            success: false,
            status: 500,
            errors: {}
        }
    }
}
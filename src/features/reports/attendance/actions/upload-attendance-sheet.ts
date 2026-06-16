"use server"

import { apiRoutes } from "@/config/urls"
import axios from "axios"
import { cookies } from "next/headers"

export type FormState = {
    message?: string
    success?: boolean
    status: number
}

export async function uploadAttendanceSheet(prevState: FormState, formData: FormData) {
    const cookieStore = await cookies()

    if (!formData.has("file")) {
        return {
            message: "No file provided",
            success: false,
            status: 422,
            errors: { file: "Missing file" },
        }
    }

    try {
        const response = await axios.post(apiRoutes.uploadExcel.attendance, formData, {
            headers: {
                Cookie: cookieStore.toString(),
            },
        })

        console.log(response)

        return {
            message: "Attendance data uploaded successfully!",
            success: true,
            status: response.status,
            errors: {},
        }
    } catch (error) {
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
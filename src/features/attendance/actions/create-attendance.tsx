"use server"

import { z } from "zod"
import axios from "axios"
import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { FormState } from "@/types/form-state"
import { withJwt } from "@/config/headers"

export async function createAttendance(prevData: FormState, formData: FormData) {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    try {
        const response = await axios.post(
            url.attendance,
            formData,
            withJwt(accessToken)
        )

        return {
            success: true,
            status: response.status,
            message: "Attendance saved successfully",
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                status: 422,
                message: "Validation failed",
                errors: error.issues,
            }
        }

        return {
            success: false,
            status: 400,
            message: error instanceof Error ? error.message : "An unexpected error occurred",
        }
    }
}
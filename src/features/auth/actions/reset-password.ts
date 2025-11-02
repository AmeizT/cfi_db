/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axios from "axios"
import { url } from "@/config/urls"
import { jsonHeaders } from "@/config/headers"

export async function resetPassword(prevState: any, formData: FormData) {
    const email = formData.get("email")

    const rawFormData = {
        email
    }

    try {
        const response = await axios.post(url.passwordReset, rawFormData, jsonHeaders)

        return {
            message: response?.statusText,
            status: response.status,
            success: true
        }
    } catch (error: any) {
        return {
            message: error?.response?.data,
            status: Number(error?.response?.status),
            success: false,
        }
    }
}


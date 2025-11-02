/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import axios from "axios"
import { url } from "@/config/urls"
import { jsonHeaders } from "@/config/headers"

export async function createPassword(prevState: any, formData: FormData) {
    const rawFormData = Object.fromEntries(formData)

    try {
        const response = await axios.post(url.passwordResetConfirm, rawFormData, jsonHeaders)

        return {
            ...prevState,
            data: response?.data,
            status: response.status,
            success: true
        }
    } catch (error: any) {
        return {
            ...prevState,
            errors: error?.response?.data,
            status: Number(error?.response?.status),
            success: false,
        }
    }
}
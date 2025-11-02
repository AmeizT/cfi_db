"use server"

import { z } from "zod"
import { url } from "@/config/urls"
import { User } from "../schemas/user"
import axios, { AxiosError } from "axios"
import { AuthFormState } from "../types/form-state"

interface HttpResponse {
    user: User | undefined
    error: string
    status: number
}

export async function verifyUserId(prevState: AuthFormState, formData: FormData) {
    const schema = z.object({
        email: z.string().email({ message: "Please enter your CFI workspace ID" }),
    })

    const validatedFields = schema.safeParse({
        email: formData.get("email"),
    })

    if (!validatedFields.success) {
        return {
            ...prevState,
            data: {
                user: undefined,
                error: "Enter a valid email"
            },
            message: "Failed to verify your identity"
        }
    }

    try {
        const response = await axios.post(url.emailCheck, formData)

        return {
            data: {
                user: response?.data?.user,
                error: ""
            },
            httpStatusCode: Number(response?.status) || -1,
            message: String(response?.data?.message || response?.statusText),
            success: true,
        }
    } catch (error: unknown) {
        console.log(error)
        const axiosError = error as AxiosError<HttpResponse>
        
        return {
            data: {
                user: null,
                error: axiosError?.response?.data?.error || "An unexpected error occurred.",
            },
            message: axiosError?.response?.data?.error || "An unexpected error occurred.",
            httpStatusCode: axiosError.response?.status || 500,
            success: false,
        }
    }
}
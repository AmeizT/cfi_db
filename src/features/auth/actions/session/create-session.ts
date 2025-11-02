"use server"

import { z } from "zod"
import axios, { AxiosError } from "axios"
import { cookies } from "next/headers"
import { formatISO } from "date-fns"
import { jsonHeaders } from "@/config/headers"

interface InitialState {
    message: string
    status: number
    success: boolean
}

export async function createSession(prevState: InitialState, formData: FormData) {
    const sessionURL = "http://127.0.0.1:8000/api/v1/auth/users/"
    const rawFormData = Object.fromEntries(formData)
    const cookieStore = await cookies()

    const schema = z.object({
        email: z.string().min(3, { message: "Please enter your email" }),
        password: z.string().min(8, { message: "Password too short" })
    })

    const validatedFields = schema.safeParse({
        email: formData.get("email"),
        password: formData.get("password")
    })

    if (!validatedFields.success) {
        return {
            ...prevState,
            formErrors: validatedFields.error.flatten().fieldErrors,
            message: "Failed to verify your identity. Please check your username or password and try again."
        }
    }

    try {
        const response = await axios.post(sessionURL, rawFormData, jsonHeaders)

        if (response?.status === 200) {
            cookieStore.set({
                name: "accessToken",
                value: response?.data?.access,
                httpOnly: true,
                path: "/",
                secure: !Boolean(process.env.NEXT_PUBLIC_DEVMODE),
                maxAge: 60 * 60,
                sameSite: "strict",
            })

            cookieStore.set({
                name: "refreshToken",
                value: response?.data?.refresh,
                httpOnly: true,
                path: "/",
                secure: !Boolean(process.env.NEXT_PUBLIC_DEVMODE),
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "strict",
            })

            cookieStore.set({
                name: "sessionCreatedAt",
                value: formatISO(new Date()),
                path: "/",
                sameSite: "strict",
            })
        }

        return {
            message: String(response?.statusText),
            status: Number(response?.status),
            success: true,
        }
    } catch (error: unknown) {
        const axiosError = error as AxiosError;

        return {
            message: axiosError.response?.statusText || "Unknown Error",
            status: axiosError.response?.status || 500,
            success: false,
        }
    }
}
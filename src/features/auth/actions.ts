"use server"

import { z } from "zod"
import { apiRoutes, url } from "@/config/urls"
import { formatISO } from "date-fns"
import { cookies } from "next/headers"
import axios, { AxiosError } from "axios"
import { AuthFormState } from "./types/form-state"

interface ServerErrorResponse {
    error: string
    status: number
}

export async function validateUserID(prevState: AuthFormState, formData: FormData) {
    const schema = z.object({
        email: z.string().email({ message: "Please enter your CFI workspace ID" }),
    })

    const validatedFields = schema.safeParse({
        email: formData.get("email"),
    })

    if (!validatedFields.success) {
        return {
            ...prevState,
            formErrors: validatedFields.error.flatten().fieldErrors,
            data: validatedFields.error.flatten().fieldErrors,
            message: "Failed to verify your identity. Please check your username or password and try again."
        }
    }

    try {
        const response = await axios.post(url.emailCheck, formData)

        return {
            data: response?.data,
            httpStatusCode: Number(response?.status),
            message: String(response?.data?.message || response?.statusText),
            success: true,
        }
    } catch (error: unknown) {
        const axiosError = error as AxiosError<ServerErrorResponse>
        
        return {
            data: axiosError?.response?.data,
            message: axiosError?.response?.data?.error || "An unexpected error occurred.",
            httpStatusCode: axiosError.response?.status || 500,
            success: false,
        }
    }
}

export async function createSession(prevState: AuthFormState, formData: FormData) {
    const cookieStore = await cookies()
    const rawFormData = Object.fromEntries(formData)

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
            error: "Failed to verify your identity",
            status: 404,
            message: "Failed to verify your identity. Please check your username or password and try again."
        }
    }

    const body = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    try {
        const response = await fetch("http://localhost:8000/api/v1/auth/login/", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 🔥 REQUIRED for cookies
        });

        if (response?.status === 200) {
            // cookieStore.set({
            //     name: "accessToken",
            //     value: response?.data?.access,
            //     httpOnly: true,
            //     path: "/",
            //     secure: !Boolean(process.env.NEXT_PUBLIC_DEVMODE),
            //     maxAge: 60 * 60,
            //     sameSite: "strict",
            // })

            // cookieStore.set({
            //     name: "refreshToken",
            //     value: response?.data?.refresh,
            //     httpOnly: true,
            //     path: "/",
            //     secure: !Boolean(process.env.NEXT_PUBLIC_DEVMODE),
            //     maxAge: 60 * 60 * 24 * 7,
            //     sameSite: "strict",
            // })

            cookieStore.set({
                name: "sessionCreatedAt",
                value: formatISO(new Date()),
                path: "/",
                sameSite: "strict",
            })

            cookieStore.set({
                name: "startupSoundPlayed",
                value: "false",
                path: "/",
                sameSite: "strict",
            })
        }

        console.log("Login response:", response)

        return {
            status: Number(response?.status) || 200,
            success: true,
        }
    } catch (error: unknown) {
        const axiosError = error as AxiosError

        const status = axiosError.response?.status

        const isAuthError = status === 401 || status === 403

        return {
            error: isAuthError
                ? "Invalid username or password"
                : "We couldn't sign you in. Please try again.",
            status: status || 500,
            success: false,
        }
    }
}






export async function checkSession() {
    const res = await fetch(apiRoutes.auth.currentUser(), {
        method: "GET",
        credentials: "include", // ✅ correct for fetch
        cache: "no-store",
    })

    console.log("Check session response:", res)

    return res.ok
}
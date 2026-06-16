import { apiRoutes } from "@/config/urls"
import { formatISO } from "date-fns"
import z from "zod"

/**
 * Client-side login function (recommended for cookie-based auth)
 * This allows Django to set HttpOnly cookies directly in the browser
 */
export async function createSessionClient(formData: FormData) {
    const schema = z.object({
        email: z.string().min(3, { message: "Please enter your email" }),
        password: z.string().min(8, { message: "Password too short" })
    })

    const validatedFields = schema.safeParse({
        email: formData.get("email") as string,
        password: formData.get("password") as string
    })

    if (!validatedFields.success) {
        return {
            formErrors: validatedFields.error.flatten().fieldErrors,
            error: "Failed to verify your identity",
            status: 400,
            success: false,
        }
    }

    try {
        const response = await fetch("http://localhost:8000/api/v1/auth/login/", {
            method: "POST",
            body: JSON.stringify(validatedFields.data),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 🔥 REQUIRED for cookies
        })

        if (!response.ok) {
            const status = response.status

            return {
                error:
                    status === 401 || status === 403
                        ? "Invalid username or password"
                        : "We couldn't sign you in. Please try again.",
                status,
                success: false,
            }
        }

        // Optional UI-only cookies (NOT auth cookies)
        document.cookie = `sessionCreatedAt=${formatISO(new Date())}; path=/`
        document.cookie = `startupSoundPlayed=false; path=/`

        return {
            status: response.status,
            success: true,
        }
    } catch (error) {
        console.error("Login error:", error)
        return {
            error: "We couldn't sign you in. Please try again.",
            status: 500,
            success: false,
        }
    }
}

export async function verifySession() {
    const res = await fetch(apiRoutes.auth.verify(), {
        method: "GET",
        credentials: "include", // ✅ correct for fetch
        cache: "no-store",
    })

    return res.ok
}
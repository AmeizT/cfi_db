"use server"

import { url } from "@/config/urls"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { FormState } from "@/types/form-state"

export async function changeWorkspace(formState: FormState, formData: FormData) {
    const assemblyId = formData.get("church")?.toString().trim()
    const userId = formData.get("user")?.toString().trim()

    if (!assemblyId || !userId) {
        return {
            success: false,
            status: 400,
            message: "Missing user or church ID"
        }
    }

    const cookieStore = await cookies();
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value

    const userUrl = `${url.user}${userId}/`

    try {
        const response = await fetch(userUrl, {
            method: "PATCH",
            body: JSON.stringify({ church: assemblyId }),
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                authorization: `JWT ${accessToken}`,
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return {
                success: false,
                status: response.status,
                message: errorData?.detail || "Failed to update workspace"
            }
        }

        revalidatePath("/")

        return {
            success: true,
            status: response.status,
            message: "Workspace changed"
        }
    } catch (error: unknown) {
        console.error("Error changing workspace:", error)

        return {
            success: false,
            status: 500,
            message: "An unexpected error occurred while changing the workspace"
        }
    }
}
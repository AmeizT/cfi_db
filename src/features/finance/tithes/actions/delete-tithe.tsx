"use server"

import axios from "axios"
import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { revalidatePath } from "next/cache"
import { withJwt } from "@/config/headers"

type PrevData = {
    message: string
    status: number
    success: boolean
}

export async function deleteTithe(prevState: PrevData, formData: FormData) {
    const id = formData.get("titheId")
    const titheUrl = `${url.tithes}${id}`
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const response = await axios.delete(titheUrl, withJwt(accessToken))
        revalidatePath("/finance/tithes")

        return {
            status: response?.status || 204,
            success: true,
            message: "Tithe moved to trash",
        }
    } catch (error: unknown) {
        console.log(error)
        return {
            status: 404,
            message: "Failed to delete. Please try again.",
            success: false,
        }
    }
}

export async function restoreTithe(prevState: PrevData, formData: FormData) {
    const id = formData.get("titheId")
    const titheUrl = `${url.tithes}${id}/restore/`
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const response = await axios.post(titheUrl, {}, withJwt(accessToken))
        revalidatePath("/finance/tithes")

        return {
            status: response?.status || 200,
            success: true,
            message: "Tithe restored",
        }
    } catch (error: unknown) {
        console.log(error)
        return {
            status: 404,
            message: "Failed to delete. Please try again.",
            success: false,
        }
    }
}
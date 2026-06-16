"use server"

import { cookies } from "next/headers"
import axios, { AxiosError } from "axios"
import { RequestError } from "@/types/error"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

export async function fixedExpenditureFormAction(formState: unknown, formData: FormData) {
    const cookieStore = await cookies()
    const rawFormData = Object.fromEntries(formData)
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    console.log(rawFormData)

    try {
        const response = await axios.post(
            url.regularExpenditures,
            rawFormData,
            withJwt(accessToken)
        )

        return {
            message: response?.statusText as unknown as number,
            status: response?.status as unknown as number,
            success: true
        }
    } catch (error: unknown) {
        const reqError = error as AxiosError<RequestError>

        console.log(error)

        return {
            message: reqError?.response?.data,
            status: reqError?.response?.status as unknown as number,
            success: false
        }
    }
}
import axios from "axios"
import { url } from "@/config/urls"
import { User } from "./types/user"

interface UserCheckResponse {
    user: User
    message: string
    status: number
}

interface ResponseError {
    error: string
    status: number
}

export async function checkUserEmail({email}: {email: string}): Promise<UserCheckResponse | ResponseError> {
    try {
        const { data } = await axios.get<UserCheckResponse>(url.emailCheck, {
            params: { email },
        })
        return data
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                error: error.response.data?.error || "Unknown error",
                status: error.response.status,
            }
        }

        return {
            error: "Network error",
            status: 500,
        }
    }
}
import { User } from "@/types"

export interface AuthFormState {
    data: {
        user?: User | undefined
        error?: string
    }
    httpStatusCode: number | null
    message: string
    success: boolean
}
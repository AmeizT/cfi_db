import { User } from "../schemas/user"


export interface RequestError {
    errorMessage: string
    status: number
}

export interface AuthData {
    user: User | undefined
    error?: string
}
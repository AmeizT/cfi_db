import { ZodIssue } from "zod"

export type FormState = {
    message: string
    status: number
    success: boolean
    errors?: ZodIssue[];
}
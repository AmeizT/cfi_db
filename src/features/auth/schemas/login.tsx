import { z } from "zod"

export const workspaceLoginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, { message: "Username or email is required." }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." }),
})

export const passwordRecoverySchema = z.object({
    email: z
    .email()
    .min(1, {message: "Enter a valid email"})
})
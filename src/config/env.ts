import { z } from "zod"

const envSchema = z.object({
    APP_ENV: z.enum(["development", "staging", "production"]),
    NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
    EMAIL_PASSWORD: z.string().min(1, "EMAIL_PASSWORD is required"),
    EMAIL_USER: z.string().min(1, "EMAIL_USER is required"),
    IP_INFO_TOKEN: z.string().min(1),
    RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
    WORKSPACE_DOMAIN: z.string().startsWith("@").min(2, "WORKSPACE_DOMAIN must start with @"),
})

const parsed = envSchema.safeParse(process.env)

// if (!parsed.success) {
//     console.error("❌ Invalid environment variables", parsed.error.format())
//     throw new Error("Invalid environment variables")
// }

export const env = parsed.data

export const publicSchema = z.object({
    WORKSPACE_DOMAIN: z.string().min(1, "WORKSPACE_DOMAIN is required"),
})

export const publicEnv = publicSchema.parse({
    WORKSPACE_DOMAIN: process.env.NEXT_PUBLIC_WORKSPACE_DOMAIN
})
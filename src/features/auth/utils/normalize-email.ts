import { publicEnv } from "@/config/env"

export function normalizeEmail(input: string): string {
    const domain = publicEnv.WORKSPACE_DOMAIN

    if (!domain) {
        throw new Error("Missing WORKSPACE_DOMAIN environment variable")
    }

    const trimmedInput = input.trim().toLowerCase()

    return trimmedInput.includes("@") ? trimmedInput : `${trimmedInput}${domain}`
}
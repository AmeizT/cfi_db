import { getBackendApiUrl } from "./backend-url"
import { CurrentUserError, fetchCurrentUser } from "../services/get-user-core"

export async function getCurrentUserForCookies(cookieHeader: string) {
    let endpoint: string
    try {
        endpoint = getBackendApiUrl("api/v1/auth/users/me/")
    } catch {
        console.error("[current-user]", {
            apiHost: "invalid",
            timeoutMs: 5_000,
            status: null,
            durationMs: 0,
            failureCategory: "configuration",
            environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
        })
        throw new CurrentUserError("configuration", "Invalid Django API URL configuration")
    }
    return fetchCurrentUser({
        endpoint,
        cookieHeader,
        log: (event) => console.info("[current-user]", {
            ...event,
            environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
        }),
    })
}

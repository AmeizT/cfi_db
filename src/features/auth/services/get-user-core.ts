import { UserSchema, type User } from "../schemas/user"

export type CurrentUserErrorCode =
    | "configuration"
    | "timeout"
    | "network"
    | "http"
    | "invalid-json"
    | "invalid-user"
    | "unexpected"

export class CurrentUserError extends Error {
    readonly code: CurrentUserErrorCode
    readonly status?: number

    constructor(code: CurrentUserErrorCode, message: string, status?: number) {
        super(message)
        this.name = "CurrentUserError"
        this.code = code
        this.status = status
    }
}

export type CurrentUserRequestLog = {
    apiHost: string
    timeoutMs: number
    status: number | null
    durationMs: number
    failureCategory: CurrentUserErrorCode | "unauthenticated" | null
}

type CurrentUserRequestOptions = {
    endpoint: string
    cookieHeader: string
    fetchImpl?: typeof fetch
    timeoutMs?: number
    log?: (event: CurrentUserRequestLog) => void
}

export async function fetchCurrentUser({
    endpoint,
    cookieHeader,
    fetchImpl = fetch,
    timeoutMs = 5_000,
    log,
}: CurrentUserRequestOptions): Promise<User | null> {
    const started = performance.now()
    let status: number | null = null
    let failureCategory: CurrentUserRequestLog["failureCategory"] = null
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const response = await fetchImpl(endpoint, {
            cache: "no-store",
            headers: {
                Cookie: cookieHeader,
            },
            signal: controller.signal,
        })

        status = response.status
        if (response.status === 401) {
            failureCategory = "unauthenticated"
            return null
        }

        if (!response.ok) {
            throw new CurrentUserError(
                "http",
                `Current user request failed with status ${response.status}`,
                response.status,
            )
        }

        let payload: unknown
        try {
            payload = await response.json()
        } catch (error) {
            if (controller.signal.aborted) throw error
            throw new CurrentUserError(
                "invalid-json",
                "Current user response was not valid JSON",
                response.status,
            )
        }

        const parsed = UserSchema.safeParse(payload)
        if (!parsed.success) {
            throw new CurrentUserError(
                "invalid-user",
                "Current user response did not match the expected schema",
                response.status,
            )
        }

        return parsed.data
    } catch (error) {
        const failure = controller.signal.aborted
            || (error instanceof DOMException && error.name === "AbortError")
            ? new CurrentUserError("timeout", "Current user request timed out")
            : error instanceof CurrentUserError
                ? error
                : error instanceof TypeError
                    ? new CurrentUserError("network", "Current user request failed over the network")
                    : new CurrentUserError("unexpected", "Current user request failed unexpectedly")
        failureCategory = failure.code
        throw failure
    } finally {
        clearTimeout(timeout)
        // Log only the host: URL credentials, query strings and cookies are excluded.
        let apiHost = "invalid"
        try { apiHost = new URL(endpoint).host } catch { /* invalid configuration */ }
        log?.({
            apiHost,
            timeoutMs,
            status,
            durationMs: Math.round(performance.now() - started),
            failureCategory,
        })
    }
}

import { UserSchema, type User } from "../schemas/user"

export type CurrentUserErrorCode =
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

type CurrentUserRequestOptions = {
    endpoint: string
    cookieHeader: string
    fetchImpl?: typeof fetch
    timeoutMs?: number
}

export async function fetchCurrentUser({
    endpoint,
    cookieHeader,
    fetchImpl = fetch,
    timeoutMs = 5_000,
}: CurrentUserRequestOptions): Promise<User | null> {
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

        if (response.status === 401) return null

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
        } catch {
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
        if (error instanceof CurrentUserError) throw error

        if (
            controller.signal.aborted
            || (error instanceof DOMException && error.name === "AbortError")
        ) {
            throw new CurrentUserError("timeout", "Current user request timed out")
        }

        if (error instanceof TypeError) {
            throw new CurrentUserError("network", "Current user request failed over the network")
        }

        throw new CurrentUserError("unexpected", "Current user request failed unexpectedly")
    } finally {
        clearTimeout(timeout)
    }
}

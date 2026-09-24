import { CurrentUserError } from "./get-user-core"
import { UserSchema } from "../schemas/user"

/** Read the session without invoking a page Server Action or rerendering its layout. */
export async function getUserClient() {
    const response = await fetch("/api/auth/current-user", {
        credentials: "same-origin",
        cache: "no-store",
    })
    if (response.status === 401) return null
    if (!response.ok) {
        throw new CurrentUserError(
            response.status === 504 ? "timeout" : "http",
            "Unable to load the current user",
            response.status,
        )
    }
    return UserSchema.parse(await response.json())
}

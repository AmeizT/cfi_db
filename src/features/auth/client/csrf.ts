import { apiRoutes } from "@/config/urls"

const CSRF_COOKIE_NAME = "csrftoken"

function readCsrfCookie() {
    if (typeof document === "undefined") return undefined

    const prefix = `${CSRF_COOKIE_NAME}=`
    const cookie = document.cookie
        .split(";")
        .map(value => value.trim())
        .find(value => value.startsWith(prefix))

    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined
}

export async function initializeCsrf() {
    let token = readCsrfCookie()
    if (token) return token

    const response = await fetch(apiRoutes.auth.csrf(), {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    })

    // The existing local/production Django auth surface does not expose a
    // dedicated CSRF bootstrap route. Preserve its pre-refactor behavior while
    // allowing deployments that do provide the route to opt into the header.
    if (response.status === 404) return undefined

    if (!response.ok) {
        throw new Error("Unable to initialize CSRF protection")
    }

    token = readCsrfCookie()
    return token
}

export async function authenticatedFetch(
    input: RequestInfo | URL,
    init: RequestInit = {}
) {
    const method = (init.method || "GET").toUpperCase()
    const headers = new Headers(init.headers)

    if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
        const csrfToken = await initializeCsrf()
        if (csrfToken && !headers.has("X-CSRFToken")) {
            headers.set("X-CSRFToken", csrfToken)
        }
    }

    return fetch(input, {
        ...init,
        headers,
        credentials: "include",
    })
}

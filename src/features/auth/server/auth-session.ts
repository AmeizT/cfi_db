import type { NextResponse } from "next/server"

export const ACCESS_COOKIE_NAME = "accessToken"
export const REFRESH_COOKIE_NAME = "refreshToken"
export const CSRF_COOKIE_NAME = "csrftoken"

export interface AuthTokens {
    access?: string
    refresh?: string
}

function configuredBackendUrl() {
    const isDevelopment = process.env.NODE_ENV === "development"
    const url = process.env.NEXT_PUBLIC_API_URL
        || (isDevelopment
            ? process.env.NEXT_PUBLIC_SERVER_DEV_URL
            : process.env.NEXT_PUBLIC_SERVER_PROD_URL)

    if (!url) {
        throw new Error(
            "Missing Django API URL. Set NEXT_PUBLIC_API_URL or the matching NEXT_PUBLIC_SERVER_*_URL."
        )
    }

    return url.replace(/\/+$/, "")
}

export function getBackendApiUrl(path: string) {
    const cleanPath = path.replace(/^\/+/, "")
    return `${configuredBackendUrl()}/${cleanPath}`
}

function decodeJwtExpiry(token: string) {
    try {
        const encodedPayload = token.split(".")[1]
        if (!encodedPayload) return undefined

        const normalized = encodedPayload.replace(/-/g, "+").replace(/_/g, "/")
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
        const payload = JSON.parse(atob(padded)) as { exp?: number }
        return payload.exp
    } catch {
        return undefined
    }
}

export function isJwtExpired(token: string, clockSkewSeconds = 0) {
    const expiresAt = decodeJwtExpiry(token)
    if (!expiresAt) return true
    return expiresAt <= Math.floor(Date.now() / 1000) + clockSkewSeconds
}

function cookieMaxAge(token: string) {
    const expiresAt = decodeJwtExpiry(token)
    if (!expiresAt) return undefined
    return Math.max(0, expiresAt - Math.floor(Date.now() / 1000))
}

function authCookieOptions(token?: string) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        ...(token ? { maxAge: cookieMaxAge(token) } : {}),
    }
}

export function setAuthCookies(response: NextResponse, tokens: AuthTokens) {
    if (tokens.access) {
        response.cookies.set(
            ACCESS_COOKIE_NAME,
            tokens.access,
            authCookieOptions(tokens.access)
        )
    }

    if (tokens.refresh) {
        response.cookies.set(
            REFRESH_COOKIE_NAME,
            tokens.refresh,
            authCookieOptions(tokens.refresh)
        )
    }
}

export function clearAuthCookies(response: NextResponse) {
    response.cookies.set(ACCESS_COOKIE_NAME, "", {
        ...authCookieOptions(),
        maxAge: 0,
    })
    response.cookies.set(REFRESH_COOKIE_NAME, "", {
        ...authCookieOptions(),
        maxAge: 0,
    })
}

function cookieValueFromSetCookie(headers: Headers, name: string) {
    const getSetCookie = (headers as Headers & {
        getSetCookie?: () => string[]
    }).getSetCookie
    const values = typeof getSetCookie === "function"
        ? getSetCookie.call(headers)
        : [headers.get("set-cookie") || ""]

    for (const value of values) {
        const match = value.match(new RegExp(`(?:^|,\\s*)${name}=([^;]*)`))
        if (match) return decodeURIComponent(match[1])
    }

    return undefined
}

export function getCsrfCookieFromResponse(response: Response) {
    return cookieValueFromSetCookie(response.headers, CSRF_COOKIE_NAME)
}

export async function getAuthTokensFromResponse(response: Response): Promise<AuthTokens> {
    const tokens: AuthTokens = {
        access: cookieValueFromSetCookie(response.headers, ACCESS_COOKIE_NAME),
        refresh: cookieValueFromSetCookie(response.headers, REFRESH_COOKIE_NAME),
    }

    if (tokens.access && tokens.refresh) return tokens

    try {
        const data = await response.clone().json() as {
            access?: string
            refresh?: string
        }
        tokens.access ||= data.access
        tokens.refresh ||= data.refresh
    } catch {
        // Cookie-only responses intentionally have no token-bearing JSON body.
    }

    return tokens
}

export function replaceAuthCookies(cookieHeader: string, tokens: AuthTokens) {
    const cookies = cookieHeader
        .split(";")
        .map(cookie => cookie.trim())
        .filter(Boolean)
        .filter(cookie => {
            const name = cookie.split("=", 1)[0]
            return name !== ACCESS_COOKIE_NAME && name !== REFRESH_COOKIE_NAME
        })

    if (tokens.access) cookies.push(`${ACCESS_COOKIE_NAME}=${tokens.access}`)
    if (tokens.refresh) cookies.push(`${REFRESH_COOKIE_NAME}=${tokens.refresh}`)

    return cookies.join("; ")
}

function cookieHeaderValue(cookieHeader: string, name: string) {
    const prefix = `${name}=`
    const cookie = cookieHeader
        .split(";")
        .map(value => value.trim())
        .find(value => value.startsWith(prefix))
    return cookie?.slice(prefix.length)
}

export async function refreshBackendSession(
    refreshToken: string,
    cookieHeader = ""
): Promise<AuthTokens | null> {
    const csrfToken = cookieHeaderValue(cookieHeader, CSRF_COOKIE_NAME)
    const response = await fetch(getBackendApiUrl("api/v1/auth/jwt/refresh/"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        },
        body: JSON.stringify({ refresh: refreshToken }),
        cache: "no-store",
    })

    if (!response.ok) return null

    const tokens = await getAuthTokensFromResponse(response)
    return tokens.access ? tokens : null
}

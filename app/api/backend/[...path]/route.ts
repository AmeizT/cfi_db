import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import {
    CSRF_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    clearAuthCookies,
    getAuthTokensFromResponse,
    getBackendApiUrl,
    getCsrfCookieFromResponse,
    refreshBackendSession,
    replaceAuthCookies,
    setAuthCookies,
} from "@/features/auth/server/auth-session"

const BODYLESS_METHODS = new Set(["GET", "HEAD"])
const AUTH_PATH_PATTERN = /\/auth\/(?:login|logout|jwt\/refresh)\/?$/

interface RouteContext {
    params: Promise<{ path: string[] }>
}

function upstreamHeaders(request: NextRequest, cookieHeader: string) {
    const headers = new Headers(request.headers)

    for (const name of [
        "accept-encoding",
        "connection",
        "content-length",
        "host",
        "x-forwarded-for",
        "x-forwarded-host",
        "x-forwarded-port",
        "x-forwarded-proto",
    ]) {
        headers.delete(name)
    }

    if (cookieHeader) headers.set("cookie", cookieHeader)

    const csrfToken = request.cookies.get(CSRF_COOKIE_NAME)?.value
    if (csrfToken && !headers.has("x-csrftoken")) {
        headers.set("x-csrftoken", csrfToken)
    }

    return headers
}

async function forwardRequest(
    request: NextRequest,
    path: string,
    body: ArrayBuffer | undefined,
    cookieHeader: string
) {
    // Next normalizes the gateway URL without a terminal slash. Django's API
    // routes use trailing slashes, so restore it before forwarding upstream.
    const djangoPath = path.endsWith("/") ? path : `${path}/`
    const target = new URL(getBackendApiUrl(djangoPath))
    target.search = request.nextUrl.search

    return fetch(target, {
        method: request.method,
        headers: upstreamHeaders(request, cookieHeader),
        body,
        redirect: "manual",
        cache: "no-store",
    })
}

function responseHeaders(upstream: Response) {
    const headers = new Headers(upstream.headers)

    for (const name of [
        "access-control-allow-credentials",
        "access-control-allow-origin",
        "content-encoding",
        "content-length",
        "set-cookie",
        "transfer-encoding",
    ]) {
        headers.delete(name)
    }

    return headers
}

async function handle(request: NextRequest, context: RouteContext) {
    const { path: segments } = await context.params
    const path = segments.join("/")
    const requestBody = BODYLESS_METHODS.has(request.method)
        ? undefined
        : await request.arrayBuffer()
    const originalCookieHeader = request.headers.get("cookie") || ""

    let upstream = await forwardRequest(
        request,
        path,
        requestBody,
        originalCookieHeader
    )
    let refreshedTokens: Awaited<ReturnType<typeof refreshBackendSession>> = null
    let refreshFailed = false

    if (upstream.status === 401 && !AUTH_PATH_PATTERN.test(`/${path}`)) {
        const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value

        if (refreshToken) {
            refreshedTokens = await refreshBackendSession(
                refreshToken,
                originalCookieHeader
            )

            if (refreshedTokens?.access) {
                const refreshedCookieHeader = replaceAuthCookies(
                    originalCookieHeader,
                    {
                        access: refreshedTokens.access,
                        refresh: refreshedTokens.refresh || refreshToken,
                    }
                )
                upstream = await forwardRequest(
                    request,
                    path,
                    requestBody,
                    refreshedCookieHeader
                )
            } else {
                refreshFailed = true
            }
        }
    }

    const upstreamTokens = await getAuthTokensFromResponse(upstream)
    const csrfToken = getCsrfCookieFromResponse(upstream)

    const response = new NextResponse(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders(upstream),
    })

    setAuthCookies(response, {
        access: upstreamTokens.access || refreshedTokens?.access,
        refresh: upstreamTokens.refresh || refreshedTokens?.refresh,
    })

    if (csrfToken) {
        response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        })
    }

    const isLogout = /\/auth\/logout\/?$/.test(`/${path}`)
    if (isLogout || refreshFailed) clearAuthCookies(response)

    return response
}

export const GET = handle
export const HEAD = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
export const OPTIONS = handle

export const dynamic = "force-dynamic"

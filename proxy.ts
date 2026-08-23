import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { routing } from "./src/i18n/routing"
import createMiddleware from "next-intl/middleware"
import {
    clearAuthCookies,
    isJwtExpired,
    refreshBackendSession,
    setAuthCookies,
} from "./src/features/auth/server/auth-session"
import {
    isAuthRoute,
    shouldBypassProxy,
} from "./src/features/auth/server/proxy-routing"

const intlMiddleware = createMiddleware(routing)

export default async function proxy(request: NextRequest) {
    if (shouldBypassProxy(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    const nextUrl = new URL("/app/dashboard", request.nextUrl)
    const authUrl = new URL("/en/auth/login", request.nextUrl)
    const expiredAuthUrl = new URL("/en/auth/login?expired=1", request.nextUrl)
    const accessToken = request.cookies.get("accessToken")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value
    const authRoute = isAuthRoute(request.nextUrl.pathname)

    if (!refreshToken) {
        if (!authRoute) return NextResponse.redirect(authUrl)
        return intlMiddleware(request)
    }

    if (isJwtExpired(refreshToken)) {
        const response = authRoute
            ? intlMiddleware(request)
            : NextResponse.redirect(expiredAuthUrl)
        clearAuthCookies(response)
        return response
    }

    if (!accessToken || isJwtExpired(accessToken, 30)) {
        try {
            const refreshedTokens = await refreshBackendSession(
                refreshToken,
                request.headers.get("cookie") || ""
            )

            if (refreshedTokens?.access) {
                const destination = authRoute ? nextUrl : request.nextUrl
                const response = NextResponse.redirect(destination)
                setAuthCookies(response, {
                    access: refreshedTokens.access,
                    refresh: refreshedTokens.refresh || refreshToken,
                })
                return response
            }
        } catch (error) {
            console.error("Session refresh failed in proxy:", error)
        }

        const response = authRoute
            ? intlMiddleware(request)
            : NextResponse.redirect(expiredAuthUrl)
        clearAuthCookies(response)
        return response
    }

    if (authRoute) return NextResponse.redirect(nextUrl)

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
        "/app/:path*",
        "/auth/:path*",
        "/:locale/auth/:path*",
        "/admin/:path*",
        "/analytics/:path*",
        "/attendance/:path*",
        "/changelog/:path*",
        "/churches/:path*",
        "/congregation/:path*",
        "/dashboard/:path*",
        "/demographics/:path*",
        "/discuss/:path*",
        "/docs/:path*",
        "/editor/:path*",
        "/events/:path*",
        "/feed/:path*",
        "/fellowship/:path*",
        "/forms/:path*",
        "/finance/:path*",
        "/gallery/:path*",
        "/groups/:path*",
        "/homecell/:path*",
        "/inbox/:path*",
        "/insights/:path*",
        "/lab/:path*",
        "/manage/:path*",
        "/messages/:path*",
        "/meetings/:path*",
        "/people/:path*",
        "/projects/:path*",
        "/onboarding/:path*",
        "/observability/:path*",
        "/resources/:path*",
        "/reports/:path*",
        "/settings/:path*",
        "/strategy/:path*",
        "/tracker/:path*",
        "/trash/:path*",
        "/workspace/:path*",
    ]
}

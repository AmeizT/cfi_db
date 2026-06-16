import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { routing } from "./src/i18n/routing"
import createMiddleware from "next-intl/middleware"

function isTokenExpired(token: string) {
    try {
        const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
        )

        const exp = payload.exp * 1000
        return Date.now() > exp
    } catch {
        return true
    }
}

export async function proxy(request: NextRequest) {
    const nextUrl = new URL("/app/dashboard", request.nextUrl)
    const authUrl = new URL("/en/auth/login", request.nextUrl)
    const expiredAuthUrl = new URL("/en/auth/login?expired=1", request.nextUrl)
    const refreshToken = request.cookies.get("refreshToken")?.value

    let isAuthenticated = false

    if (refreshToken) {
        const expired = isTokenExpired(refreshToken)
        
        if (!expired) {
            isAuthenticated = true
        } else {
            const response = NextResponse.redirect(expiredAuthUrl)
            response.cookies.delete("accessToken")
            response.cookies.delete("refreshToken")
            return response
        }
    }

    const isAuthRoute = request.nextUrl.pathname.includes("/auth")

    if (!isAuthenticated && !isAuthRoute) {
        return NextResponse.redirect(authUrl)
    }

    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(nextUrl)
    }

    return NextResponse.next()
}

export default createMiddleware(routing)

export const config = {
    matcher: [
        "/",
        "/app/:path*",
        "/auth/:path*",
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
        "/insights:path*",
        "/lab/:path*",
        "/manage/:path*",
        "/messages/:path*",
        "/meetings/:path*",
        "/people/:path*",
        "/projects/:path*",
        "/onboarding/:path*",
        "/observability:path*",
        "/resources/:path*",
        "/reports/:path*",
        "/settings/:path*",
        "/strategy/:path*",
        "/tracker/:path*",
        "/trash/:path*",
    ]
}
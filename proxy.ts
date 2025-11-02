import { url } from "./src/config/urls"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { routing } from "./src/i18n/routing"
import createMiddleware from "next-intl/middleware"

interface Token {
    token: string
}

export async function proxy(request: NextRequest) {
    const nextUrl = new URL("/", request.nextUrl)
    const authUrl = new URL("/en/auth/login", request.nextUrl)
    const accessToken = request.cookies.get("accessToken")?.value ?? undefined
    let isAuthenticated = !!accessToken

    if (isAuthenticated) {
        try {
            const response = await fetch(url.verifySession, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: accessToken as Token["token"] }),
            })

            isAuthenticated = response.ok
        } catch (error) {
            console.error("Failed to verify session", error)
            isAuthenticated = false
        }
    }

    if (!isAuthenticated && !request.nextUrl.pathname.startsWith("/auth")) {
        return NextResponse.redirect(authUrl)
    } else if (isAuthenticated && request.nextUrl.pathname.startsWith("/auth")) {
        return NextResponse.redirect(nextUrl)
    }

    return NextResponse.next()
}

export default createMiddleware(routing)

export const config = {
    matcher: [
        "/",
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
        "/finance/:path*",
        "/gallery/:path*",
        "/groups/:path*",
        "/homecell/:path*",
        "/inbox/:path*",
        "/insights:path*",
        "/lab/:path*",
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
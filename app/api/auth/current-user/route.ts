import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserForCookies } from "@/features/auth/server/current-user"
import { CurrentUserError } from "@/features/auth/services/get-user-core"
import {
    REFRESH_COOKIE_NAME, refreshBackendSession, replaceAuthCookies, setAuthCookies,
} from "@/features/auth/server/auth-session"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    const headers = { "Cache-Control": "private, no-store" }
    try {
        const cookieHeader = request.headers.get("cookie") || ""
        let user = await getCurrentUserForCookies(cookieHeader)
        let tokens = null
        const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value
        // API routes bypass page middleware. Retry only a real 401, never a timeout.
        if (!user && refreshToken) {
            tokens = await refreshBackendSession(refreshToken, cookieHeader)
            if (tokens?.access) {
                user = await getCurrentUserForCookies(replaceAuthCookies(cookieHeader, {
                    access: tokens.access,
                    refresh: tokens.refresh || refreshToken,
                }))
            }
        }
        const response = NextResponse.json(user, { status: user ? 200 : 401, headers })
        if (user && tokens) setAuthCookies(response, tokens)
        return response
    } catch (error) {
        const code = error instanceof CurrentUserError ? error.code : "unexpected"
        const status = error instanceof CurrentUserError ? error.status : undefined
        return Response.json({ code, status }, {
            status: code === "timeout" ? 504 : status === 403 ? 403 : 502,
            headers,
        })
    }
}

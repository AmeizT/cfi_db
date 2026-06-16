import { apiRoutes } from "@/config/urls"

export async function logout() {
    await fetch(apiRoutes.auth.logout(), {
        method: "POST",
        credentials: "include",
    }).catch(console.error)

    document.cookie = "accessToken=; Max-Age=0; path=/; samesite=None; secure"
    document.cookie = "refreshToken=; Max-Age=0; path=/; samesite=None; secure"
}
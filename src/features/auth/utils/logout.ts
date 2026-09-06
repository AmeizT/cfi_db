import { apiRoutes } from "@/config/urls"
import { authenticatedFetch } from "../client/csrf"

export async function logout() {
    const response = await authenticatedFetch(apiRoutes.auth.logout(), {
        method: "POST",
    })

    if (!response.ok) {
        console.error(`Backend logout failed with status ${response.status}`)
    }
}

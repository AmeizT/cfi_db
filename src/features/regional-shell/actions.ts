"use server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { url } from "@/config/urls"
import { UserSchema } from "@/features/auth/schemas/user"

export async function setActiveRegionalZone(zone: number) {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value
    if (!token) throw new Error("Not authenticated")
    const response = await fetch(url.currentUser, {
        method: "PATCH", cache: "no-store",
        headers: { "Content-Type": "application/json", authorization: `JWT ${token}` },
        body: JSON.stringify({ regional_zone: zone }),
    })
    if (!response.ok) throw new Error("Could not switch to this zone. Please try again.")
    const user = UserSchema.parse(await response.json())
    revalidatePath("/", "layout")
    return user
}

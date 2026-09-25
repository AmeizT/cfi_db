import React from "react"
import { cookies } from "next/headers"
import { getCurrentUserForCookies } from "../server/current-user"

// Request-local RSC memoization; never share authenticated users across requests.
export const getUser = React.cache(async () => {
    const cookieStore = await cookies()
    return getCurrentUserForCookies(cookieStore.toString())
})

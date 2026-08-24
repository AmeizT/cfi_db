"use server"

import React from "react"
import { url } from "@/config/urls"
import { cookies } from "next/headers"
import { fetchCurrentUser } from "./get-user-core"

export const getUser = React.cache(async () => {
    const cookieStore = await cookies()
    return fetchCurrentUser({
        endpoint: url.currentUser,
        cookieHeader: cookieStore.toString(),
    })
})

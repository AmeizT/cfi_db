"use server"

import { cache } from "react"
import { cookies } from "next/headers"
import { MinorMember } from "@/types"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

interface RequestProps {
    pk?: string
    fullname?: string 
}

export const getMembers = cache(async ({ pk, fullname }:RequestProps = {}) => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    let memberUrl = url.members.replace(/\/$/, "")

    if (pk) {
        memberUrl += `/${pk}`
    } else if (fullname) {
        memberUrl += `?fullname=${encodeURIComponent(fullname)}`
    }

    try {
        const res = await fetch(memberUrl, withJwt(accessToken))

        if (!res.ok) {
            throw new Error(`Failed to fetch ${pk ? "member" : "members"} data.`)
        }

        return await res.json()
    } catch (error) {
        console.error("Error fetching members:", error)
        return { error: "An unexpected error occurred. Please try again later." }
    }
})

export async function getJuniorMembers(id?: string) {
    const cookieStore = await cookies()
    const juniorMembersUrl = url.juniorMembers
    const findOneMemberUrl = `${juniorMembersUrl}${id}`
    const findOne = id !== undefined
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    if (!findOne) {
        try {
            const res = await fetch(juniorMembersUrl, withJwt(accessToken))
            if (!res.ok) {
                throw new Error("Failed to fetch members. Please try again later.")
            }
            const members: MinorMember[] = await res.json()
            return members
        } catch (error) {
            throw error
        }
    } else {
        try {
            const res = await fetch(findOneMemberUrl, withJwt(accessToken))
            if (!res.ok) {
                throw new Error("Failed to fetch member data. Please try again later.")
            }
            const member = await res.json()
            return member
        } catch (error) {
            throw error
        }
    }
}
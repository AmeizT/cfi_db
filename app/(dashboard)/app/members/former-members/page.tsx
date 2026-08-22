import { redirect } from "next/navigation"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function FormerMembersPage({ searchParams }: { searchParams: SearchParams }) {
    const params = new URLSearchParams()
    Object.entries(await searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach((item) => params.append(key, item))
        else if (value !== undefined) params.append(key, value)
    })
    params.set("segment", "former")
    redirect(`/members/directory?${params.toString()}`)
}

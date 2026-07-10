import { redirect } from "next/navigation"

type RegionalStaffPluralOverviewPageProps = {
    params: Promise<{ id: string }>
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

function buildQueryString(params: Record<string, string | string[] | undefined>) {
    const query = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            value.forEach((item) => query.append(key, item))
        } else if (value) {
            query.set(key, value)
        }
    }

    const value = query.toString()

    return value ? `?${value}` : ""
}

export default async function RegionalStaffPluralOverviewPage({
    params,
    searchParams,
}: RegionalStaffPluralOverviewPageProps) {
    const { id } = await params
    const queryString = buildQueryString(await searchParams)

    redirect(`/regional-staff/region/${id}${queryString}`)
}

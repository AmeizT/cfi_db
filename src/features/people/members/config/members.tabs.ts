import type { ReadonlyURLSearchParams } from "next/navigation"
import { APP_ROUTES } from "@/config/app-routes"

export function getMembersTabs(searchParams?: ReadonlyURLSearchParams) {
    const withQuery = (pathname: string) => {
        const query = searchParams?.toString()
        return query ? `${pathname}?${query}` : pathname
    }
    const tabs = [
        {
            label: "All",
            key: "directory",
            href: withQuery(APP_ROUTES.members.directory),
        },
        {
            label: "Adults",
            key: "adults",
            href: withQuery(`${APP_ROUTES.members.directory}/adults`),
        },
        {
            label: "Children",
            key: "children",
            href: withQuery(`${APP_ROUTES.members.directory}/children`),
        },
        {
            label: "Former",
            key: "former",
            href: withQuery(`${APP_ROUTES.members.directory}/former`),
        },
    ]

    return tabs
}

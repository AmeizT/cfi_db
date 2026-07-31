import type { ReadonlyURLSearchParams } from "next/navigation"

export function getMembersTabs(searchParams?: ReadonlyURLSearchParams) {
    const tabs = [
        {
            label: "All",
            key: "directory",
            href: "/app/members/directory",
        },
        {
            label: "Adults",
            key: "adults",
            href: "/app/members/directory/adults",
        },
        {
            label: "Children",
            key: "children",
            href: "/app/members/directory/children",
        },
        {
            label: "Former",
            key: "former",
            href: "/app/members/directory/former",
        },
    ]

    return tabs
}

import { APP_ROUTES } from "@/config/app-routes"

export const MEMBERS_SECTION_NAVIGATION = [
    {
        key: "directory",
        label: "Directory",
        href: APP_ROUTES.members.directory,
    },
    {
        key: "households",
        label: "Households",
        href: APP_ROUTES.members.households,
    },
    {
        key: "lifecycle",
        label: "Lifecycle",
        href: APP_ROUTES.members.lifecycle,
    },
] as const

export const MEMBERS_LIFECYCLE_NAVIGATION = [
    {
        key: "onboarding",
        label: "Onboarding",
        href: APP_ROUTES.members.onboarding,
    },
    {
        key: "baptisms",
        label: "Baptisms",
        href: APP_ROUTES.members.baptisms,
    },
    {
        key: "dedications",
        label: "Dedications",
        href: APP_ROUTES.members.dedications,
    },
    {
        key: "transfers",
        label: "Transfers",
        href: APP_ROUTES.members.transfers,
    },
] as const

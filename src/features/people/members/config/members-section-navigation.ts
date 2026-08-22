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

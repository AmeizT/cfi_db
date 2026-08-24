import type { ReactNode } from "react"

import HeadlessSidebarLayout from "@/layouts/dashboard/SidebarLayout"

export default function AuthenticatedManageLayout({ children }: { children: ReactNode }) {
    return <HeadlessSidebarLayout>{children}</HeadlessSidebarLayout>
}

import type { ReactNode } from "react"

import { HeadlessAppLayout } from "@/layouts/HeadlessAppLayout"

export default function AuthenticatedHeadlessLayout({ children }: { children: ReactNode }) {
    return <HeadlessAppLayout>{children}</HeadlessAppLayout>
}

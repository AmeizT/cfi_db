import React from "react"
import { HeadlessAppLayout } from "@/layouts/HeadlessAppLayout";

interface ChildrenProps {
    children: Readonly<React.ReactNode>
}

export default function DashboardRootLayout({ children }: ChildrenProps) {
    return (
        <HeadlessAppLayout>{children}</HeadlessAppLayout>
    )
}

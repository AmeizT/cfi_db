import { getLayoutComponent } from "@/layouts/registry"

const HeadlessLayout = getLayoutComponent("headless")

export function HeadlessAppLayout({
    children,
}: {
    children: Readonly<React.ReactNode>
}) {
    return <HeadlessLayout>{children}</HeadlessLayout>
}

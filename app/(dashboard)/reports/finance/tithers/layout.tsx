import type { ReactNode } from "react"
import { TithesModuleLayout } from "@/features/reports/finance/tithes/workspace/TithesWorkspace"

export default function TithesLayout({ children }: { children: ReactNode }) {
    return <TithesModuleLayout>{children}</TithesModuleLayout>
}

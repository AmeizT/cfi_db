import { Suspense, type ReactNode } from "react"
import { RecordCenterShell } from "@/features/record-center/views/RecordCenterShell"

export default function Layout({ children }: { children: ReactNode }) {
    return <Suspense><RecordCenterShell>{children}</RecordCenterShell></Suspense>
}

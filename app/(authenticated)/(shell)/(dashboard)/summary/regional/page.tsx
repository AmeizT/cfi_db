import { Suspense } from "react"
import { SummaryPage } from "@/features/summaries/SummaryPage"

export default function Page() {
    return (
        <Suspense fallback={<p className="p-8">Loading summary…</p>}>
            <SummaryPage kind="regional" />
        </Suspense>
    )
}

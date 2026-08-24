import { notFound } from "next/navigation"
import { getMetaData } from "@/config/metadata"
import { ReportModulePageView } from "@/features/reports/modules/views/ReportModulePageView"

const VIEWS = ["statement", "cumulative", "revenue", "expenses"] as const
type FinancialActivityView = (typeof VIEWS)[number]

export const metadata = getMetaData({ title: "Financial Activity" })

export default async function FinancialActivityViewPage({
    params,
}: {
    params: Promise<{ view: string }>
}) {
    const { view } = await params

    if (!VIEWS.includes(view as FinancialActivityView)) notFound()

    return (
        <ReportModulePageView
            section="finance"
            module="financial-activity"
            submodule={view}
        />
    )
}

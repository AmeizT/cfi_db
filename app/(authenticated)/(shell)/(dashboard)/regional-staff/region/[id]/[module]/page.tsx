import { notFound } from "next/navigation"
import { RegionalModulePageView } from "@/features/reports/region/views/RegionalModulePageView"
import type { RegionalModuleKey } from "@/features/reports/region/types/regional-modules"

const MODULES = new Set<RegionalModuleKey>([
    "finance",
    "compliance",
    "risk",
    "growth",
    "ministry",
    "leadership",
])

type RegionalStaffModulePageProps = {
    params: Promise<{
        id: string
        module: string
    }>
}

export default async function RegionalStaffModulePage({
    params,
}: RegionalStaffModulePageProps) {
    const { id, module } = await params

    if (!MODULES.has(module as RegionalModuleKey)) {
        notFound()
    }

    return (
        <RegionalModulePageView
            regionId={id}
            module={module as RegionalModuleKey}
        />
    )
}

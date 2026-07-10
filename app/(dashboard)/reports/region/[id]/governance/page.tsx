import { RegionalDashboardView } from "@/features/reports/region/views/RegionalDashboardView"

type RegionalDashboardPageProps = {
    params: Promise<{ id: string }>
}

export default async function RegionalDashboardPage({
    params,
}: RegionalDashboardPageProps) {
    const { id } = await params

    return <RegionalDashboardView regionId={id} />
}

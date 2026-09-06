import { RegionalOverviewView } from "@/features/reports/region/views/RegionalOverviewView"

type RegionalDashboardPageProps = {
    params: Promise<{ id: string }>
}

export default async function RegionalDashboardPage({
    params,
}: RegionalDashboardPageProps) {
    const { id } = await params

    return <RegionalOverviewView regionId={id} />
}

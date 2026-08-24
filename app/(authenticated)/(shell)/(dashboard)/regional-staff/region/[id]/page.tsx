import { RegionalOverviewView } from "@/features/reports/region/views/RegionalOverviewView"

type RegionalStaffOverviewPageProps = {
    params: Promise<{ id: string }>
}

export default async function RegionalStaffOverviewPage({
    params,
}: RegionalStaffOverviewPageProps) {
    const { id } = await params

    return <RegionalOverviewView regionId={id} />
}

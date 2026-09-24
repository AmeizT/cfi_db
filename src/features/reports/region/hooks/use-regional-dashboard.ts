import { useRegionalZoneKey } from "@/features/regional-shell/use-regional-zone-key"
import { useQuery } from "@tanstack/react-query"
import { getRegionalDashboard } from "../services/get-regional-dashboard"
import type { RegionalDashboardResponse } from "../types/regional-dashboard"

type UseRegionalDashboardParams = {
    regionId: string
    year?: string
}

export function useRegionalDashboard({
    regionId,
    year,
}: UseRegionalDashboardParams) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalDashboardResponse>({
        queryKey: ["regionalDashboard", regionId, zone, year ?? "current"],
        queryFn: () => getRegionalDashboard({ regionId, year }),
        enabled: Boolean(regionId),
    })
}

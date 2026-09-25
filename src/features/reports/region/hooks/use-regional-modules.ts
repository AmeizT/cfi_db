import { useRegionalZoneKey } from "@/features/regional-shell/use-regional-zone-key"
import { useQuery } from "@tanstack/react-query"
import {
    getRegionalCompliance,
    getRegionalFinance,
    getRegionalGrowth,
    getRegionalLeadership,
    getRegionalMinistry,
    getRegionalOverview,
    getRegionalRisk,
} from "../services/get-regional-modules"
import type {
    RegionalModuleKey,
    RegionalModuleResponse,
    RegionalOverviewResponse,
} from "../types/regional-modules"

const regionalModuleFetchers: Record<
    RegionalModuleKey,
    (regionId: string | number) => Promise<RegionalModuleResponse>
> = {
    finance: getRegionalFinance,
    compliance: getRegionalCompliance,
    risk: getRegionalRisk,
    growth: getRegionalGrowth,
    ministry: getRegionalMinistry,
    leadership: getRegionalLeadership,
}

export function useRegionalOverview(regionId: string | number) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalOverviewResponse>({
        queryKey: ["regional", regionId, zone, "overview"],
        queryFn: () => getRegionalOverview(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalFinance(regionId: string | number) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, zone, "finance"],
        queryFn: () => getRegionalFinance(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalCompliance(regionId: string | number) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, zone, "compliance"],
        queryFn: () => getRegionalCompliance(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalRisk(regionId: string | number) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, zone, "risk"],
        queryFn: () => getRegionalRisk(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalGrowth(regionId: string | number) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, zone, "growth"],
        queryFn: () => getRegionalGrowth(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalMinistry(regionId: string | number) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, zone, "ministry"],
        queryFn: () => getRegionalMinistry(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalLeadership(regionId: string | number) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, zone, "leadership"],
        queryFn: () => getRegionalLeadership(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalModule(
    regionId: string | number,
    module: RegionalModuleKey
) {
    const zone = useRegionalZoneKey()
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, zone, module],
        queryFn: () => regionalModuleFetchers[module](regionId),
        enabled: Boolean(regionId),
    })
}

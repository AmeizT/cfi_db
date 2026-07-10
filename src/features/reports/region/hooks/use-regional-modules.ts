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
    return useQuery<RegionalOverviewResponse>({
        queryKey: ["regional", regionId, "overview"],
        queryFn: () => getRegionalOverview(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalFinance(regionId: string | number) {
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, "finance"],
        queryFn: () => getRegionalFinance(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalCompliance(regionId: string | number) {
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, "compliance"],
        queryFn: () => getRegionalCompliance(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalRisk(regionId: string | number) {
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, "risk"],
        queryFn: () => getRegionalRisk(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalGrowth(regionId: string | number) {
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, "growth"],
        queryFn: () => getRegionalGrowth(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalMinistry(regionId: string | number) {
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, "ministry"],
        queryFn: () => getRegionalMinistry(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalLeadership(regionId: string | number) {
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, "leadership"],
        queryFn: () => getRegionalLeadership(regionId),
        enabled: Boolean(regionId),
    })
}

export function useRegionalModule(
    regionId: string | number,
    module: RegionalModuleKey
) {
    return useQuery<RegionalModuleResponse>({
        queryKey: ["regional", regionId, module],
        queryFn: () => regionalModuleFetchers[module](regionId),
        enabled: Boolean(regionId),
    })
}

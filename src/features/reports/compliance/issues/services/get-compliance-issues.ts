"use server"

import { cookies } from "next/headers"
import { apiRoutes } from "@/config/urls"
import {
    ComplianceIssuesResponseSchema,
    type ComplianceIssueFollowUpStatus,
    type ComplianceIssuesResponse,
    type ComplianceIssueType,
} from "../schemas/issues"

export type ComplianceIssuesParams = {
    regionId: string | number
    year?: string | number
    zoneId?: string | number | null
    country?: string | null
    assemblyId?: string | number | null
    issueType?: ComplianceIssueType | null
    followUpStatus?: ComplianceIssueFollowUpStatus | null
}

function appendIfPresent(
    params: URLSearchParams,
    key: string,
    value: string | number | null | undefined
) {
    if (value === null || value === undefined || value === "") {
        return
    }

    params.set(key, String(value))
}

export async function getComplianceIssues({
    regionId,
    year,
    zoneId,
    country,
    assemblyId,
    issueType,
    followUpStatus,
}: ComplianceIssuesParams): Promise<ComplianceIssuesResponse> {
    const cookieStore = await cookies()
    const params = new URLSearchParams()

    appendIfPresent(params, "year", year)
    appendIfPresent(params, "zone_id", zoneId)
    appendIfPresent(params, "country", country)
    appendIfPresent(params, "assembly_id", assemblyId)
    appendIfPresent(params, "reason", issueType)
    appendIfPresent(params, "follow_up_status", followUpStatus?.toLowerCase())

    const queryString = params.toString()
    const endpoint = `${apiRoutes.reports.regions.complianceAuditLog(regionId)}${
        queryString ? `?${queryString}` : ""
    }`

    const response = await fetch(endpoint, {
        headers: {
            Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch compliance issues.")
    }

    return ComplianceIssuesResponseSchema.parse(await response.json())
}


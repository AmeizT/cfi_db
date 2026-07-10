import { useQuery } from "@tanstack/react-query"
import {
    getComplianceIssues,
    type ComplianceIssuesParams,
} from "../services/get-compliance-issues"
import type { ComplianceIssuesResponse } from "../schemas/issues"

export function useComplianceIssues(params: ComplianceIssuesParams) {
    return useQuery<ComplianceIssuesResponse>({
        queryKey: [
            "reports",
            "compliance",
            "issues",
            params.regionId,
            params.year ?? "current",
            params.zoneId ?? "all-zones",
            params.country ?? "all-countries",
            params.assemblyId ?? "all-assemblies",
            params.issueType ?? "all-issue-types",
            params.followUpStatus ?? "all-follow-up-statuses",
        ],
        queryFn: () => getComplianceIssues(params),
        enabled: Boolean(params.regionId),
    })
}


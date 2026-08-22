import type { ReportCapabilities, ReportStatus } from "@/features/reports/workflow/types"

export type ReportContextActionVisibility = {
    editInWizard: boolean
    viewSubmittedSection: boolean
    viewReport: boolean
    amendReport: boolean
    requestReopening: boolean
}

export function getReportContextActionVisibility(
    status: ReportStatus,
    capabilities: Pick<ReportCapabilities, "is_editable" | "can_amend" | "can_request_reopen">,
): ReportContextActionVisibility {
    const submitted = status === "submitted" || status === "locked"

    return {
        editInWizard: capabilities.is_editable && !submitted,
        viewSubmittedSection: submitted,
        viewReport: true,
        amendReport: status === "submitted" && capabilities.can_amend,
        requestReopening: status === "locked" && capabilities.can_request_reopen,
    }
}

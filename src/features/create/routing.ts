import { createMonthlyReportHref } from "./monthly-report/routing"
import {
    REPORT_SECTION_WIZARD_ROUTES,
    type ReportWizardHrefOptions,
    type WorkflowReportSectionKey,
} from "@/features/report-wizard/config/report-routing"

export const createReportWizardHref = createMonthlyReportHref
export { REPORT_SECTION_WIZARD_ROUTES }

export function createReportSectionWizardHref(
    section: WorkflowReportSectionKey,
    options: ReportWizardHrefOptions = {},
) {
    return createMonthlyReportHref(REPORT_SECTION_WIZARD_ROUTES[section], options)
}

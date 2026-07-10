import { redirect } from "next/navigation"
import {
    REPORT_WIZARD_SECTIONS,
    createReportWizardHref,
} from "@/features/report-wizard/config/report-types"

export default function ReportWizardCreatePage() {
    redirect(createReportWizardHref(REPORT_WIZARD_SECTIONS[0]?.id ?? "attendance", {
        method: "quick-entry",
    }))
}

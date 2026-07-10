import { forms } from "../menu/forms.nav"
import { dashboard } from "../menu/dashboard.nav"
import { navRail } from "../menu/rail.nav"
import { reportWizard } from "../menu/report-wizard.nav"
import { reports } from "../menu/reports.nav"
import { settings } from "../menu/settings.nav"
import { ReadonlyURLSearchParams } from "next/navigation";
import { region } from "../menu/region.nav"

type GetNavigationParams = {
    searchParams: ReadonlyURLSearchParams
    user?: {
        is_db_zone_staff?: boolean
        is_region_staff?: boolean
    }
    reportId?: string
    regionId?: string
}

export function getNavigation({
    searchParams,
    user,
    reportId,
    regionId,
}: GetNavigationParams) {
    return {
        dashboard: dashboard(),
        forms: forms(reportId ?? ""),
        reports: reports(searchParams, reportId ?? ""),
        reportWizard: reportWizard(),
        rail: navRail({ user, searchParams, regionId: regionId ?? "" }),
        settings: settings(),
        region: region(searchParams, regionId ?? ""),
    }
}

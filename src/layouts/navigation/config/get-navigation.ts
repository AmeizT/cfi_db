import { NavItem, RailNavigation } from "../types"
import { forms } from "../menu/forms.nav"
import { dashboard } from "../menu/dashboard.nav"
import { navRail } from "../menu/rail.nav"
import { reports } from "../menu/reports.nav"
import { settings } from "../menu/settings.nav"
import { ReadonlyURLSearchParams } from "next/navigation";

export function getNavigation(
    searchParams: ReadonlyURLSearchParams,
    user?: { is_db_zone_staff?: boolean },
    reportId?: string,
): {
    dashboard: NavItem[]
    forms: NavItem[]
    reports: NavItem[]
    settings: NavItem[]
    rail: RailNavigation
} {
    const primaryKey = reportId || ""

    return {
        dashboard: dashboard(),
        forms: forms(primaryKey),
        reports: reports(searchParams, primaryKey),
        rail: navRail({ user, searchParams }),
        settings: settings(),
    }
}
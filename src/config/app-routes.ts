export const APP_ROUTES = {
    home: "/",
    ai: "/ai",
    reports: {
        overview: "/reports",
        current: "/reports/current",
        activity: "/reports/activity",
        compliance: "/reports/compliance",
        performance: "/reports/performance",
        insights: "/reports/insights",
    },
    finance: {
        root: "/finance/tithes",
        tithes: "/finance/tithes",
        revenue: "/finance/revenue",
        expenses: "/finance/expenses",
        statements: "/finance/statements",
        remittance: "/finance/remittance",
    },
    engagement: {
        root: "/engagement/attendance",
        attendance: "/engagement/attendance",
        sundaySchool: "/engagement/attendance/sunday-school",
        outreach: "/engagement/outreach",
        activities: "/engagement/activities",
        checkIns: "/engagement/check-ins",
    },
    members: {
        root: "/members/directory",
        directory: "/members/directory",
        households: "/members/households",
        onboarding: "/members/onboarding",
        baptisms: "/members/baptisms",
        dedications: "/members/dedications",
        transfers: "/members/transfers",
    },
    spaces: "/spaces",
    assets: "/assets",
    library: "/library",
    settings: "/settings",
} as const

export function attendanceRecordPath(recordId: string | number) {
    return `${APP_ROUTES.engagement.attendance}/records/${recordId}`
}

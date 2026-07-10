type Environment = "development" | "production"
const env = (process.env.NODE_ENV || "production") as Environment

const SERVER_URLS: Record<Environment, string> = {
    development: process.env.NEXT_PUBLIC_SERVER_DEV_URL!,
    production: process.env.NEXT_PUBLIC_SERVER_PROD_URL!,
}

const CLIENT_URLS: Record<Environment, string> = {
    development: process.env.NEXT_PUBLIC_CLIENT_DEV_URL!,
    production: process.env.NEXT_PUBLIC_CLIENT_PROD_URL!,
}

function buildUrl(baseUrl: string, path = "", trailingSlash = true): string {
    const cleanPath = path.replace(/^\/|\/$/g, "")
    const slash = trailingSlash ? "/" : ""
    return `${baseUrl}/${cleanPath}${slash}`
}

export function getServerUrl(path?: string, options: { trailingSlash?: boolean } = {}) {
    const trailingSlash = options.trailingSlash ?? true
    return buildUrl(SERVER_URLS[env], path, trailingSlash)
}

export function getClientUrl(path?: string, options: { trailingSlash?: boolean } = {}) {
    const trailingSlash = options.trailingSlash ?? true
    return buildUrl(CLIENT_URLS[env], path, trailingSlash)
}

const API_PREFIX = "api/v1"

const api = (path: string, options?: { trailingSlash?: boolean }) =>
    getServerUrl(`${API_PREFIX}/${path}`, options)

export const url = {
    analyzer: api("analyzer"),
    announcements: api("announcements"),
    assemblyAdmins: api("assembly_admins"),
    assemblies: api("assemblies"),
    assets: api("bookkeeper/assets"),
    attendance: api("people/attendance"),
    blogs: api("blogs"),
    createSession: api("auth/jwt/create"),
    currentUser: api("auth/users/me"),
    emailCheck: api("auth/check-email"),
    financeSummary: api("finance/monthly-summary"),
    yearlySummary: api("finance/yearly"),
    homecells: api("people/homecells"),
    income: api("income"),
    juniorMembers: api("people/junior_members"),
    expenditures: api("expenditure"),
    members: api("people/members"),
    sundaySchoolAttendance: api("people/sunday-school-attendance"),
    passwordReset: api("auth/users/reset_password"),
    passwordResetConfirm: api("auth/users/reset_password_confirm"),
    posts: api("posts"),
    postComments: api("post/comment"),
    refreshSession: api("auth/jwt/refresh"),
    reports: api("reports"),
    resources: api("resources"),
    regularExpenditures: api("regular_expenditure"),
    sessionHistory: api("auth/user_auth_history"),
    setPassword: api("auth/users/set_password"),
    terms: api("terms"),
    tithes: api("tithes"),
    trashedTithes: api("tithes/trashed"),
    verifySession: api("auth/jwt/verify"),
    users: api("auth/users"),
    user: api("auth/user"),
}


// =========================
// New Dynamic API Builders
// =========================

export const apiRoutes = {
    regional: {
        overview: (regionId: string | number) =>
            api(`reports/region/${regionId}/overview`),
        finance: (regionId: string | number) =>
            api(`reports/region/${regionId}/finance`),
        compliance: (regionId: string | number) =>
            api(`reports/region/${regionId}/compliance`),
        complianceMonthlyReportPdf: (regionId: string | number) =>
            api(`reports/region/${regionId}/compliance/monthly-report.pdf`, {
                trailingSlash: false,
            }),
        risk: (regionId: string | number) =>
            api(`reports/region/${regionId}/risk`),
        growth: (regionId: string | number) =>
            api(`reports/region/${regionId}/growth`),
        ministry: (regionId: string | number) =>
            api(`reports/region/${regionId}/ministry`),
        leadership: (regionId: string | number) =>
            api(`reports/region/${regionId}/leadership`),
    },

    regionalAdministration: {
        assemblies: () => api("regions/churches"),
        users: () => api("regions/users"),
    },

    assemblies: {
        list: () => api("churches/assemblies"),
        detail: (id: string | number) => api(`churches/assemblies/${id}`),
    },

    attendance: {
        list: () => api("people/attendance"),
        detail: (id: string | number) => api(`people/attendance/${id}`),
        bulkCreate: () => api("people/attendance/bulk-create"),
        bulkDelete: () => api("people/attendance/bulk_delete"),
    },

    sundaySchoolAttendance: {
        list: () => api("people/sunday-school-attendance"),
        detail: (id: string | number) => api(`people/sunday-school-attendance/${id}`),
        aggregates: () => api("people/sunday-school-attendance/aggregates"),
        approve: (id: string | number) => api(`people/sunday-school-attendance/${id}/approve`),
        reject: (id: string | number) => api(`people/sunday-school-attendance/${id}/reject`),
        review: (id: string | number) => api(`people/sunday-school-attendance/${id}/review`),
    },

    members: {
        list: () => api("people/members"),
        detail: (id: string | number) => api(`people/members/${id}`),
        transfers: (id: string | number) => api(`people/members/${id}/transfers`),
        assemblyMemberships: (id: string | number) =>
            api(`people/members/${id}/assembly-memberships`),
        junior: {
            list: () => api("people/junior_members"),
            detail: (id: string | number) => api(`people/junior_members/${id}`),
        },
    },

    memberTransfers: {
        list: () => api("people/member-transfers"),
        detail: (id: string | number) => api(`people/member-transfers/${id}`),
        incoming: () => api("people/member-transfers/incoming"),
        outgoing: () => api("people/member-transfers/outgoing"),
        history: () => api("people/member-transfers/history"),
        accept: (id: string | number) => api(`people/member-transfers/${id}/accept`),
        reject: (id: string | number) => api(`people/member-transfers/${id}/reject`),
        cancel: (id: string | number) => api(`people/member-transfers/${id}/cancel`),
    },

    assemblyMemberships: {
        list: () => api("people/assembly-memberships"),
        detail: (id: string | number) => api(`people/assembly-memberships/${id}`),
    },

    finance: {
        assets: {
            list: () => api("bookkeeper/assets"),
            detail: (id: string | number) => api(`bookkeeper/assets/${id}`),
        },
        income: {
            list: () => api("income"),
            detail: (id: string | number) => api(`income/${id}`),
        },
        expenditures: {
            list: () => api("expenditure"),
            detail: (id: string | number) => api(`expenditure/${id}`),
        },

        overhead: {
            list: () => api("overhead"),
            detail: (id: string | number) =>
                api(`overhead/${id}`),
        },
        revenue: {
            list: () => api("revenue"),
            detail: (id: string | number) =>
                api(`revenue/${id}`),
        },
        summary: {
            monthly: () => api("finance/monthly-summary"),
            yearly: () => api("finance/yearly"),
        },
        tithes: {
            list: () => api("tithes"),
            detail: (id: string | number) => api(`tithes/${id}`),
            trashed: () => api("tithes/trashed"),
            contributors: () => api("tithes/contributors"),
            receipts: () => api("tithes/receipts"),
            performance: () => api("tithes/performance"),
            auditLog: () => api("tithes/audit-log"),
        },
    },

    spaces: {
        homecells: {
            list: () => api("people/homecells"),
            detail: (id: string | number) => api(`people/homecells/${id}`),
        },
    },

    reports: {
        analyzer: (id: string | number) => api(`analyzer/${id}`),
        list: () => api("reports"),
        detail: (id: string | number) => api(`reports/${id}`),

        zoneReport: (zoneId: number) =>
            api(`zone-reports/${zoneId}`),

        regions: {
            dashboard: (id: string | number) =>
                api(`reports/metrics/regions/${id}`),
            country: (id: string | number, country: string) =>
                api(`reports/metrics/regions/${id}/countries/${encodeURIComponent(country)}`),
            zoneCompliance: (id: string | number, zoneId: string | number) =>
                api(`reports/metrics/regions/${id}/zones/${zoneId}/compliance`),
            complianceAuditLog: (id: string | number) =>
                api(`reports/metrics/regions/${id}/compliance/audit-log`),
        },

        auditLogs: {
            list: () => api("reports/audit-logs"),
            detail: (id: string | number) =>
                api(`reports/audit-logs/${id}`),
        },

        tithes: {
            list: (reportId: string | number) =>
                api(`reports/${reportId}/tithes`),
            contributors: (reportId: string | number) =>
                api(`reports/${reportId}/tithes/contributors`),
            contributorsPdf: (reportId: string | number) =>
                api(`reports/${reportId}/tithes/contributors/export.pdf`),
            contributorHistory: (
                reportId: string | number,
                memberId: string | number
            ) => api(`reports/${reportId}/tithes/contributors/${memberId}/history`),
            contributorHistoryPdf: (
                reportId: string | number,
                memberId: string | number
            ) => api(`reports/${reportId}/tithes/contributors/${memberId}/history/pdf`),
            analytics: (reportId: string | number) =>
                api(`reports/${reportId}/tithes/analytics`),
            performance: (reportId: string | number) =>
                api(`reports/${reportId}/tithes/performance`),
            receipts: (reportId: string | number) =>
                api(`reports/${reportId}/tithes/receipts`),
            auditLog: (reportId: string | number) =>
                api(`reports/${reportId}/tithes/audit-log`),
        },

        sections: {
            list: () => api("reports/sections"),
            detail: (id: string | number) => api(`reports/sections/${id}`),
            submit: (id: string | number) => api(`reports/sections/${id}/submit`),
            skip: (id: string | number) => api(`reports/sections/${id}/skip`),
            reset: (id: string | number) => api(`reports/sections/${id}/reset`),
        },

        compliance: {
            assemblies: {
                list: () => api("reports/compliance/assemblies"),
                detail: (id: string | number) =>
                    api(`reports/compliance/assemblies/${id}`),
            },

            zones: {
                list: () => api("reports/compliance/zones"),
                detail: (id: string | number) =>
                    api(`reports/compliance/zones/${id}`),
            },

            dashboard: () =>
                api("reports/compliance/dashboard"),
        },
    },

    auth: {
        djoserLogin: () => api("auth/jwt/create"),
        djoserRefresh: () => api("auth/jwt/refresh"),
        djoserVerify: () => api("auth/jwt/verify"),
        login: () => api("auth/login/"),
        verify: () => api("auth/verify/"),
        logout: () => api("auth/logout/"),
        currentUser: () => api("auth/users/me"),
    },

    downloadTemplate: {
        attendance: api("people/attendance/download_template/"),
        tithes: api("bookkeeper/tithes/download_tithe_template/"),
        revenue: api("bookkeeper/revenue/download_revenue_template/"),
        overhead: api("bookkeeper/overhead/download_overhead_template/"),
        expenses: api("bookkeeper/expenditure/download_expenditure_template/"),
    },

    uploadExcel: {
        attendance: api("people/attendance/upload_excel/"),
        tithes: api("bookkeeper/tithes/upload_excel/"),
        revenue: api("bookkeeper/revenue/upload_excel/"),
        overhead: api("bookkeeper/overhead/upload_excel/"),
        expenses: api("bookkeeper/expenditure/upload_excel/"),
    },

    uploadImage: {
        expenses: api("bookkeeper/expenditure/upload-image/"),
    }
}

type ApiRoutes = typeof apiRoutes

export type ApiDetailRouteKey = {
    [Key in keyof ApiRoutes]: ApiRoutes[Key] extends {
        detail: (id: string | number) => string
    }
        ? Key
        : never
}[keyof ApiRoutes]

export type ApiBulkDeleteRouteKey = {
    [Key in keyof ApiRoutes]: ApiRoutes[Key] extends {
        bulkDelete: () => string
    }
        ? Key
        : never
}[keyof ApiRoutes]


// =========================
// Typed Fetch Wrapper
// =========================

export async function apiFetch<T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<T> {
    const response = await fetch(input, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
        ...init,
    })

    if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(errorBody || "API request failed")
    }

    return response.json() as Promise<T>
}


// =========================
// Structured API Client
// =========================

export class ApiClient {
    async get<T>(url: string): Promise<T> {
        return apiFetch<T>(url, { method: "GET" })
    }

    async post<T, B = unknown>(url: string, body?: B): Promise<T> {
        return apiFetch<T>(url, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    async patch<T, B = unknown>(url: string, body?: B): Promise<T> {
        return apiFetch<T>(url, {
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    async delete<T>(url: string): Promise<T> {
        return apiFetch<T>(url, { method: "DELETE" })
    }
}
export const apiClient = new ApiClient()

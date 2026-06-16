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
    assets: api("assets"),
    attendance: api("people/attendance"),
    blogs: api("blogs"),
    createSession: api("auth/jwt/create"),
    currentUser: api("auth/users/me"),
    emailCheck: api("auth/check-email"),
    financeSummary: api("finance/monthly-summary"),
    yearlySummary: api("finance/yearly"),
    homecells: api("homecells"),
    income: api("income"),
    juniorMembers: api("junior_members"),
    expenditures: api("expenditure"),
    members: api("members"),
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
    attendance: {
        list: () => api("people/attendance"),
        detail: (id: string | number) => api(`people/attendance/${id}`),
        bulkDelete: () => api("people/attendance/bulk_delete"),
    },

    members: {
        list: () => api("members"),
        detail: (id: string | number) => api(`members/${id}`),
        junior: {
            list: () => api("junior_members"),
            detail: (id: string | number) => api(`junior_members/${id}`),
        },
    },

    finance: {
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
        },
    },

    reports: {
        analyzer: (id: string | number) => api(`analyzer/${id}`),
        list: () => api("reports"),
        detail: (id: string | number) => api(`reports/${id}`),

        zoneReport: (zoneId: number) =>
            api(`zone-reports/${zoneId}`),

        auditLogs: {
            list: () => api("reports/audit-logs"),
            detail: (id: string | number) =>
                api(`reports/audit-logs/${id}`),
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
    }
}


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
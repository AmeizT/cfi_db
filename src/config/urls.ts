const isDevelopment = process.env.NODE_ENV === "development"

const SERVER_URLS = {
    dev: "http://127.0.0.1:8000",
    prod: "https://honeste-backend.vercel.app",
}

const CLIENT_URLS = {
    dev: "http://localhost:3000",
    prod: "https://www.cfidb.com",
}

function buildUrl(baseUrl: string, path = "", trailingSlash = true): string {
    const cleanPath = path.replace(/^\/|\/$/g, "")
    const slash = trailingSlash ? "/" : ""
    return `${baseUrl}/${cleanPath}${slash}`
}

export function getServerUrl(path?: string, options: { trailingSlash?: boolean } = {}): string {
    const baseUrl = isDevelopment ? SERVER_URLS.dev : SERVER_URLS.prod
    return buildUrl(baseUrl, path, options.trailingSlash)
}

export function getClientUrl(path?: string, options: { trailingSlash?: boolean } = {}): string {
    const baseUrl = isDevelopment ? CLIENT_URLS.dev : CLIENT_URLS.prod
    return buildUrl(baseUrl, path, options.trailingSlash)
}

export const url = {
    analyzer: getServerUrl("api/v1/analyzer"),
    announcements: getServerUrl("api/v1/announcements"),
    assemblyAdmins: getServerUrl("api/v1/assembly_admins"),
    assemblies: getServerUrl("api/v1/assemblies"),
    assets: getServerUrl("api/v1/assets"),
    attendance: getServerUrl("api/v1/attendance"),
    blogs: getServerUrl("api/v1/blogs"),
    changelog: getServerUrl("api/v1/changelog"),
    circulars: getServerUrl("api/v1/circulars"),
    connectedApps: getServerUrl("api/v1/integrations/connected-apps"),
    createSession: getServerUrl("api/v1/auth/jwt/create"),
    currentUser: getServerUrl("api/v1/auth/users/me"),
    emailCheck: getServerUrl("api/v1/auth/check-email"),
    financeSummary: getServerUrl("api/v1/finance/monthly-summary"),
    yearlySummary: getServerUrl("api/v1/finance/yearly"),
    homecells: getServerUrl("api/v1/homecells"),
    income: getServerUrl("api/v1/income"),
    integrations: getServerUrl("api/v1/integrations"),
    integrationProviders: getServerUrl("api/v1/integration-providers"),
    juniorMembers: getServerUrl("api/v1/junior_members"),
    events: getServerUrl("api/v1/events"),
    expenditures: getServerUrl("api/v1/expenditure"),
    meetings: getServerUrl("api/v1/meetings"),
    members: getServerUrl("api/v1/members"),
    messages: getServerUrl("api/v1/messages"),
    passwordReset: getServerUrl("api/v1/auth/users/reset_password"),
    passwordResetConfirm: getServerUrl("api/v1/auth/users/reset_password_confirm"),
    posts: getServerUrl("api/v1/posts"),
    postComments: getServerUrl("api/v1/post/comment"),
    refreshSession: getServerUrl("api/v1/auth/jwt/refresh"),
    reports: getServerUrl("api/v1/reports"),
    resources: getServerUrl("api/v1/resources"),
    regularExpenditures: getServerUrl("api/v1/regular_expenditure"),
    sessionHistory: getServerUrl("api/v1/auth/user_auth_history"),
    setPassword: getServerUrl("api/v1/auth/users/set_password"),
    systems: getServerUrl("api/v1/systems"),
    tally: getServerUrl("api/v1/tally"),
    terms: getServerUrl("api/v1/terms"),
    tithes: getServerUrl("api/v1/tithes"),
    trashedTithes: getServerUrl("api/v1/tithes/trashed"),
    verifySession: getServerUrl("api/v1/auth/jwt/verify"),
    users: getServerUrl("api/v1/auth/users"),
    user: getServerUrl("api/v1/auth/user"),
}
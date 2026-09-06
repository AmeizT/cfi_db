const STATIC_FILE_PATTERN = /\/[^/]+\.[^/]+$/

export function isAuthRoute(pathname: string) {
    return /(^|\/)auth(\/|$)/.test(pathname)
}

export function shouldBypassProxy(pathname: string) {
    return pathname === "/api"
        || pathname.startsWith("/api/")
        || pathname === "/_next"
        || pathname.startsWith("/_next/")
        || pathname === "/favicon.ico"
        || pathname === "/robots.txt"
        || pathname === "/sitemap.xml"
        || STATIC_FILE_PATTERN.test(pathname)
}

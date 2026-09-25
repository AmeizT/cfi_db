type BackendEnvironment = {
    NODE_ENV?: string
    VERCEL_ENV?: string
    DJANGO_API_URL?: string
    NEXT_PUBLIC_API_URL?: string
    NEXT_PUBLIC_SERVER_DEV_URL?: string
    NEXT_PUBLIC_SERVER_PROD_URL?: string
}

export function getBackendApiUrl(path: string, env: BackendEnvironment = process.env) {
    const base = env.DJANGO_API_URL || env.NEXT_PUBLIC_API_URL
        || (env.NODE_ENV === "development"
            ? env.NEXT_PUBLIC_SERVER_DEV_URL
            : env.NEXT_PUBLIC_SERVER_PROD_URL)
    if (!base) throw new Error("Missing Django API URL. Set DJANGO_API_URL or NEXT_PUBLIC_API_URL.")

    let target: URL
    try { target = new URL(base) } catch { throw new Error("Django API URL must be an absolute HTTP(S) URL.") }
    if (!["http:", "https:"].includes(target.protocol)
        || target.username || target.password || target.search || target.hash) {
        throw new Error("Django API URL must be HTTP(S), without credentials, query or fragment.")
    }
    if (env.VERCEL_ENV && env.VERCEL_ENV !== "development"
        && ["localhost", "127.0.0.1", "[::1]"].includes(target.hostname)) {
        throw new Error("Deployed Django API URL cannot point to localhost.")
    }
    return `${target.toString().replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`
}

export function getBackendRequestPath(path: string) {
    // This explicit Django URL has no slash; ordinary router URLs need one.
    if (/^api\/v1\/reports\/region\/\d+\/compliance\/monthly-report\.pdf\/?$/.test(path)) {
        return path.replace(/\/$/, "")
    }
    return path.endsWith("/") ? path : `${path}/`
}

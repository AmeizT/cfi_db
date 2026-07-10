export type ReportRouteSearchParams = Record<
    string,
    string | string[] | undefined
>

type QueryUpdate = string | number | boolean | null | undefined

function appendParam(
    params: URLSearchParams,
    key: string,
    value: string | string[] | undefined
) {
    if (typeof value === "string") {
        params.append(key, value)
    }

    if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, item))
    }
}

export function reportHref(
    pathname: string,
    searchParams?: ReportRouteSearchParams,
    updates: Record<string, QueryUpdate> = {}
) {
    const params = new URLSearchParams()

    Object.entries(searchParams ?? {}).forEach(([key, value]) => {
        appendParam(params, key, value)
    })

    const reportId =
        params.get("reportId") ??
        params.get("reportid") ??
        params.get("report_id") ??
        params.get("id")

    if (reportId) {
        params.set("reportId", reportId)
    }

    params.delete("reportid")
    params.delete("report_id")

    Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            params.delete(key)
        } else {
            params.set(key, String(value))
        }
    })

    const query = params.toString()

    return query ? `${pathname}?${query}` : pathname
}

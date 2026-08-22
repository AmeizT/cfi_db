export type TransferQueryView = "all" | "incoming" | "outgoing" | "history"

export type TransferQueryKeyParams = {
    status?: string
    page?: string | number
    page_size?: string | number
    search?: string
    filters?: Readonly<Record<string, string | number | boolean | null | undefined>>
}

export function buildTransferQueryKey(
    assemblyId: string | number | null | undefined,
    view: TransferQueryView,
    params: TransferQueryKeyParams = {},
) {
    return [
        "assembly",
        assemblyId == null ? "pending" : String(assemblyId),
        "people",
        "member-transfers",
        "view", view,
        "status", params.status ?? "all",
        "page", Number(params.page ?? 1),
        "page-size", Number(params.page_size ?? 10),
        "search", params.search?.trim() ?? "",
        "filters", Object.entries(params.filters ?? {}).sort(([left], [right]) => left.localeCompare(right)),
    ] as const
}

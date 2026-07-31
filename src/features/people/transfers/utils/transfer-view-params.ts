export const TRANSFER_VIEWS = ["incoming", "outgoing", "history"] as const

export type TransferView = typeof TRANSFER_VIEWS[number]

export const DEFAULT_TRANSFER_VIEW: TransferView = "incoming"

const TRANSFER_VIEW_SET = new Set<string>(TRANSFER_VIEWS)

type SearchParamInput = URLSearchParams | string | null | undefined

function toURLSearchParams(input: SearchParamInput) {
    if (input instanceof URLSearchParams) {
        return new URLSearchParams(input)
    }

    return new URLSearchParams(input ?? "")
}

export function getTransferView(searchParams: SearchParamInput): TransferView {
    const params = toURLSearchParams(searchParams)
    const view = params.get("view")

    return TRANSFER_VIEW_SET.has(view ?? "")
        ? view as TransferView
        : DEFAULT_TRANSFER_VIEW
}

export function buildTransferViewQuery(
    searchParams: SearchParamInput,
    view: TransferView
) {
    const params = toURLSearchParams(searchParams)

    params.set("view", view)
    params.set("page", "1")

    return params.toString()
}

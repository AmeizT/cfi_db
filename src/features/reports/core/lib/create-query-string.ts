export type QueryValue = string | number | boolean | null | undefined

type SearchParamInput =
    | URLSearchParams
    | string
    | Record<string, string | string[] | undefined>
    | null
    | undefined

function toURLSearchParams(input: SearchParamInput): URLSearchParams {
    if (input instanceof URLSearchParams) {
        return new URLSearchParams(input)
    }

    if (typeof input === "string") {
        return new URLSearchParams(input)
    }

    if (!input) {
        return new URLSearchParams()
    }

    const flat: Record<string, string> = {}

    for (const [key, value] of Object.entries(input)) {
        if (typeof value === "string") {
            flat[key] = value
        }

        // optionally support arrays (join them)
        if (Array.isArray(value)) {
            flat[key] = value.join(",")
        }
    }

    return new URLSearchParams(flat)
}

export function createQueryString(
    searchParams: SearchParamInput,
    updates: Record<string, QueryValue>
): string {
    const params = toURLSearchParams(searchParams)

    for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined) {
            params.delete(key)
        } else {
            params.set(key, String(value))
        }
    }

    return params.toString()
}
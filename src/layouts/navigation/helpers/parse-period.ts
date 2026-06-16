import { Period } from "../types"

export function parsePeriod(period?: string): Period | null {
    if (!period) return null

    const [type, value] = period.split(":")

    switch (type) {
        case "year":
            return { type: "year", value: Number(value) }

        case "month":
            return { type: "month", value }

        case "range": {
            const [from, to] = value.split("_")
            return { type: "range", from, to }
        }

        default:
            return null
    }
}
import { Period } from "../types"

export function buildPeriod(period: Period): string {
    switch (period.type) {
        case "year":
            return `year:${period.value}`

        case "month":
            return `month:${period.value}`

        case "range":
            return `range:${period.from}_${period.to}`
    }
}
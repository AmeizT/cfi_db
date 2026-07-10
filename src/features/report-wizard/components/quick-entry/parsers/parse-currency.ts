import type { QuickEntryParseResult } from "../quick-entry-types"

export type ParseCurrencyOptions = {
    label?: string
    min?: number
    max?: number
}

function getLabel(options: ParseCurrencyOptions) {
    return options.label ?? "Amount"
}

function normalizeGroupedCurrency(input: string) {
    return input.replace(/[,\s]/g, "")
}

export function parseQuickEntryCurrency(
    input: string,
    options: ParseCurrencyOptions = {}
): QuickEntryParseResult {
    const trimmed = input.trim()
    const label = getLabel(options)

    if (!trimmed) {
        return {
            success: false,
            error: `${label} is required.`,
        }
    }

    const pattern = /^(?:\d+|\d{1,3}(?:[,\s]\d{3})+)(?:\.\d{1,2})?$/

    if (!pattern.test(trimmed)) {
        return {
            success: false,
            error: `${label} must be a valid amount.`,
        }
    }

    const value = Number(normalizeGroupedCurrency(trimmed))

    if (!Number.isFinite(value)) {
        return {
            success: false,
            error: `${label} must be a valid amount.`,
        }
    }

    if (typeof options.min === "number" && value < options.min) {
        return {
            success: false,
            error: `${label} cannot be less than ${options.min}.`,
        }
    }

    if (typeof options.max === "number" && value > options.max) {
        return {
            success: false,
            error: `${label} cannot be greater than ${options.max}.`,
        }
    }

    return {
        success: true,
        value,
        displayValue: value.toFixed(2),
    }
}

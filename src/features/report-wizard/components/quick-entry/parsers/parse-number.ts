import type { QuickEntryParseResult } from "../quick-entry-types"

export type ParseNumberOptions = {
    label?: string
    min?: number
    max?: number
    allowDecimal?: boolean
}

function normalizeGroupedNumber(input: string) {
    return input.replace(/[,\s]/g, "")
}

function getLabel(options: ParseNumberOptions) {
    return options.label ?? "Value"
}

export function parseQuickEntryNumber(
    input: string,
    options: ParseNumberOptions = {}
): QuickEntryParseResult {
    const trimmed = input.trim()
    const label = getLabel(options)

    if (!trimmed) {
        return {
            success: false,
            error: `${label} is required.`,
        }
    }

    const integerPattern = /^(?:\d+|\d{1,3}(?:[,\s]\d{3})+)$/
    const decimalPattern = /^(?:\d+|\d{1,3}(?:[,\s]\d{3})+)(?:\.\d+)?$/
    const pattern = options.allowDecimal ? decimalPattern : integerPattern

    if (!pattern.test(trimmed)) {
        return {
            success: false,
            error: options.allowDecimal
                ? `${label} must be a valid number.`
                : `${label} must be a whole number.`,
        }
    }

    const value = Number(normalizeGroupedNumber(trimmed))

    if (!Number.isFinite(value)) {
        return {
            success: false,
            error: `${label} must be a valid number.`,
        }
    }

    if (!options.allowDecimal && !Number.isInteger(value)) {
        return {
            success: false,
            error: `${label} must be a whole number.`,
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
        displayValue: options.allowDecimal ? String(value) : String(Math.trunc(value)),
    }
}

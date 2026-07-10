export type QuickEntryFieldType =
    | "number"
    | "currency"
    | "date"
    | "text"
    | "textarea"
    | "select"
    | "boolean"

export type QuickEntryFieldOption = {
    label: string
    value: string
}

export type QuickEntryFieldDefinition = {
    key: string
    label: string
    type: QuickEntryFieldType
    required?: boolean
    placeholder?: string
    helpText?: string
    aliases?: string[]
    min?: number
    max?: number
    allowDecimal?: boolean
    options?: QuickEntryFieldOption[]
    formatter?: (value: unknown) => string
    parser?: (value: string) => unknown
}

export type QuickEntrySummaryItem = {
    label: string
    value: string | number
}

export type QuickEntryReportSchema = {
    type: string
    label: string
    description?: string
    fields: QuickEntryFieldDefinition[]
    backend?: {
        sectionId: string
        endpoint: string
    }
    serialize?: (values: Record<string, unknown>) => Record<string, unknown>
    calculateSummary?: (values: Record<string, unknown>) => QuickEntrySummaryItem[]
}

export type ReportDraftSource =
    | "quick-entry"
    | "guided-form"
    | "ocr"
    | "import"
    | "whatsapp"

export type ReportDraftStatus =
    | "editing"
    | "reviewing"
    | "saving"
    | "saved"
    | "error"

export type ReportDraft = {
    reportType: string
    values: Record<string, unknown>
    errors: Record<string, string>
    warnings: string[]
    touchedFields: string[]
    source: ReportDraftSource
    status: ReportDraftStatus
}

export type QuickEntryParseSuccess = {
    success: true
    value: unknown
    displayValue?: string
}

export type QuickEntryParseFailure = {
    success: false
    error: string
}

export type QuickEntryParseResult = QuickEntryParseSuccess | QuickEntryParseFailure

export type QuickEntryFieldSuggestion = {
    key: string
    label: string
    matchedBy: string
}

export type CreateReportCommandResult =
    | {
        success: true
        schema: QuickEntryReportSchema
    }
    | {
        success: false
        error: string
        suggestion?: string
        validTypes: string[]
    }

export type DuplicateFieldPrompt = {
    key: string
    label: string
    currentValue: unknown
    nextRawValue: string
    fromKey?: string
    source?: "quick-row" | "key-edit"
}

export type QuickEntrySubmitPayload = {
    report_type: string
    values: Record<string, unknown>
    source: "quick-entry"
}

export type ParsedQuickEntryError = {
    key?: string
    message: string
    suggestion?: string
}

export type ParsedQuickEntryCommand =
    | { name: "remove"; field?: string }
    | { name: "review" }
    | { name: "save" }
    | { name: "cancel" }
    | { name: "help" }

export type ParsedQuickEntryResult = {
    updates: Record<string, unknown>
    displayValues: Record<string, string>
    removedKeys: string[]
    errors: ParsedQuickEntryError[]
    warnings: string[]
    messages: string[]
    isCommand: boolean
    command?: ParsedQuickEntryCommand
}

export type ParseQuickEntryInputArgs = {
    input: string
    schema: QuickEntryReportSchema
    currentValues: Record<string, unknown>
}

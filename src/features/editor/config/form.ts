export const FORM_LIST = {
    reports: [
        {
            key: "attendance",
            title: "Attendance",
            description: "Record attendance for Sunday services to monitor member participation.",
        },
        {
            key: "expenses",
            title: "Expenses",
            description: "Record and categorize church expenses to maintain accurate financial tracking.",
        },
        {
            key: "income",
            title: "Income",
            description: "Record offerings, donations, and other sources of income received by the church.",
        },
        {
            key: "tithes",
            title: "Tithes",
            description: "Track and record tithes contributed by members for accountability and reporting.",
        },
    ],
    entries: [
        {
            key: "assets",
            title: "Asset",
            description: "Manage church assets by adding, editing, or removing items such as equipment or property.",
        },
        {
            key: "members",
            title: "Members",
            description: "Add and update member details to keep your congregation records accurate and up to date.",
        },
    ],
} as const

export const FORM_META = {
    reports: Object.fromEntries(
        FORM_LIST.reports.map(form => [form.key, form])
    ),
    entries: Object.fromEntries(
        FORM_LIST.entries.map(form => [form.key, form])
    ),
} as const

export type Mode = keyof typeof FORM_META
export type FormKey<M extends Mode> = keyof typeof FORM_META[M]

export function getFormMeta<M extends Mode>(
    mode: M,
    form: FormKey<M> | null
) {
    if (!form) return undefined
    return FORM_META[mode][form]
}


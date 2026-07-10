import { apiRoutes } from "@/config/urls"
import type { QuickEntryReportSchema } from "./quick-entry-types"

export const REPORT_TYPE_ALIASES: Record<string, string> = {
    attendance: "attendance",
    attend: "attendance",

    tithe: "tithes",
    tithes: "tithes",
    giving: "tithes",

    income: "revenue",
    revenue: "revenue",

    expense: "expenditure",
    expenses: "expenditure",
    expenditure: "expenditure",

    member: "member",
    members: "member",
}

function asNumber(value: unknown) {
    return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function asString(value: unknown) {
    return typeof value === "string" ? value : ""
}

function asMoneyString(value: unknown) {
    if (typeof value !== "number" || !Number.isFinite(value)) return "0.00"
    return value.toFixed(2)
}

export const attendanceQuickEntrySchema: QuickEntryReportSchema = {
    type: "attendance",
    label: "Attendance",
    description: "Enter attendance totals for the selected reporting period.",
    backend: {
        sectionId: "attendance",
        endpoint: apiRoutes.attendance.bulkCreate(),
    },
    fields: [
        {
            key: "timestamp",
            label: "Date",
            type: "date",
            required: true,
            placeholder: "YYYY-MM-DD",
            helpText: "Accepts: DD-MM-YY, DD/MM/YYYY, or YYYY-MM-DD. Example: 20-06-26 -> 2026-06-20",
            aliases: ["date", "report_date", "report date", "date of report"],
        },
        {
            key: "men",
            label: "Men",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["male", "males", "adult men"],
        },
        {
            key: "women",
            label: "Women",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["female", "females", "adult women"],
        },
        {
            key: "visitor_men",
            label: "Visitor men",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["male visitors", "visitor men", "men visitors", "guest men"],
        },
        {
            key: "visitor_women",
            label: "Visitor women",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["female visitors", "visitor women", "women visitors", "guest women"],
        },
        {
            key: "new_convert_men",
            label: "New convert men",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["male converts", "convert men", "new convert men"],
        },
        {
            key: "new_convert_women",
            label: "New convert women",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["female converts", "convert women", "new convert women"],
        },
        {
            key: "altar_call_men",
            label: "Altar call men",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["altar men", "men altar call", "altar call men"],
        },
        {
            key: "altar_call_women",
            label: "Altar call women",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["altar women", "women altar call", "altar call women"],
        },
        {
            key: "baptism_men",
            label: "Baptism men",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["baptism men", "male baptisms", "baptised men"],
        },
        {
            key: "baptism_women",
            label: "Baptism women",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["baptism women", "female baptisms", "baptised women"],
        },
        {
            key: "online_viewers",
            label: "Online attendance",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["online", "online viewers", "online attendance"],
        },
        {
            key: "volunteers_on_duty",
            label: "Volunteers on duty",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["volunteers", "volunteers on duty"],
        },
        {
            key: "total_leaders_present",
            label: "Leaders present",
            type: "number",
            required: false,
            min: 0,
            placeholder: "0",
            aliases: ["leaders", "leaders present"],
        },
        {
            key: "service_type",
            label: "Service type",
            type: "select",
            required: false,
            placeholder: "sunday",
            aliases: ["service", "category"],
            options: [
                { label: "Sunday", value: "sunday" },
                { label: "Friday", value: "friday" },
                { label: "Homecell", value: "homecell" },
                { label: "Outreach", value: "outreach" },
                { label: "Other", value: "other" },
            ],
        },
        {
            key: "weather",
            label: "Weather",
            type: "select",
            required: false,
            aliases: ["weather condition"],
            options: [
                { label: "Sunny", value: "sunny" },
                { label: "Partly Cloudy", value: "partly_cloudy" },
                { label: "Cloudy", value: "cloudy" },
                { label: "Windy", value: "windy" },
                { label: "Light Rain", value: "light_rain" },
                { label: "Heavy Rain", value: "heavy_rain" },
                { label: "Storm", value: "storm" },
                { label: "Very Hot", value: "very_hot" },
                { label: "Cold", value: "cold" },
                { label: "Extreme Weather", value: "extreme" },
            ],
        },
        {
            key: "is_special_event",
            label: "Special event",
            type: "boolean",
            required: false,
            aliases: ["special event"],
        },
        {
            key: "special_event_name",
            label: "Special event name",
            type: "text",
            required: false,
            aliases: ["event", "event name"],
        },
        {
            key: "preacher",
            label: "Preacher",
            type: "text",
            required: false,
            placeholder: "Pastor Tawanda",
            aliases: ["speaker"],
        },
        {
            key: "scriptures",
            label: "Scriptures",
            type: "text",
            required: false,
            placeholder: "Genesis 2:10; John 3:16",
            aliases: ["scripture", "bible text", "text"],
        },
        {
            key: "sermon",
            label: "Sermon",
            type: "text",
            required: false,
            aliases: ["message", "topic"],
        },
        {
            key: "notes",
            label: "Notes",
            type: "textarea",
            required: false,
            aliases: ["note", "memo"],
        },
    ],
    calculateSummary(values) {
        const men = asNumber(values.men)
        const women = asNumber(values.women)
        const visitors = asNumber(values.visitor_men) + asNumber(values.visitor_women)
        const online = asNumber(values.online_viewers)

        return [
            {
                label: "Total attendance",
                value: men + women + visitors + online,
            },
        ]
    },
    serialize(values) {
        return {
            men: asNumber(values.men),
            women: asNumber(values.women),
            visitor_men: asNumber(values.visitor_men),
            visitor_women: asNumber(values.visitor_women),
            new_convert_men: asNumber(values.new_convert_men),
            new_convert_women: asNumber(values.new_convert_women),
            altar_call_men: asNumber(values.altar_call_men),
            altar_call_women: asNumber(values.altar_call_women),
            baptism_men: asNumber(values.baptism_men),
            baptism_women: asNumber(values.baptism_women),
            online_viewers: asNumber(values.online_viewers),
            volunteers_on_duty: asNumber(values.volunteers_on_duty),
            total_leaders_present: asNumber(values.total_leaders_present),
            service_type: asString(values.service_type) || undefined,
            weather: asString(values.weather) || undefined,
            is_special_event: values.is_special_event === true ? true : undefined,
            special_event_name: asString(values.special_event_name) || undefined,
            preacher: asString(values.preacher) || undefined,
            sermon: asString(values.sermon) || undefined,
            scriptures: asString(values.scriptures) || undefined,
            notes: asString(values.notes) || undefined,
            timestamp: asString(values.timestamp),
        }
    },
}

export const tithesQuickEntrySchema: QuickEntryReportSchema = {
    type: "tithes",
    label: "Tithes",
    description: "Enter a tithe receipt for the selected reporting period.",
    backend: {
        sectionId: "tithes",
        endpoint: apiRoutes.finance.tithes.list(),
    },
    fields: [
        {
            key: "amount",
            label: "Amount",
            type: "currency",
            required: false,
            min: 0,
            placeholder: "0.00",
            aliases: ["total", "tithe", "tithes"],
        },
        {
            key: "cash",
            label: "Cash",
            type: "currency",
            required: false,
            min: 0,
            placeholder: "0.00",
            aliases: ["cash amount"],
        },
        {
            key: "bank",
            label: "Bank",
            type: "currency",
            required: false,
            min: 0,
            placeholder: "0.00",
            aliases: ["bank transfer", "transfer"],
        },
        {
            key: "mobile_money",
            label: "Mobile money",
            type: "currency",
            required: false,
            min: 0,
            placeholder: "0.00",
            aliases: ["mobile money", "mobile", "phone payment"],
        },
        {
            key: "report_date",
            label: "Report date",
            type: "date",
            required: true,
            placeholder: "DD-MM-YY",
            helpText: "Accepts: DD-MM-YY, DD/MM/YYYY, or YYYY-MM-DD. Example: 20-06-26 -> 2026-06-20",
            aliases: ["date", "timestamp"],
        },
        {
            key: "payment_method",
            label: "Payment method",
            type: "select",
            required: false,
            placeholder: "Cash",
            aliases: ["method", "payment"],
            options: [
                { label: "Bank", value: "Bank" },
                { label: "Cash", value: "Cash" },
                { label: "Cheque", value: "Cheque" },
                { label: "Payment By Phone", value: "Payment By Phone" },
                { label: "Other", value: "Other" },
            ],
        },
        {
            key: "reference_code",
            label: "Reference code",
            type: "text",
            required: false,
            aliases: ["reference", "ref"],
        },
        {
            key: "notes",
            label: "Notes",
            type: "textarea",
            required: false,
            aliases: ["note", "memo"],
        },
    ],
    calculateSummary(values) {
        const amount = asNumber(values.amount)
        const channelTotal = asNumber(values.cash)
            + asNumber(values.bank)
            + asNumber(values.mobile_money)

        return [
            {
                label: "Total tithes",
                value: asMoneyString(amount || channelTotal),
            },
        ]
    },
    serialize(values) {
        const amount = asNumber(values.amount)
        const channelTotal = asNumber(values.cash)
            + asNumber(values.bank)
            + asNumber(values.mobile_money)
        const paymentMethod = asString(values.payment_method)
            || (channelTotal > 0 ? "Other" : undefined)

        return {
            amount: asMoneyString(amount || channelTotal),
            timestamp: asString(values.report_date),
            payment_method: paymentMethod,
            reference_code: asString(values.reference_code) || undefined,
            notes: asString(values.notes),
        }
    },
}

export const revenueQuickEntrySchema: QuickEntryReportSchema = {
    type: "revenue",
    label: "Revenue",
    description: "Enter a revenue item and category.",
    backend: {
        sectionId: "income",
        endpoint: apiRoutes.finance.revenue.list(),
    },
    fields: [
        {
            key: "amount",
            label: "Amount",
            type: "currency",
            required: true,
            min: 0,
            placeholder: "0.00",
            aliases: ["total", "income", "revenue"],
        },
        {
            key: "category_name",
            label: "Category",
            type: "text",
            required: true,
            placeholder: "Offering",
            aliases: ["category", "type"],
        },
        {
            key: "report_date",
            label: "Report date",
            type: "date",
            required: true,
            placeholder: "DD-MM-YY",
            helpText: "Accepts: DD-MM-YY, DD/MM/YYYY, or YYYY-MM-DD. Example: 20-06-26 -> 2026-06-20",
            aliases: ["date", "timestamp"],
        },
        {
            key: "notes",
            label: "Notes",
            type: "textarea",
            required: false,
            aliases: ["note", "memo"],
        },
    ],
    calculateSummary(values) {
        return [
            {
                label: "Total revenue",
                value: asMoneyString(values.amount),
            },
        ]
    },
    serialize(values) {
        return {
            amount: asMoneyString(values.amount),
            category_name: asString(values.category_name),
            timestamp: asString(values.report_date),
            notes: asString(values.notes),
        }
    },
}

export const expenditureQuickEntrySchema: QuickEntryReportSchema = {
    type: "expenditure",
    label: "Expenditure",
    description: "Enter a variable expenditure item.",
    backend: {
        sectionId: "expenditure",
        endpoint: apiRoutes.finance.expenditures.list(),
    },
    fields: [
        {
            key: "name",
            label: "Name",
            type: "text",
            required: true,
            placeholder: "Fuel purchase",
            aliases: ["item", "expense", "title"],
        },
        {
            key: "category",
            label: "Category",
            type: "select",
            required: true,
            aliases: ["type", "expense type"],
            options: [
                { label: "Amenities", value: "amenities" },
                { label: "Conference", value: "conference" },
                { label: "Decor", value: "decor" },
                { label: "Fellowship", value: "fellowship" },
                { label: "Hotel Bookings", value: "hotel bookings" },
                { label: "Humanitarian", value: "humanitarian" },
                { label: "Office", value: "office" },
                { label: "Other", value: "other" },
                { label: "Outreach", value: "outreach" },
                { label: "Repair", value: "repair" },
                { label: "Travel", value: "travel" },
                { label: "Wages", value: "wages" },
            ],
        },
        {
            key: "quantity",
            label: "Quantity",
            type: "number",
            required: true,
            min: 1,
            placeholder: "1",
            aliases: ["qty", "count"],
        },
        {
            key: "price",
            label: "Price",
            type: "currency",
            required: true,
            min: 0,
            placeholder: "0.00",
            aliases: ["amount", "cost", "value"],
        },
        {
            key: "report_date",
            label: "Report date",
            type: "date",
            required: true,
            placeholder: "DD-MM-YY",
            helpText: "Accepts: DD-MM-YY, DD/MM/YYYY, or YYYY-MM-DD. Example: 20-06-26 -> 2026-06-20",
            aliases: ["date", "invoice_date", "timestamp"],
        },
        {
            key: "supplier",
            label: "Supplier",
            type: "text",
            required: false,
            aliases: ["vendor"],
        },
        {
            key: "invoice_number",
            label: "Invoice number",
            type: "text",
            required: false,
            aliases: ["invoice", "receipt number"],
        },
        {
            key: "description",
            label: "Description",
            type: "textarea",
            required: false,
            aliases: ["notes", "note", "memo"],
        },
    ],
    calculateSummary(values) {
        const quantity = asNumber(values.quantity)
        const price = asNumber(values.price)

        return [
            {
                label: "Total expenditure",
                value: (quantity * price).toFixed(2),
            },
        ]
    },
    serialize(values) {
        return {
            invoice_number: asString(values.invoice_number),
            invoice_date: asString(values.report_date),
            name: asString(values.name),
            description: asString(values.description),
            category: asString(values.category),
            supplier: asString(values.supplier),
            quantity: asNumber(values.quantity),
            price: asMoneyString(values.price),
        }
    },
}

export const memberQuickEntrySchema: QuickEntryReportSchema = {
    type: "member",
    label: "Member",
    description: "Capture a basic member draft for review.",
    backend: {
        sectionId: "member",
        endpoint: apiRoutes.members.list(),
    },
    fields: [
        {
            key: "first_name",
            label: "First name",
            type: "text",
            required: true,
            aliases: ["first", "firstname", "given name"],
        },
        {
            key: "last_name",
            label: "Last name",
            type: "text",
            required: true,
            aliases: ["last", "lastname", "surname"],
        },
        {
            key: "gender",
            label: "Gender",
            type: "select",
            required: true,
            options: [
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
            ],
        },
        {
            key: "date_of_birth",
            label: "Date of birth",
            type: "date",
            required: true,
            aliases: ["dob", "birth date"],
        },
        {
            key: "phone_number",
            label: "Phone number",
            type: "text",
            required: false,
            aliases: ["phone", "mobile"],
        },
    ],
    serialize(values) {
        return {
            first_name: asString(values.first_name),
            last_name: asString(values.last_name),
            gender: asString(values.gender),
            date_of_birth: asString(values.date_of_birth),
            phone_number: asString(values.phone_number),
        }
    },
}

export const QUICK_ENTRY_SCHEMAS = [
    attendanceQuickEntrySchema,
    tithesQuickEntrySchema,
    revenueQuickEntrySchema,
    expenditureQuickEntrySchema,
    memberQuickEntrySchema,
] as const

export function getQuickEntrySchema(type: string) {
    return QUICK_ENTRY_SCHEMAS.find((schema) => schema.type === type) ?? null
}

export function getQuickEntrySchemaLabels() {
    return QUICK_ENTRY_SCHEMAS.map((schema) => schema.type)
}

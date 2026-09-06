import { z } from "zod"

export const entities = ["members", "households", "homecells", "assets"] as const
export type CreateEntity = typeof entities[number]
export const entitySchema = z.enum(entities)
const text = (max = 255) => z.string().trim().max(max)
const requiredText = (max = 255) => text(max).min(1, "This field is required.")
const date = z.iso.date("Enter a valid date.")
const optionalDate = date.optional()
const phone = text(17).refine(value => !value || /^\+?1?\d{9,15}$/.test(value), "Enter 9–15 digits, optionally starting with +.")
const email = z.union([z.email("Enter a valid email."), z.literal("")]).optional()
const id = z.coerce.number().int().positive()
export const genders = ["Male", "Female"] as const
export const relationships = ["Single", "Married", "Divorced", "Widowed", "Separated", "Engaged", "In a Relationship", "Domestic Partnership", "Civil Union", "Committed", "Common-Law Marriage", "Traditional Marriage", "Co-parenting"] as const
export const statuses = ["Visitor", "Regular", "Established", "Relocated", "Inactive", "Transferred", "Deceased"] as const
export const prefixes = ["Advocate", "Dr", "Eng", "Hon", "Miss", "Mr", "Mrs", "Ms", "Prof", "Rev"] as const
export const education = ["Primary", "Secondary", "Diploma", "Bachelor's Degree", "Master's Degree", "Doctorate", "Other"] as const
export const assetTypes = ["Building", "Instrument", "Vehicle", "Furniture", "Electronics", "Machinery", "Software", "Land", "Other"] as const
export const conditions = ["New", "Good", "Fair", "Old", "Not Working"] as const

export const memberCreateSchema = z.object({
    first_name: requiredText(100), last_name: requiredText(100), date_of_birth: date,
    gender: z.enum(genders), country: requiredText(),
    phone_number: phone, ministries: z.array(requiredText()), positions: z.array(requiredText()),
    prefix: z.enum(prefixes).optional(), middle_name: text(100).optional(), maiden_name: text(100).optional(),
    place_of_birth: text(100).optional(), relationship: z.enum(relationships).optional(),
    marriage_date: optionalDate, spouse: id.optional(), secondary_phone_number: phone.optional(), email,
    address: text().optional(), address_line2: text().optional(), city: text().optional(), province: text(100).optional(),
    membersince: optionalDate, membership_status: z.enum(statuses).optional(),
    membership_stage: z.enum(["new", "established", "associate"]).optional(), date_of_death: optionalDate,
    previous_church: text().optional(), baptized_at: optionalDate, baptized_where: text().optional(),
    confirmation_date: optionalDate, occupation: text().optional(), employer: text().optional(),
    education_level: z.enum(education).optional(), skills: text().optional(),
    emergency_contact_name: text().optional(), emergency_contact_relationship: text(100).optional(),
    emergency_contact_phone: phone.optional(), notes: text(10000).optional(),
})
export const householdCreateSchema = z.object({
    name: requiredText(), status: z.enum(["active", "inactive", "closed"]).optional(),
    phone_number: text(17).optional(), secondary_phone_number: text(17).optional(), email,
    address: text().optional(), address_line2: text().optional(), city: text().optional(), province: text(100).optional(),
    country: text().optional(), notes: text(10000).optional(),
})
export const homecellCreateSchema = z.object({
    group_name: requiredText(), description: text(10000).optional(), leader_id: id.optional(),
    member_ids: z.array(id).optional(), non_church_members: text(10000).optional(), is_archived: z.boolean().optional(),
})
// Decimal strings are passed through without converting money to JS floating point.
const money = z.string().regex(/^-?\d{1,8}(\.\d{1,2})?$/, "Enter an amount with at most 8 whole digits and 2 decimal places.")
export const assetCreateSchema = z.object({
    item_name: requiredText(), acquisition_date: date, asset_type: z.enum(assetTypes), condition: z.enum(conditions),
    units: z.preprocess(value => value === "" ? undefined : value, z.coerce.number().int().min(0).max(2147483647)), item_code: text().optional(),
    description: text(2000).optional(), vendor: text().optional(), acquisition_cost: money.optional(), residual: money.optional(),
})
export const createSchemas = {
    members: memberCreateSchema, households: householdCreateSchema,
    homecells: homecellCreateSchema, assets: assetCreateSchema,
}
export type CreateResult =
    | { status: "created"; id: string; verified: boolean }
    | { status: "invalid"; errors: Record<string, string>; message: string }
    | { status: "uncertain"; message: string }

export const imageTypes = ["image/jpeg", "image/png", "image/webp"]
export function imageError(files: File[]) {
    if (files.length > 10) return "Choose at most 10 images."
    if (files.some(file => !imageTypes.includes(file.type) || file.size === 0)) return "Choose JPEG, PNG, or WebP images."
    if (files.some(file => file.size > 500 * 1024)) return "Each image must be 500 KB or smaller."
    if (files.reduce((size, file) => size + file.size, 0) > 750 * 1024) return "Images must total 750 KB or less."
    return null
}

export function safeFieldErrors(payload: unknown, fields: string[]) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {}
    // Never echo arbitrary serializer messages: some include submitted IDs or values.
    return Object.fromEntries(fields.filter(field => Object.hasOwn(payload, field)).map(field => [field, "Check this field and try again."]))
}

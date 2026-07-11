import { z } from "zod"

const dateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string",
})

const nanoidRegex = /^[a-zA-Z0-9_-]{12}$/

const flexibleBoolean = z.preprocess((value) => {
    if (typeof value !== "string") return value

    const normalized = value.trim().toLowerCase()
    if (["true", "1", "yes"].includes(normalized)) return true
    if (["false", "0", "no"].includes(normalized)) return false

    return value
}, z.boolean())

export const RoleSchema = z.object({
    id: z.number(),
    name: z.string(),
})

export const RegionSummarySchema = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
})

export const RegionRoleSchema = z.object({
    id: z.number(),
    role: z.string(),
    is_active: z.boolean(),
    region: z.number(),
    user: z.number(),
})

export const AssemblySummarySchema = z.object({
    id: z.number(),
    name: z.string(),
    uuid: z.string().uuid().optional(),
    zone: z.number().nullable().optional(),
    country: z.string().optional(),
    country_code: z.string().nullable().optional(),
    language: z.string().optional(),
    locale: z.string().optional(),
    currency: z.string().optional(),
    primary_currency: z.string().nullable().optional(),
    avatar: z.string().url().nullable().optional(),
    avatar_fallback: z.string().nullable().optional(),
})

export const AssemblySchema = AssemblySummarySchema.extend({
    uuid: z.string().uuid(),
    public_id: z.string(),
    code: z.string(),
    description: z.string(),
    address: z.string(),
    city: z.string(),
    province: z.string(),
    country: z.string(),
    phone_number: z.string(),
    email: z.string(),
    status: z.string(),
    cover_image: z.string().url().nullable(),
    cover_image_position: z.string(),
    established_date: z.string().nullable(),
    created_at: dateString,
    updated_at: dateString,
    assigned_pastors: z.array(z.number()),
})

export const UserSchema = z.object({
    id: z.number(),
    user_id: z.string().regex(nanoidRegex, "Invalid NanoID format"),

    full_name: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    username: z.string(),
    email: z.string().email(),
    recovery_email: z.string().email().nullable(),

    church: z.number(),
    assembly: AssemblySummarySchema.nullable(),
    assemblies: z.array(AssemblySummarySchema),

    roles: z.array(RoleSchema),

    is_region_staff: z.boolean().optional().default(false),
    active_region: RegionSummarySchema.nullable(),
    region_roles: z.array(RegionRoleSchema),
    assigned_regions: z.array(RegionSummarySchema),
    assigned_zones: z.array(z.any()),

    avatar: z.string().url().nullable(),
    avatar_fallback: z.string().nullable().optional().default(null),

    is_active: z.boolean(),
    is_admin: z.boolean(),
    is_onboarded: z.boolean(),
    is_student: flexibleBoolean,
    is_db_staff: flexibleBoolean,
    is_db_zone_staff: flexibleBoolean,
    is_academy_staff: flexibleBoolean,
    is_staff: flexibleBoolean,

    created_at: dateString,
    updated_at: dateString,
})

export type User = z.infer<typeof UserSchema>
export type Role = z.infer<typeof RoleSchema>
export type RegionSummary = z.infer<typeof RegionSummarySchema>
export type RegionRole = z.infer<typeof RegionRoleSchema>
export type AssemblySummary = z.infer<typeof AssemblySummarySchema>
export type Assembly = z.infer<typeof AssemblySchema>

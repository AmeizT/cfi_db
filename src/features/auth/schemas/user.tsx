import { z } from "zod"

const dateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date string",
})

const nanoidRegex = /^[a-zA-Z0-9_-]{12}$/

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
    zone: z.number().nullable(),
    country_code: z.string().nullable(),
    locale: z.string(),
    currency: z.string(),
    primary_currency: z.string().nullable(),
    avatar: z.string().url().nullable(),
    avatar_fallback: z.string().nullable(),
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

    is_region_staff: z.boolean(),
    active_region: RegionSummarySchema.nullable(),
    region_roles: z.array(RegionRoleSchema),
    assigned_regions: z.array(RegionSummarySchema),
    assigned_zones: z.array(z.any()),

    avatar: z.string().url().nullable(),
    avatar_fallback: z.string(),

    is_active: z.boolean(),
    is_admin: z.boolean(),
    is_onboarded: z.boolean(),
    is_student: z.boolean(),
    is_db_staff: z.boolean(),
    is_db_zone_staff: z.boolean(),
    is_academy_staff: z.boolean(),
    is_staff: z.boolean(),

    created_at: dateString,
    updated_at: dateString,
})

export type User = z.infer<typeof UserSchema>
export type Role = z.infer<typeof RoleSchema>
export type RegionSummary = z.infer<typeof RegionSummarySchema>
export type RegionRole = z.infer<typeof RegionRoleSchema>
export type AssemblySummary = z.infer<typeof AssemblySummarySchema>
export type Assembly = z.infer<typeof AssemblySchema>
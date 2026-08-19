import { z } from "zod"

const OptionalStringSchema = z.string().optional()
const NullableStringSchema = z.string().nullable().optional()
const NullableNumberSchema = z.number().nullable().optional()

export const MemberGenderSchema = z.enum(["Male", "Female"])
export const MembershipStageSchema = z.enum(["new", "established", "associate"])

export const MemberSchema = z.object({
    id: z.number(),
    full_name: z.string(),
    age: z.union([z.number(), z.string()]).nullable().optional(),
    spouse_full_name: z.string().nullable().optional(),
    ministries: z.array(z.string()),
    positions: z.array(z.string()),
    member_key: z.string(),
    prefix: OptionalStringSchema,
    first_name: z.string(),
    middle_name: OptionalStringSchema,
    maiden_name: OptionalStringSchema,
    last_name: z.string(),
    date_of_birth: z.iso.date(),
    place_of_birth: OptionalStringSchema,
    gender: MemberGenderSchema,
    relationship: OptionalStringSchema,
    marriage_date: NullableStringSchema,
    phone_number: OptionalStringSchema,
    secondary_phone_number: OptionalStringSchema,
    email: OptionalStringSchema,
    address: OptionalStringSchema,
    address_line2: OptionalStringSchema,
    city: OptionalStringSchema,
    province: OptionalStringSchema,
    country: z.string(),
    membersince: NullableStringSchema,
    membership_status: OptionalStringSchema,
    membership_stage: MembershipStageSchema.nullable().optional(),
    date_of_death: z.iso.date().nullable().optional(),
    previous_church: OptionalStringSchema,
    baptized: z.boolean().optional(),
    baptized_at: NullableStringSchema,
    baptized_where: OptionalStringSchema,
    confirmation_date: NullableStringSchema,
    occupation: OptionalStringSchema,
    employer: OptionalStringSchema,
    education_level: OptionalStringSchema,
    skills: OptionalStringSchema,
    emergency_contact_name: OptionalStringSchema,
    emergency_contact_relationship: OptionalStringSchema,
    emergency_contact_phone: OptionalStringSchema,
    avatar: NullableStringSchema,
    avatar_fallback: OptionalStringSchema,
    notes: OptionalStringSchema,
    pin_set: z.boolean().optional(),
    access_pin: OptionalStringSchema,
    is_trash: z.boolean().optional(),
    has_pending_transfer: z.boolean().optional(),
    pending_transfer_id: NullableNumberSchema,
    trash_date: NullableStringSchema,
    created_at: z.iso.datetime({ offset: true }),
    updated_at: z.iso.datetime({ offset: true }),
    assembly: z.number(),
    created_by: NullableNumberSchema,
    updated_by: NullableNumberSchema,
    spouse: NullableNumberSchema,
}).strict()

export const MembersListResponseSchema = z.array(MemberSchema)

export const PaginatedMembersResponseSchema = z.object({
    count: z.number().int().nonnegative(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: MembersListResponseSchema,
    table_schema: z.unknown().optional(),
}).strict()

export const MembersApiResponseSchema = z.union([
    MembersListResponseSchema,
    PaginatedMembersResponseSchema,
])

export function getMembersFromResponse(response: MembersApiResponse) {
    return Array.isArray(response) ? response : response.results
}

export function getMembersPageFromResponse(response: MembersApiResponse) {
    if (Array.isArray(response)) {
        return { count: response.length, next: null, previous: null, results: response }
    }
    return {
        count: response.count,
        next: response.next,
        previous: response.previous,
        results: response.results,
    }
}

export type Member = z.infer<typeof MemberSchema>
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>
export type PaginatedMembersResponse = z.infer<typeof PaginatedMembersResponseSchema>
export type MembersApiResponse = z.infer<typeof MembersApiResponseSchema>
export type MembersPage = ReturnType<typeof getMembersPageFromResponse>

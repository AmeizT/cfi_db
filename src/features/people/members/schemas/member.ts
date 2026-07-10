import { z } from "zod"

const OptionalStringSchema = z.string().optional()
const NullableStringSchema = z.string().nullable().optional()
const NullableNumberSchema = z.number().nullable().optional()

export const MemberGenderSchema = z.enum(["Male", "Female"])

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

export type Member = z.infer<typeof MemberSchema>
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>

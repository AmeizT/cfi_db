import { z } from "zod"

export const FormerMemberSchema = z.object({
    id: z.number(),
    member: z.number(),
    member_full_name: z.string(),
    former_assembly: z.number(),
    former_assembly_name: z.string(),
    joined_on: z.iso.date(),
    ended_on: z.iso.date(),
    end_reason: z.string(),
    end_notes: z.string(),
    transfer: z.number().nullable(),
    current_assembly: z.number().nullable(),
    current_assembly_name: z.string().nullable(),
    has_been_readmitted: z.boolean(),
})

export const FormerMemberDetailSchema = FormerMemberSchema.extend({
    member_key: z.string(),
    phone_number: z.string(),
    email: z.string(),
    avatar: z.string().nullable(),
    avatar_fallback: z.string(),
    member_since: z.iso.date().nullable(),
    household_name: z.string().nullable(),
})

export const FormerMemberListSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(FormerMemberSchema),
    table_schema: z.unknown().optional(),
})

export type FormerMember = z.infer<typeof FormerMemberSchema>
export type FormerMemberDetail = z.infer<typeof FormerMemberDetailSchema>
export type FormerMemberList = z.infer<typeof FormerMemberListSchema>

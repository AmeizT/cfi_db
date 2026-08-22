import { z } from "zod"

export const ChildDirectoryRowSchema = z.object({
    id: z.number(),
    member_key: z.string(),
    full_name: z.string(),
    age: z.number(),
    avatar_fallback: z.string(),
    church: z.number(),
    first_name: z.string(),
    middle_name: z.string(),
    last_name: z.string(),
    date_of_birth: z.iso.date(),
    gender: z.string(),
    guardian: z.number().nullable(),
    guardian_name: z.string().nullable(),
    guardian_relationship: z.string(),
    membersince: z.iso.date(),
    membership_status: z.string(),
    baptized_at: z.iso.date().nullable(),
    created_by: z.number().nullable(),
    created_at: z.iso.datetime({ offset: true }),
    updated_at: z.iso.datetime({ offset: true }),
})

export const ChildrenDirectoryResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(ChildDirectoryRowSchema),
    table_schema: z.unknown().optional(),
})

export type ChildDirectoryRow = z.infer<typeof ChildDirectoryRowSchema>
export type ChildrenDirectoryResponse = z.infer<typeof ChildrenDirectoryResponseSchema>

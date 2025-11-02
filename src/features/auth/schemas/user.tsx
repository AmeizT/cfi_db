import { z } from "zod"

export const RoleSchema = z.object({
    id: z.number(),
    name: z.string()
})

const nanoidRegex = /^[a-zA-Z0-9_-]{12}$/

export const UserSchema = z.object({
    id: z.number(),
    user_id: z.string().regex(nanoidRegex, "Invalid NanoID format"),
    church: z.number(),
    assemblies: z.array(z.any()),
    full_name: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    username: z.string(),
    email: z.string().email(),
    roles: z.array(RoleSchema),
    avatar: z.string().url().nullable(),
    avatar_fallback: z.string(),
    is_active: z.boolean(),
    is_admin: z.boolean(),
    is_onboarded: z.boolean(),
    is_student: z.boolean(),
    is_db_staff: z.boolean(),
    is_academy_staff: z.boolean(),
    is_staff: z.boolean(),
    created_at: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date string"
    }),
    updated_at: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date string"
    }),
})

export type User = z.infer<typeof UserSchema>
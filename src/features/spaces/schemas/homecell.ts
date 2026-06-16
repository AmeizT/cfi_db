import { z } from "zod"

export const homecellSchema = z.object({
    id: z.string().optional(),
    church: z.string().min(1, "Church ID is required"),
    group_name: z.string().min(1, "Group name is required"),
    description: z.string().optional(),
    members: z.array(z.string()).optional(),
    non_church_members: z.string().optional(),
    leader: z.string().optional(),
    is_archived: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

export type Homecell = z.infer<typeof homecellSchema>
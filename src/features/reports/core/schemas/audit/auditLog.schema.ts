import { z } from "zod"

const auditLogDataSchema = z.record(z.string(), z.any())

export const auditLogSchema = z.object({
    id: z.number(),
    user: z.number(),
    user_email: z.string().email(),
    model: z.string(),
    object_id: z.number(),
    action: z.enum(["Created", "Updated", "Deleted"]),
    old_data: auditLogDataSchema.nullable(),
    new_data: auditLogDataSchema.nullable(),
    timestamp: z.string().datetime()
})

export const auditLogsResponseSchema = z.array(auditLogSchema)


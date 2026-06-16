import { z } from "zod"
import { auditLogsResponseSchema } from "./auditLog.schema"

export type AuditLogsResponse = z.infer<typeof auditLogsResponseSchema>
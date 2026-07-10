import { z } from "zod"

export const HomecellSummarySchema = z.object({
    id: z.number(),
    group_name: z.string(),
}).strict()

export const HomecellsListResponseSchema = z.array(HomecellSummarySchema)

export type HomecellSummary = z.infer<typeof HomecellSummarySchema>
export type HomecellsListResponse = z.infer<typeof HomecellsListResponseSchema>

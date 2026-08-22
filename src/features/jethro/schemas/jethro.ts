import { z } from "zod"

export const JethroMemberCandidateSchema = z.object({
    public_id: z.string(),
    member_number: z.string(),
    full_name: z.string(),
    membership_status: z.string(),
    gender: z.string().nullable().optional(),
    assembly_name: z.string(),
    avatar: z.string().nullable().optional(),
})

export const JethroTitheDraftSchema = z.object({
    public_id: z.string(),
    status: z.string(),
    member_query: z.string(),
    member: JethroMemberCandidateSchema.nullable(),
    amount: z.string(),
    payment_method: z.string(),
    payment_date: z.string(),
    reference: z.string(),
    notes: z.string(),
    assembly_name: z.string(),
    expires_at: z.string(),
})

export const JethroTitheMemberSelectionSchema = z.object({
    type: z.literal("tithe_member_selection"),
    status: z.literal("pending_member_selection"),
    draft: JethroTitheDraftSchema,
    results: z.array(JethroMemberCandidateSchema),
    pagination: z.object({
        page: z.number(),
        page_size: z.number(),
        count: z.number(),
        has_next: z.boolean(),
        has_previous: z.boolean(),
    }),
    empty_reason: z.enum(["no_match", "no_eligible_members"]).nullable().optional(),
})

export const JethroTitheConfirmationSchema = z.object({
    type: z.literal("tithe_confirmation"),
    status: z.enum(["pending_confirmation", "cancelled"]),
    draft: JethroTitheDraftSchema,
})

export const JethroTitheSuccessSchema = z.object({
    type: z.literal("tithe_success"),
    status: z.literal("completed"),
    draft_id: z.string(),
    tithe_public_id: z.string(),
    member: JethroMemberCandidateSchema,
    amount: z.string(),
    payment_method: z.string(),
    payment_date: z.string(),
    assembly_name: z.string(),
    reference: z.string(),
    created_at: z.string(),
})

const LegacyStructuredContentSchema = z.object({
    type: z.enum(["members", "summary", "report_status"]),
}).passthrough()

export const JethroStructuredContentSchema = z.union([
    LegacyStructuredContentSchema,
    JethroTitheMemberSelectionSchema,
    JethroTitheConfirmationSchema,
    JethroTitheSuccessSchema,
])

export const JethroMessageSchema = z.object({
    role: z.enum(["user", "assistant", "tool", "system"]),
    content: z.string(),
    structured_content: JethroStructuredContentSchema.nullable(),
    created_at: z.string(),
})

export const JethroConversationSchema = z.object({
    public_id: z.string(),
    title: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    is_archived: z.boolean(),
    messages: z.array(JethroMessageSchema),
})

export const JethroConversationsSchema = z.array(JethroConversationSchema)

export const JethroSendResponseSchema = z.object({
    conversation_id: z.string(),
    message: JethroMessageSchema,
    usage: z.object({
        input_tokens: z.number(),
        output_tokens: z.number(),
        total_tokens: z.number(),
    }),
    mock_mode: z.boolean(),
})

export const JethroStatusSchema = z.object({
    enabled: z.boolean(),
    mock_mode: z.boolean(),
})

export type JethroMessage = z.infer<typeof JethroMessageSchema>
export type JethroConversation = z.infer<typeof JethroConversationSchema>
export type JethroSendResponse = z.infer<typeof JethroSendResponseSchema>
export type JethroStructuredContent = z.infer<typeof JethroStructuredContentSchema>
export type JethroMemberCandidate = z.infer<typeof JethroMemberCandidateSchema>
export type JethroTitheMemberSelection = z.infer<typeof JethroTitheMemberSelectionSchema>
export type JethroTitheConfirmation = z.infer<typeof JethroTitheConfirmationSchema>
export type JethroTitheSuccess = z.infer<typeof JethroTitheSuccessSchema>

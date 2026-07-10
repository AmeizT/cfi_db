import { z } from "zod"

const NullableStringSchema = z.string().nullable().optional()
const NullableNumberSchema = z.number().nullable().optional()

export const MemberTransferStatusSchema = z.enum([
    "pending_acceptance",
    "accepted",
    "completed",
    "rejected",
    "cancelled",
])

export const MemberTransferSchema = z.object({
    id: z.number(),
    member: z.number(),
    member_key: z.string().optional(),
    member_full_name: z.string(),
    from_assembly: z.number(),
    from_assembly_name: z.string(),
    to_assembly: z.number(),
    to_assembly_name: z.string(),
    status: MemberTransferStatusSchema,
    status_label: z.string(),
    effective_date: z.iso.date(),
    requested_by: NullableNumberSchema,
    requested_by_name: NullableStringSchema,
    requested_at: z.string(),
    reviewed_by: NullableNumberSchema,
    reviewed_by_name: NullableStringSchema,
    completed_by: NullableNumberSchema,
    completed_by_name: NullableStringSchema,
    reviewed_at: NullableStringSchema,
    completed_at: NullableStringSchema,
    has_pending_transfer: z.boolean().optional(),
    reason: z.string().optional(),
    notes: z.string().optional(),
    rejection_reason: z.string().optional(),
    member_summary: z
        .object({
            id: z.number(),
            member_key: z.string(),
            full_name: z.string(),
            membership_status: z.string(),
            assembly: z.number(),
        })
        .optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
}).passthrough()

export const MemberTransferListSchema = z.array(MemberTransferSchema)

export const AssemblyMembershipSchema = z.object({
    id: z.number(),
    member: z.number(),
    member_full_name: z.string(),
    assembly: z.number(),
    assembly_name: z.string(),
    start_date: z.iso.date(),
    end_date: NullableStringSchema,
    status: z.enum(["active", "transferred", "inactive"]),
    status_label: z.string(),
    created_by: NullableNumberSchema,
    created_by_name: NullableStringSchema,
    created_at: z.string(),
    updated_at: z.string(),
}).passthrough()

export const AssemblyMembershipListSchema = z.array(AssemblyMembershipSchema)

export const TransferAssemblySchema = z.object({
    id: z.number(),
    public_id: z.string().optional(),
    name: z.string(),
    code: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
}).passthrough()

export const TransferAssemblyListSchema = z.array(TransferAssemblySchema)

export const CreateMemberTransferPayloadSchema = z.object({
    member: z.number(),
    to_assembly: z.number(),
    effective_date: z.iso.date(),
    reason: z.string().optional(),
    notes: z.string().optional(),
})

export type MemberTransferStatus = z.infer<typeof MemberTransferStatusSchema>
export type MemberTransfer = z.infer<typeof MemberTransferSchema>
export type MemberTransferList = z.infer<typeof MemberTransferListSchema>
export type AssemblyMembership = z.infer<typeof AssemblyMembershipSchema>
export type AssemblyMembershipList = z.infer<typeof AssemblyMembershipListSchema>
export type TransferAssembly = z.infer<typeof TransferAssemblySchema>
export type TransferAssemblyList = z.infer<typeof TransferAssemblyListSchema>
export type CreateMemberTransferPayload = z.infer<typeof CreateMemberTransferPayloadSchema>

export type AcceptMemberTransferPayload = {
    id: number
    notes?: string
}

export type RejectMemberTransferPayload = {
    id: number
    rejection_reason: string
    notes?: string
}

export type CancelMemberTransferPayload = {
    id: number
    notes?: string
}

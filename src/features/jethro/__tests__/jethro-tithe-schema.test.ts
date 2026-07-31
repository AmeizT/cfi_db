import assert from "node:assert/strict"
import test from "node:test"
// @ts-expect-error Node's built-in TypeScript test runner requires the file extension.
import { JethroStructuredContentSchema } from "../schemas/jethro.ts"

const member = {
    public_id: "CFI-00124",
    member_number: "CFI-00124",
    full_name: "John Doe",
    membership_status: "Member",
    gender: "Male",
    assembly_name: "Central Assembly",
    avatar: null,
}

const draft = {
    public_id: "draft-token",
    status: "pending_confirmation",
    member_query: "John Doe",
    member,
    amount: "5000.00",
    payment_method: "Bank",
    payment_date: "2026-07-20",
    reference: "",
    notes: "",
    assembly_name: "Central Assembly",
    expires_at: "2026-07-20T12:15:00Z",
}

test("parses tithe member selection pagination state", () => {
    const parsed = JethroStructuredContentSchema.parse({
        type: "tithe_member_selection",
        status: "pending_member_selection",
        draft: { ...draft, status: "pending_member_selection", member: null },
        results: [member],
        pagination: { page: 1, page_size: 10, count: 1, has_next: false, has_previous: false },
        empty_reason: null,
    })
    assert.equal(parsed.type, "tithe_member_selection")
})

test("parses confirmation, cancellation, and success states", () => {
    assert.equal(JethroStructuredContentSchema.parse({ type: "tithe_confirmation", status: "pending_confirmation", draft }).type, "tithe_confirmation")
    assert.equal(JethroStructuredContentSchema.parse({ type: "tithe_confirmation", status: "cancelled", draft: { ...draft, status: "cancelled" } }).type, "tithe_confirmation")
    assert.equal(JethroStructuredContentSchema.parse({
        type: "tithe_success",
        status: "completed",
        draft_id: draft.public_id,
        tithe_public_id: draft.public_id,
        member,
        amount: draft.amount,
        payment_method: draft.payment_method,
        payment_date: draft.payment_date,
        assembly_name: draft.assembly_name,
        reference: "",
        created_at: "2026-07-20T12:00:00Z",
    }).type, "tithe_success")
})

test("rejects malformed success and pagination payloads", () => {
    assert.equal(JethroStructuredContentSchema.safeParse({ type: "tithe_success", status: "completed" }).success, false)
    assert.equal(JethroStructuredContentSchema.safeParse({ type: "tithe_member_selection", results: [] }).success, false)
})

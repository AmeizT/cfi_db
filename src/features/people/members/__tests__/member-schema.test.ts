import assert from "node:assert/strict"
import test from "node:test"
// @ts-expect-error Node's built-in TypeScript test runner requires the file extension.
import { MemberSchema, MembersApiResponseSchema, getMembersFromResponse } from "../schemas/member.ts"

const memberFixture = {
    id: 1,
    full_name: "Test Member",
    age: 36,
    spouse_full_name: null,
    ministries: [],
    positions: [],
    member_key: "member-key",
    first_name: "Test",
    last_name: "Member",
    date_of_birth: "1990-01-01",
    gender: "Male",
    country: "Botswana",
    membership_stage: "associate",
    date_of_death: null,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    assembly: 2,
}

test("parses membership_stage and a null date_of_death", () => {
    const parsed = MemberSchema.parse(memberFixture)

    assert.equal(parsed.membership_stage, "associate")
    assert.equal(parsed.date_of_death, null)
})

test("parses date_of_death as an ISO date", () => {
    const parsed = MemberSchema.parse({
        ...memberFixture,
        date_of_death: "2025-04-03",
    })

    assert.equal(parsed.date_of_death, "2025-04-03")
    assert.equal(MemberSchema.safeParse({
        ...memberFixture,
        date_of_death: "03/04/2025",
    }).success, false)
})

test("loads a paginated member response without unrecognized-key errors", () => {
    const response = MembersApiResponseSchema.parse({
        count: 1,
        next: null,
        previous: null,
        results: [memberFixture],
    })
    const members = getMembersFromResponse(response)

    assert.equal(members.length, 1)
    assert.equal(members[0]?.membership_stage, "associate")
})

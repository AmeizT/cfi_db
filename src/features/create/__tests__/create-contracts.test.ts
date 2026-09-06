import assert from "node:assert/strict"
import test from "node:test"
import { assetCreateSchema, householdCreateSchema, homecellCreateSchema, memberCreateSchema, safeFieldErrors, imageError } from "../forms/contracts"

const member = { first_name: "Test", last_name: "Member", date_of_birth: "2000-01-01", gender: "Male", country: "Botswana", phone_number: "", ministries: [], positions: [] }

test("minimal create payloads match the four available contracts", () => {
    assert.equal(memberCreateSchema.safeParse(member).success, true)
    assert.equal(householdCreateSchema.safeParse({ name: "Test Household" }).success, true)
    assert.equal(homecellCreateSchema.safeParse({ group_name: "Test Homecell" }).success, true)
    assert.equal(assetCreateSchema.safeParse({ item_name: "Chair", acquisition_date: "2026-01-01", asset_type: "Furniture", condition: "Good", units: "1" }).success, true)
})

test("member requires effective serializer keys but permits empty phone and relationship lists", () => {
    for (const field of Object.keys(member)) {
        const input: Record<string, unknown> = { ...member }
        delete input[field]
        assert.equal(memberCreateSchema.safeParse(input).success, false, field)
    }
    for (const [field, value] of [["date_of_birth", "2001-02-29"], ["email", "invalid"], ["phone_number", "123"], ["gender", "invalid"], ["spouse", "0"]]) {
        assert.equal(memberCreateSchema.safeParse({ ...member, [field]: value }).success, false, String(field))
    }
})

test("create schemas strip ownership, audit and permission fields", () => {
    const parsed = memberCreateSchema.parse({ ...member, assembly: 999, created_by: 999, id: 9, access_pin: "secret", is_trash: true, created_at: "2000-01-01", arbitrary: "ignored" })
    assert.deepEqual(parsed, member)
    assert.deepEqual(householdCreateSchema.parse({ name: "Home", assembly: 999, created_by: 4 }), { name: "Home" })
    assert.deepEqual(homecellCreateSchema.parse({ group_name: "Cell", church: 999, members: [99] }), { group_name: "Cell" })
})

test("asset money stays decimal text, with invalid precision and special values rejected", () => {
    const asset = { item_name: "Chair", acquisition_date: "2026-01-01", asset_type: "Furniture", condition: "Good", units: 1 }
    assert.equal(assetCreateSchema.parse({ ...asset, acquisition_cost: "12345678.90" }).acquisition_cost, "12345678.90")
    for (const value of ["NaN", "Infinity", "1.001", "100000000.00", "abc"]) {
        assert.equal(assetCreateSchema.safeParse({ ...asset, acquisition_cost: value }).success, false)
    }
    assert.equal(assetCreateSchema.safeParse({ ...asset, units: -1 }).success, false)
    assert.equal(assetCreateSchema.safeParse({ ...asset, units: "abc" }).success, false)
    assert.equal(assetCreateSchema.safeParse({ ...asset, units: "" }).success, false)
})

test("backend errors cannot echo personal values, unknown fields, or raw exceptions", () => {
    const errors = safeFieldErrors({ email: ["Private value private@example.com is invalid"], spouse: ["Invalid pk 999"], exception: "Traceback: secret", detail: "Private payload" }, ["email", "spouse"])
    assert.deepEqual(errors, { email: "Check this field and try again.", spouse: "Check this field and try again." })
    assert.deepEqual(safeFieldErrors("<html>Internal error</html>", ["email"]), {})
})

test("image metadata and size limits are enforced before upload", () => {
    assert.equal(imageError([new File(["image"], "test.png", { type: "image/png" })]), null)
    assert.ok(imageError([new File(["executable"], "test.svg", { type: "image/svg+xml" })]))
    assert.ok(imageError([new File([new Uint8Array(501 * 1024)], "large.png", { type: "image/png" })]))
    assert.ok(imageError(Array.from({ length: 2 }, () => new File([new Uint8Array(400 * 1024)], "image.png", { type: "image/png" }))))
})

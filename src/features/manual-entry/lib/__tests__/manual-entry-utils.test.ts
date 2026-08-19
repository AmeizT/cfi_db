import assert from "node:assert/strict"
import test from "node:test"
import { calculateEntryTotal, findDuplicateEntryIndices, flattenRowErrors } from "../manual-entry-utils.ts"

test("calculates financial totals including expense quantities", () => {
    assert.equal(calculateEntryTotal("tithes", [{ amount: "500.25" }, { amount: "350.00" }]), 850.25)
    assert.equal(calculateEntryTotal("expenses", [{ price: "25.50", quantity: 2 }, { price: "10", quantity: 3 }]), 81)
})

test("detects duplicate selections while allowing anonymous tithes", () => {
    assert.deepEqual(findDuplicateEntryIndices("revenue", [{ category: "1" }, { category: "2" }, { category: "1" }]), [2])
    assert.deepEqual(findDuplicateEntryIndices("tithes", [{ member: "anonymous" }, { member: "anonymous" }]), [])
})

test("flattens backend row errors without losing field association", () => {
    assert.deepEqual(flattenRowErrors({ member: ["Already recorded."], amount: "Must be positive." }), {
        member: "Already recorded.", amount: "Must be positive.",
    })
})

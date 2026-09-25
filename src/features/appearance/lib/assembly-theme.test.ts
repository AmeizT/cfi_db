import assert from "node:assert/strict"
import test from "node:test"
import { getAssemblyThemeColor } from "./assembly-theme"
import { AssemblySummarySchema } from "@/features/auth/schemas/user"

test("assembly color prefers the canonical field and accepts existing payloads", () => {
    assert.equal(getAssemblyThemeColor({ avatar_fallback_color: "#456", avatar_fallback: "#123" }), "#456")
    assert.equal(getAssemblyThemeColor({ avatar_fallback: "#123" }), "#123")
    assert.equal(getAssemblyThemeColor({ avatar_fallback_color: null, avatar_fallback: "#123" }), "#123")
    assert.equal(getAssemblyThemeColor(undefined), undefined)
})

test("user schema preserves the canonical assembly color on parsing", () => {
    const assembly = AssemblySummarySchema.parse({ id: 1, public_id: "assembly-1", name: "Assembly", avatar_fallback_color: "#456" })
    assert.equal(getAssemblyThemeColor(assembly), "#456")
})

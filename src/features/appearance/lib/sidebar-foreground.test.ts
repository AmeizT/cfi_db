import assert from "node:assert/strict"
import test from "node:test"
import { sidebarUsesLightForeground } from "./sidebar-foreground"

test("sidebar foreground responds to actual luminance, including saturated colors", () => {
    assert.equal(sidebarUsesLightForeground(20, 20, 60), true)
    assert.equal(sidebarUsesLightForeground(0, 0, 255), true)
    assert.equal(sidebarUsesLightForeground(255, 255, 255), false)
    assert.equal(sidebarUsesLightForeground(250, 220, 50), false)
    assert.equal(sidebarUsesLightForeground(0, 255, 0), false)
    assert.equal(sidebarUsesLightForeground(118, 118, 118), true)
    assert.equal(sidebarUsesLightForeground(119, 119, 119), false)
})

import assert from "node:assert/strict"
import test from "node:test"

import {
    quickCreateActions,
    resolveQuickCreateHref,
} from "../../config/workspace-navigation"

function action(key: string) {
    const item = quickCreateActions.find((candidate) => candidate.key === key)
    assert.ok(item, `Missing Quick Create action: ${key}`)
    return item
}

test("Quick Create configuration contains no legacy forms routes", () => {
    for (const item of quickCreateActions) {
        assert.doesNotMatch(item.href, /^\/forms\//)
    }
    assert.equal(action("continue-report").href, "/reports/current")
    assert.equal(action("member").href, "/members/lifecycle/onboarding")
})

test("report entry actions use canonical wizard routes with current context", () => {
    const report = {
        id: 84,
        status: "draft",
        capabilities: { is_editable: true },
    }
    const expected = {
        attendance: "/report-wizard/create/attendance?method=manual-entry&report_id=84",
        tithe: "/report-wizard/create/tithes?method=manual-entry&report_id=84",
        revenue: "/report-wizard/create/revenue?method=manual-entry&report_id=84",
        "operating-expense": "/report-wizard/create/overhead?method=manual-entry&report_id=84",
        "activity-expense": "/report-wizard/create/expenses?method=manual-entry&report_id=84",
    }

    for (const [key, href] of Object.entries(expected)) {
        assert.equal(resolveQuickCreateHref(action(key), report), href)
    }
})

test("missing and locked reports return to the guarded current-report flow", () => {
    assert.equal(resolveQuickCreateHref(action("attendance")), "/reports/current")
    assert.equal(
        resolveQuickCreateHref(action("tithe"), {
            id: 84,
            status: "locked",
            capabilities: { is_editable: false },
        }),
        "/reports/current",
    )
})

test("reopened reports preserve amendment context", () => {
    assert.equal(
        resolveQuickCreateHref(action("revenue"), {
            id: 84,
            status: "reopened",
            capabilities: { is_editable: true },
        }),
        "/report-wizard/create/revenue?method=manual-entry&report_id=84&amendment_context=reopened",
    )
})

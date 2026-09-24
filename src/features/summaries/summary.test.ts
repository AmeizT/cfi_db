import assert from "node:assert/strict"
import test from "node:test"
import { getWorkspaceNavigationSections } from "../../config/workspace-navigation"
import { getActiveNavigationKey } from "../../layouts/sidebar/navigation-utils"
import { number, money, financeValue, summaryCards, ytdCards, topContributorsByCurrency, exportRows } from "./presentation"
import type { User } from "../auth/schemas/user"
import type { SummaryMetrics, SummaryResponse, AssemblySummary, RegionalFilters } from "./types"

import { regionalFilterParams } from "./filters"

const user = (values: Partial<User>) => ({ is_region_staff: false, ...values } as User)
const summary: SummaryMetrics = {
    currency: "BWP", report_count: 1, expected_reports: 9,
    attendance: { total: 120, general: 100, school: null, cells: 0 },
    finance: { tithes: 100, other_revenue: 20, expenses: 30, due: null, paid: null, outstanding: null },
    membership: { previous: null, current: 0, net: null, percent: null, new: 0, transfers_in: 0, transfers_out: 0, removals: 0, households: 0, new_households: 0 },
    outreach: { plants: [], homecells: 0, ordained: null },
    targets: [{ name: "Tithes", target: null, achieved: 100, percent: null }],
}

test("summary navigation follows backend capabilities and highlights routes", () => {
    const cases = [
        [{}, []],
        [{ can_view_assembly_summary: true }, ["Assembly Summary"]],
        [{ can_view_executive_summary: true, can_view_assembly_summary: true }, ["Executive Summary", "Assembly Summary"]],
        [{ is_region_staff: true, assigned_regions: [{ id: 7 }], can_view_executive_summary: true }, ["Executive Summary"]],
    ] as const
    for (const [flags, labels] of cases) {
        const sections = getWorkspaceNavigationSections(user(flags as Partial<User>))
        const summaries = sections.flatMap(s => s.items).filter(i => i.href.startsWith("/summary/"))
        assert.deepEqual(summaries.map(i => i.label), labels)
        summaries.forEach(item => assert.equal(getActiveNavigationKey(item.href, sections), item.key))
    }
})

test("missing metrics stay missing and zero remains real zero", () => {
    assert.equal(number(null), "—")
    assert.equal(number(0), "0")
    assert.equal(money(null, "BWP"), "—")
    assert.equal(money(0, "BWP"), "BWP 0")
    const cards = summaryCards(summary, true)
    assert.equal(cards.find(c => c.label === "Total Members")?.value, "0")
    assert.equal(cards.find(c => c.label === "Leaders Ordained")?.value, "—")
    assert.match(cards[0].note, /YTD/)
    assert.equal(summaryCards(summary, false)[0].value, "100")
})

test("export preserves period context and absent targets", () => {
    const rows = exportRows({ name: "South", period: "2026-09", regional: true, summary, monthly_summary: summary, assemblies: [], limitations: [] } as unknown as SummaryResponse)
    assert.ok(rows.some(r => r.metric === "Tithes target (2026-09)" && r.value === "No target set"))
    assert.ok(rows.some(r => r.metric.includes("YTD")))
})


test("multi-currency financial values are displayed separately without hiding other totals", () => {
    const mixed: SummaryMetrics = {
        ...summary, currency: null, mixed_currencies: true,
        finance: { tithes: null, other_revenue: null, expenses: null, due: null, paid: null, outstanding: null },
        finance_by_currency: [
            { currency: "BWP", assembly_id: null, assembly_name: null, finance: summary.finance },
            { currency: "USD", assembly_id: null, assembly_name: null, finance: { ...summary.finance, tithes: 50 } },
        ],
        giving: { count: 3, previous_count: 1 },
    }
    assert.equal(financeValue(mixed, "tithes"), "BWP 100 · USD 50")
    assert.equal(financeValue(mixed, "due"), "BWP — · USD —")
    const cards = summaryCards(mixed, true)
    assert.equal(cards.find(c => c.label === "Total Tithes")?.value, "BWP 100 · USD 50")
    assert.equal(cards.find(c => c.label === "Total Attendance")?.value, "120")
    const rows = exportRows({ name: "South", period: "2026-09", regional: true, summary: mixed, monthly_summary: mixed, assemblies: [], limitations: [] } as unknown as SummaryResponse)
    assert.ok(rows.some(r => r.metric === "tithes (YTD)" && r.value === "BWP 100 · USD 50"))
    assert.ok(rows.some(r => r.metric.includes("Identified tithe contributors") && r.value === "3"))
})

test("unknown-currency amounts remain explicitly assembly scoped", () => {
    const unknown: SummaryMetrics = { ...summary, currency: null, finance_by_currency: [
        { currency: null, assembly_id: 1, assembly_name: "First", finance: summary.finance },
        { currency: null, assembly_id: 2, assembly_name: "Second", finance: { ...summary.finance, tithes: 0 } },
    ] }
    assert.equal(financeValue(unknown, "tithes"), "First (currency unknown): 100 · Second (currency unknown): 0")
})


test("zone changes retain valid countries and reset invalid ones", () => {
    const filters: RegionalFilters = { zone: 1, country: "BW", countries: [{ id: "BW", name: "Botswana" }], zones: [
        { id: 1, name: "Central", countries: [{ id: "BW", name: "Botswana" }] },
        { id: 2, name: "West", countries: [{ id: "NA", name: "Namibia" }] },
        { id: 3, name: "East", countries: [{ id: "BW", name: "Botswana" }] },
    ] }
    const next = regionalFilterParams("", filters, "zone", "2", "2026-09")
    assert.equal(next.get("country"), "NA")
    assert.equal(next.get("zone"), "2")
    assert.equal(next.get("period"), "2026-09")
    assert.equal(regionalFilterParams("", filters, "zone", "3", "2026-09").get("country"), "BW")
    const period = regionalFilterParams("", filters, "period", "2026-08", "2026-09")
    assert.equal(period.get("country"), "BW")
    assert.equal(period.get("zone"), "1")
    assert.equal(period.get("period"), "2026-08")
})

test("YTD overview excludes membership and contributors and uses general attendance", () => {
    const cards = ytdCards(summary)
    assert.equal(cards.length, 6)
    assert.equal(cards[0].value, "100")
    assert.ok(cards.some(c => c.label === "Remittance Paid YTD"))
    assert.ok(!cards.some(c => /Members|Homecells|Contributors/.test(c.label)))
    const monthly = { ...summary, finance: { ...summary.finance, tithes: 40 } }
    const rows = exportRows({ name: "South", period: "2026-09", regional: true, summary, monthly_summary: monthly, assemblies: [], limitations: [] } as unknown as SummaryResponse)
    assert.equal(rows.find(r => r.metric === "tithes (YTD)")?.value, "BWP 100")
    assert.equal(rows.find(r => r.metric === "tithes (2026-09)")?.value, "BWP 40")
    assert.ok(!rows.some(r => r.metric.startsWith("Membership") && r.metric.includes("YTD")))
})

test("monthly top contributors are ranked only within matching currencies", () => {
    const rows = [
        { id: 1, name: "First", currency: "BWP", giving: { top: [{ id: 1, name: "One", amount: 20 }] } },
        { id: 2, name: "Second", currency: "NAD", giving: { top: [{ id: 2, name: "Two", amount: 5000 }] } },
        { id: 3, name: "Third", currency: "BWP", giving: { top: [{ id: 3, name: "Three", amount: 30 }] } },
    ] as AssemblySummary[]
    const groups = topContributorsByCurrency(rows)
    assert.equal(groups.length, 2)
    assert.deepEqual(groups.find(g => g.currency === "BWP")?.contributors.map(c => c.name), ["Three", "One"])
    assert.equal(groups.find(g => g.currency === "NAD")?.contributors[0].amount, 5000)
})

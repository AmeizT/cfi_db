import assert from "node:assert/strict"
import test from "node:test"
import { normalizeFieldKey } from "../parsers/normalize-field-key"
import { parseQuickEntryNumber } from "../parsers/parse-number"
import { parseReportDate } from "../parsers/parse-report-date"
import {
    attendanceQuickEntrySchema,
    tithesQuickEntrySchema,
} from "../report-schema-registry"
import {
    createReportDraft,
    isReportDraftValid,
    parseCreateReportCommand,
    parseQuickEntryBatchInput,
    parseQuickEntryInput,
    serializeQuickEntryDraft,
    shouldConfirmDuplicateFieldReplacement,
    validateReportDraft,
} from "../quick-entry-utils"

test("parseReportDate accepts supported human formats", () => {
    const cases: Array<[string, string]> = [
        ["20-6-26", "2026-06-20"],
        ["20-06-26", "2026-06-20"],
        ["20/06/2026", "2026-06-20"],
        ["20.06.2026", "2026-06-20"],
        ["2026-06-20", "2026-06-20"],
        ["2026/06/20", "2026-06-20"],
    ]

    for (const [input, expected] of cases) {
        const parsed = parseReportDate(input)
        assert.equal(parsed.success, true)
        if (parsed.success) {
            assert.equal(parsed.isoDate, expected)
        }
    }
})

test("parseReportDate rejects impossible or empty dates", () => {
    for (const input of ["31-02-2026", "32-01-2026", "15-13-2026", ""]) {
        const parsed = parseReportDate(input)
        assert.equal(parsed.success, false)
    }
})

test("parseQuickEntryNumber normalizes grouped whole numbers", () => {
    const cases: Array<[string, number]> = [
        ["200", 200],
        ["1,200", 1200],
        ["1 200", 1200],
    ]

    for (const [input, expected] of cases) {
        const parsed = parseQuickEntryNumber(input, { min: 0 })
        assert.equal(parsed.success, true)
        if (parsed.success) {
            assert.equal(parsed.value, expected)
        }
    }
})

test("parseQuickEntryNumber rejects invalid integer input", () => {
    for (const input of ["-20", "200.5", "two hundred"]) {
        const parsed = parseQuickEntryNumber(input, { min: 0 })
        assert.equal(parsed.success, false)
    }
})

test("normalizeFieldKey resolves attendance aliases to canonical keys", () => {
    const cases: Array<[string, string]> = [
        ["male", "men"],
        ["males", "men"],
        ["female", "women"],
        ["visitor men", "visitor_men"],
        ["visitor women", "visitor_women"],
        ["date", "timestamp"],
    ]

    for (const [input, expected] of cases) {
        assert.equal(normalizeFieldKey(input, attendanceQuickEntrySchema), expected)
    }
})

test("parseCreateReportCommand resolves aliases and suggests close matches", () => {
    const tithes = parseCreateReportCommand("/create tithe")
    assert.equal(tithes.success, true)
    if (tithes.success) {
        assert.equal(tithes.schema.type, "tithes")
    }

    const invalid = parseCreateReportCommand("/create attendence")
    assert.equal(invalid.success, false)
    if (!invalid.success) {
        assert.equal(invalid.suggestion, "attendance")
        assert.ok(invalid.validTypes.includes("attendance"))
    }
})

test("validateReportDraft blocks save state while required fields are missing", () => {
    const draft = createReportDraft(attendanceQuickEntrySchema)
    const errors = validateReportDraft(draft, attendanceQuickEntrySchema)

    assert.equal(isReportDraftValid(draft, attendanceQuickEntrySchema), false)
    assert.equal(errors.timestamp, "Date is required.")
})

test("duplicate-field helper prompts only when a value would change", () => {
    assert.equal(shouldConfirmDuplicateFieldReplacement(200, 180), true)
    assert.equal(shouldConfirmDuplicateFieldReplacement(200, 200), false)
    assert.equal(shouldConfirmDuplicateFieldReplacement(undefined, 180), false)
})

test("attendance summary and serializer use canonical draft values", () => {
    const draft = createReportDraft(attendanceQuickEntrySchema)
    draft.values = {
        men: 200,
        women: 400,
        visitor_men: 5,
        visitor_women: 7,
        new_convert_men: 1,
        new_convert_women: 2,
        online_viewers: 50,
        preacher: "Pastor Tawanda",
        scriptures: "Genesis 2:10; John 3:16",
        timestamp: "2026-06-20",
    }

    const summary = attendanceQuickEntrySchema.calculateSummary?.(draft.values) ?? []
    assert.equal(summary[0]?.value, 662)

    const payload = serializeQuickEntryDraft(draft, attendanceQuickEntrySchema)
    assert.deepEqual(payload, {
        report_type: "attendance",
        source: "quick-entry",
        values: {
            men: 200,
            women: 400,
            visitor_men: 5,
            visitor_women: 7,
            new_convert_men: 1,
            new_convert_women: 2,
            altar_call_men: 0,
            altar_call_women: 0,
            baptism_men: 0,
            baptism_women: 0,
            online_viewers: 50,
            volunteers_on_duty: 0,
            total_leaders_present: 0,
            preacher: "Pastor Tawanda",
            scriptures: "Genesis 2:10; John 3:16",
            timestamp: "2026-06-20",
        },
    })
})

test("parseQuickEntryInput parses compact key value assignments", () => {
    const result = parseQuickEntryInput({
        input: "men=200 women=300 visitor_men=8 visitor_women=12 preacher=Pastor Tawanda scriptures=Genesis 2:10; John 3:16",
        schema: attendanceQuickEntrySchema,
        currentValues: {},
    })

    assert.deepEqual(result.updates, {
        men: 200,
        women: 300,
        visitor_men: 8,
        visitor_women: 12,
        preacher: "Pastor Tawanda",
        scriptures: "Genesis 2:10; John 3:16",
    })
    assert.equal(result.errors.length, 0)
})

test("parseQuickEntryInput parses multiline assignments independently", () => {
    const result = parseQuickEntryInput({
        input: "men=200\nwomen=300\nvisitor_men=10",
        schema: attendanceQuickEntrySchema,
        currentValues: {},
    })

    assert.deepEqual(result.updates, {
        men: 200,
        women: 300,
        visitor_men: 10,
    })
    assert.equal(result.errors.length, 0)
})

test("parseQuickEntryInput normalizes aliases and dates", () => {
    const result = parseQuickEntryInput({
        input: "male=200 female=300 visitor men=4 visitor women=6 date=20-6-26",
        schema: attendanceQuickEntrySchema,
        currentValues: {},
    })

    assert.deepEqual(result.updates, {
        men: 200,
        women: 300,
        visitor_men: 4,
        visitor_women: 6,
        timestamp: "2026-06-20",
    })
})

test("parseQuickEntryInput updates existing values without duplicating fields", () => {
    const result = parseQuickEntryInput({
        input: "women=320",
        schema: attendanceQuickEntrySchema,
        currentValues: {
            women: 300,
        },
    })

    assert.deepEqual(result.updates, {
        women: 320,
    })
    assert.ok(result.messages.some((message) => message.includes("updated from 300 to 320")))
})

test("parseQuickEntryInput lets the last valid duplicate value win", () => {
    const result = parseQuickEntryInput({
        input: "men=200 women=300 women=320",
        schema: attendanceQuickEntrySchema,
        currentValues: {},
    })

    assert.equal(result.updates.women, 320)
    assert.ok(result.warnings.some((warning) => warning.includes("Women was entered more than once")))
})

test("parseQuickEntryInput removes fields with aliases", () => {
    const result = parseQuickEntryInput({
        input: "/remove visitor men",
        schema: attendanceQuickEntrySchema,
        currentValues: {
            visitor_men: 20,
            men: 200,
        },
    })

    assert.deepEqual(result.removedKeys, ["visitor_men"])
    assert.equal(result.errors.length, 0)
})

test("parseQuickEntryInput reports unknown field suggestions", () => {
    const result = parseQuickEntryInput({
        input: "womens=300",
        schema: attendanceQuickEntrySchema,
        currentValues: {},
    })

    assert.equal(result.errors[0]?.message, "Unknown field: womens.")
    assert.equal(result.errors[0]?.suggestion, "women")
})

test("parseQuickEntryInput does not overwrite valid values with invalid input", () => {
    const result = parseQuickEntryInput({
        input: "men=two hundred",
        schema: attendanceQuickEntrySchema,
        currentValues: {
            men: 200,
        },
    })

    assert.deepEqual(result.updates, {})
    assert.equal(result.errors[0]?.message, "Men must be a whole number.")
})

test("parseQuickEntryInput parses tithes channel amounts", () => {
    const result = parseQuickEntryInput({
        input: "cash=1200 bank=4500 mobile_money=820 date=20-6-26",
        schema: tithesQuickEntrySchema,
        currentValues: {},
    })

    assert.deepEqual(result.updates, {
        cash: 1200,
        bank: 4500,
        mobile_money: 820,
        report_date: "2026-06-20",
    })

    const summary = tithesQuickEntrySchema.calculateSummary?.(result.updates) ?? []
    assert.equal(summary[0]?.value, "6520.00")
})

test("parseQuickEntryBatchInput parses one attendance record", () => {
    const result = parseQuickEntryBatchInput({
        input: "date=2026-06-18 women=200 men=50",
        schema: attendanceQuickEntrySchema,
    })

    assert.equal(result.errors.length, 0)
    assert.equal(result.rows.length, 1)
    assert.deepEqual(result.rows[0]?.values, {
        timestamp: "2026-06-18",
        women: 200,
        men: 50,
    })
})

test("parseQuickEntryBatchInput parses bracketed attendance batches in order", () => {
    const result = parseQuickEntryBatchInput({
        input: "[date=2026-06-18 women=200 men=50]\n[date=2026-06-27 women=100 men=80]",
        schema: attendanceQuickEntrySchema,
    })

    assert.equal(result.errors.length, 0)
    assert.equal(result.rows.length, 2)
    assert.equal(result.rows[0]?.values.timestamp, "2026-06-18")
    assert.equal(result.rows[1]?.values.timestamp, "2026-06-27")
})

test("parseQuickEntryBatchInput preserves quoted values", () => {
    const result = parseQuickEntryBatchInput({
        input: `[date=2026-06-18 women=200 notes="Sunday morning service"]`,
        schema: attendanceQuickEntrySchema,
    })

    assert.equal(result.errors.length, 0)
    assert.equal(result.rows[0]?.values.notes, "Sunday morning service")
})

test("parseQuickEntryBatchInput reports bracket and field errors", () => {
    const unmatched = parseQuickEntryBatchInput({
        input: "[date=2026-06-18 women=200",
        schema: attendanceQuickEntrySchema,
    })
    assert.ok(unmatched.errors.some((error) => error.includes("unmatched")))

    const unknown = parseQuickEntryBatchInput({
        input: "[date=2026-06-18 attendence=200]",
        schema: attendanceQuickEntrySchema,
    })
    assert.ok(unknown.rows[0]?.errors.attendence.includes("not a recognised Attendance field"))
})

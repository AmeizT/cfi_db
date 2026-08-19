import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { normalizeFinancialCategoryName } from "../lib/financial-category-utils.ts"

test("financial category normalization handles case, spacing, punctuation, and plurals", () => {
    const values = [
        "Building repair",
        "Building Repairs",
        "building-repairs",
        " Building   Repairs ",
    ]
    assert.deepEqual(
        new Set(values.map(normalizeFinancialCategoryName)),
        new Set(["building repair"]),
    )
})

test("category dialog includes loading, error, duplicate, mapping, and empty states", async () => {
    const dialog = await readFile(
        "src/features/manual-entry/components/CreateFinancialCategoryDialog.tsx",
        "utf8",
    )
    assert.match(dialog, /SuggestionSkeletons/)
    assert.match(dialog, /Suggestions could not be loaded/)
    assert.match(dialog, /This category already exists/)
    assert.match(dialog, /No similar categories were found/)
    assert.match(dialog, /Other \/ Not yet classified/)
    assert.match(dialog, /mappingConfirmed/)
    assert.match(dialog, /onSelect\(option\)/)
    assert.match(dialog, /createOption\.mutateAsync/)
})

test("category UI uses semantic theme tokens without hard-coded brand palettes", async () => {
    const files = await Promise.all([
        readFile("src/features/manual-entry/components/CreateFinancialCategoryDialog.tsx", "utf8"),
        readFile("src/features/manual-entry/components/FinancialEntriesForm.tsx", "utf8"),
    ])
    const source = files.join("\n")
    assert.doesNotMatch(source, /(?:bg|text|border)-(?:purple|blue|indigo|yellow)-/)
    assert.match(source, /bg-primary\/10/)
    assert.match(source, /text-primary/)
    assert.match(source, /border-border/)
    assert.match(source, /ring-primary\/20/)
})

test("financial entry form opens the dialog for a specific row and preserves form state", async () => {
    const form = await readFile(
        "src/features/manual-entry/components/FinancialEntriesForm.tsx",
        "utf8",
    )
    assert.match(form, /setCategoryTargetIndex\(index\)/)
    assert.match(form, /form\.setValue\(`entries\.\$\{categoryTargetIndex\}/)
    assert.match(form, /shouldDirty: true/)
    assert.doesNotMatch(form, /window\.location|router\.refresh/)
})

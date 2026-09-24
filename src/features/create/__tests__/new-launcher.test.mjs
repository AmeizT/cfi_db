import assert from "node:assert/strict"
import test from "node:test"
import { readFile } from "node:fs/promises"

test("global New uses the existing entity creation components and opens without navigation", async () => {
    const launcher = await readFile("src/features/create/launcher/NewLauncher.tsx", "utf8")
    for (const component of ["MemberQuickAdd", "HouseholdQuickAdd", "AssetQuickAdd", "HomecellForm"]) assert.ok(launcher.includes(`<${component} `))
    assert.doesNotMatch(launcher, /fetch\(|createRecord\(|Baptism|Dedication/)
    assert.match(launcher, /getMonthlyReportResumeSection\(report\)/)
    const trigger = await readFile("src/layouts/quick-create.tsx", "utf8")
    assert.match(trigger, /<NewLauncherMenu/)
    assert.doesNotMatch(trigger, /router.push|href=/)
    const shell = await readFile("src/layouts/app-shell.tsx", "utf8")
    assert.ok(shell.indexOf("<NewLauncherProvider>") < shell.indexOf("<ContextSidebar"))
})

test("launcher restores its opener and dismisses shared full-form links without closing pending writes", async () => {
    const launcher = await readFile("src/features/create/launcher/NewLauncher.tsx", "utf8")
    assert.match(launcher, /openerRef\.current = opener/)
    assert.match(launcher, /onCloseAutoFocus/)
    assert.match(launcher, /openerRef\.current\?\.isConnected/)
    assert.match(launcher, /openerRef\.current\.focus\(\)/)
    assert.ok(launcher.includes(`closest('a[href^="/"]')`))
    assert.ok(launcher.includes(`querySelector('[aria-busy="true"]')`))
})

test("both transfer entry points refresh the same Directory cache used for browsing", async () => {
    const directory = await readFile("src/features/people/members/hooks/use-members-directory.ts", "utf8")
    assert.match(directory, /assemblyQueryKeys\.key\(assemblyId, "people", "member-directory"/)
    for (const path of [
        "src/features/people/transfers/components/TransferMemberDialog.tsx",
        "src/features/people/transfers/views/MemberTransfersView.tsx",
    ]) {
        const source = await readFile(path, "utf8")
        assert.match(source, /invalidateQueries\(\{ queryKey: assemblyQueryKeys\.key\(assemblyId, "people", "member-directory"\)/)
    }
})


test("selection uses a dropdown while the shared dialog remains outside its content", async () => {
    const source = await readFile("src/features/create/launcher/NewLauncher.tsx", "utf8")
    const menu = source.slice(source.indexOf("export function NewLauncherMenu"))
    assert.match(menu, /<DropdownMenuTrigger asChild ref=\{triggerRef\}/)
    assert.match(menu, /<DropdownMenuLabel[^>]*>Generate/)
    assert.match(menu, /<DropdownMenuLabel[^>]*>Records/)
    assert.doesNotMatch(menu, /<Dialog|<QuickAddForm/)
    assert.match(menu, /pendingAction\.current = \{ entity: action\.key \}/)
    assert.match(menu, /onCloseAutoFocus/)
    assert.match(menu, /openQuickAdd\(action\.entity, triggerRef\.current\)/)
    assert.match(menu, /router\.push\(action\.href\)/)
    assert.match(source, /switch \(entity\)/)
    assert.match(source, /<QuickAddForm key=\{assemblyId\}/)
    assert.doesNotMatch(source, /useNewLauncher|LauncherContents/)
})


test("New menu preserves existing actions and Generate routes", async () => {
    const launcher = await readFile("src/features/create/launcher/NewLauncher.tsx", "utf8")
    assert.equal((launcher.match(/<DropdownMenuGroup aria-label=/g) ?? []).length, 2)
    for (const description of [
        "Create a new monthly report", "Excel & OCR report uploads", "Start from a saved template",
        "Add a new member", "Create a new household", "Create a new cell group", "Add a new asset",
    ]) assert.ok(launcher.includes(description))
    assert.doesNotMatch(launcher, /\/reports\/data-imports/)
    assert.match(launcher, /getMonthlyReportUploadHref\(reportQuery.data\)/)
    assert.match(launcher, /href: "\/record-center\/templates"/)
    const templates = await readFile("app/(authenticated)/(shell)/(forms)/record-center/templates/page.tsx", "utf8")
    assert.match(templates, /CentralCreateTemplatesView/)
    assert.match(launcher, /textValue=\{label\}/)
    assert.match(launcher, /collisionPadding=\{8\}/)
    assert.doesNotMatch(launcher, /<CommandInput|<input/)
})


test("Assembly opens the full form and uses the backend creation capability", async () => {
    const launcher = await readFile("src/features/create/launcher/NewLauncher.tsx", "utf8")
    assert.match(launcher, /action.key !== "assembly" \|\| user.data\?\.can_create_assembly/)
    assert.match(launcher, /case "assembly":[\s\S]*?<AssemblyForm/)
    const form = await readFile("src/features/create/forms/AssemblyForm.tsx", "utf8")
    assert.doesNotMatch(form, /name="(?:country_code|locale|currency|zone)"/)
    assert.match(form, /isoCodes/)
    assert.match(form, /options.data\?\.countries.find/)
})

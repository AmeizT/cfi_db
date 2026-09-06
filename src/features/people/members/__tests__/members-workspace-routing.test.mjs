import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const read = (path) => readFile(path, "utf8")

test("Members exposes three primary sections and four lifecycle sections", async () => {
    const navigation = await read(
        "src/features/people/members/config/members-section-navigation.ts"
    )

    assert.match(navigation, /label: "Directory"/)
    assert.match(navigation, /label: "Households"/)
    assert.match(navigation, /label: "Lifecycle"/)
    assert.equal(
        (navigation.match(/export const MEMBERS_SECTION_NAVIGATION[\s\S]*?\] as const/)?.[0]
            .match(/label:/g) ?? []).length,
        3
    )
    assert.match(navigation, /export const MEMBERS_LIFECYCLE_NAVIGATION/)
    for (const label of ["Onboarding", "Baptisms", "Dedications", "Transfers"]) {
        assert.match(navigation, new RegExp(`label: "${label}"`))
    }
})

test("Members workspace uses one route-aware H1 and one local navigation row", async () => {
    const [layout, workspace, navigation] = await Promise.all([
        read("app/(authenticated)/(shell)/(dashboard)/members/layout.tsx"),
        read("src/features/people/members/components/MembersWorkspace.tsx"),
        read("src/features/people/members/components/MembersSectionNavigation.tsx"),
    ])

    assert.match(layout, /<MembersWorkspace>/)
    assert.match(workspace, /<View className=/)
    assert.match(workspace, /headingAs="h1"/)
    assert.doesNotMatch(workspace, /pagename="Members"/)
    assert.doesNotMatch(workspace, /MembersLifecycleNavigation/)
    for (const page of ["Directory", "Households", "Onboarding", "Baptisms", "Dedications", "Transfers"]) {
        assert.match(workspace, new RegExp(`return "${page}"`))
    }
    assert.match(navigation, /searchParams\.toString\(\)/)
    assert.match(navigation, /<DropdownMenu>/)
    assert.match(navigation, /<DropdownMenuContent/)
    assert.match(navigation, /activeLifecycleItem/)
    assert.doesNotMatch(navigation, /View\.TabBar/)
})

test("Members child views do not render duplicate page headings", async () => {
    const childViews = await Promise.all([
        read("src/features/people/directory/components/directory-view.tsx"),
        read("src/features/people/families/views/HouseholdsView.tsx"),
        read("src/features/people/transfers/views/MemberTransfersView.tsx"),
        read("src/features/people/onboarding/views/OnboardingView.tsx"),
        read("src/features/people/ceremonies/views/CeremonyListView.tsx"),
    ])

    for (const source of childViews) {
        assert.doesNotMatch(source, /<View\.Header/)
        assert.doesNotMatch(source, /<h1/)
    }
})

test("legacy lifecycle routes redirect to canonical lifecycle URLs", async () => {
    const routes = await read("src/config/app-routes.ts")
    assert.match(routes, /onboarding: "\/members\/lifecycle\/onboarding"/)
    assert.match(routes, /baptisms: "\/members\/lifecycle\/baptisms"/)
    assert.match(routes, /dedications: "\/members\/lifecycle\/dedications"/)
    assert.match(routes, /transfers: "\/members\/lifecycle\/transfers"/)

    for (const route of ["onboarding", "baptisms", "dedications", "transfers"]) {
        const page = await read(
            `app/(authenticated)/(shell)/(dashboard)/members/${route}/page.tsx`
        )
        assert.match(page, /createLegacyRedirectPage/)
        assert.match(page, new RegExp(`APP_ROUTES\\.members\\.${route}`))
    }
})

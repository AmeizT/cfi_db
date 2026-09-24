import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { EntityMasterDetailView } from "../../shared/master-detail/entity-master-detail-view"
import type { MasterDetailEntityConfig } from "../../shared/master-detail/entity-master-detail.types"

test("selected draft replaces the profile while keeping the Directory and existing rows", () => {
    const config: MasterDetailEntityConfig<{ id: string }, "overview"> = {
        entityType: "member", title: "Directory", itemCountLabel: count => `${count} members`,
        searchPlaceholder: "Search members", selectedIdParam: "selected",
        tabs: [{ value: "overview", label: "Overview" }],
        getEntityId: item => item.id, getEntityLabel: item => item.id,
        renderListItem: (_item, state) => createElement("span", { "data-selected": state.selected }, "Existing row"),
        renderHeader: () => "Existing profile", renderOverview: () => "Existing overview", renderTabContent: () => null,
        emptyState: null, listStart: createElement("button", null, "New member · Draft"),
        detailOverlay: { active: true, title: "New member", onBack() {}, content: createElement("input", { placeholder: "Draft name" }) },
    }
    const props = { config, entities: [{ id: "one" }], selectedEntity: { id: "one" }, selectedId: "one", activeTab: "overview" as const,
        search: "", totalCount: 1, onSearchChange() {}, onSelect() {}, onTabChange() {} }
    const html = renderToStaticMarkup(createElement(EntityMasterDetailView<{ id: string }, "overview">, props))
    assert.ok(html.includes("Existing row"))
    assert.ok(html.includes('data-selected="false"'))
    assert.ok(html.includes('placeholder="Draft name"'))
    assert.ok(!html.includes("Existing profile"))
    assert.ok(html.indexOf("New member · Draft") < html.indexOf("Existing row"))
    const restored = renderToStaticMarkup(createElement(EntityMasterDetailView<{ id: string }, "overview">, {
        ...props, config: { ...config, detailOverlay: { ...config.detailOverlay!, active: false } },
    }))
    assert.ok(restored.includes("Existing profile"))
    assert.ok(restored.includes('data-selected="true"'))
    assert.ok(restored.includes('hidden=""'))
})

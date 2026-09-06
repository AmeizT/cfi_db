"use client"

import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"
import View from "@/components/ui/view"
import { useUser } from "@/hooks/query/use-user"
import { useHousehold, useHouseholds } from "../hooks"
import type { Household, HouseholdDetail } from "../schema"
import {
    EntityListItem,
    EntityFilterMenu,
    EntityMasterDetailView,
    getInitials,
    type MasterDetailEntityConfig,
    useMasterDetailUrlState,
} from "../../shared/master-detail"
import { HouseholdOverview, HouseholdProfileHeader, HouseholdTabContent } from "../../households/components/household-profile"
import { HouseholdFormDialog } from "../../households/components/household-form-dialog"
import { HOUSEHOLD_TAB_VALUES, getHouseholdTabs, type HouseholdTab } from "../../households/config/households-view.config"

type HouseholdEntity = Household | HouseholdDetail

export function HouseholdsView() {
    const userQuery = useUser()
    const canViewSensitive = Boolean(userQuery.data?.is_admin || userQuery.data?.is_staff || userQuery.data?.is_db_staff || userQuery.data?.is_region_staff)
    const tabs = getHouseholdTabs(canViewSensitive)
    const visibleTabValues = tabs.filter((tab) => tab.visible !== false).map((tab) => tab.value)
    const state = useMasterDetailUrlState<HouseholdTab>({
        defaultTab: "overview",
        validTabs: visibleTabValues.length ? visibleTabValues : HOUSEHOLD_TAB_VALUES,
    })
    const statusFilter = ["active", "inactive", "closed"].includes(state.filters) ? state.filters : undefined
    const query = useHouseholds({ search: state.search, status: statusFilter, page: state.page, page_size: state.pageSize })
    const detailQuery = useHousehold(state.selectedId)
    const selectedSummary = query.data?.results.find((household) => String(household.id) === state.selectedId)
    const selectedEntity: HouseholdEntity | undefined = detailQuery.data ?? selectedSummary
    const config = React.useMemo<MasterDetailEntityConfig<HouseholdEntity, HouseholdTab>>(() => ({
        entityType: "household",
        title: "Households",
        itemCountLabel: (count) => `${count} ${count === 1 ? "household" : "households"}`,
        searchPlaceholder: "Search households…",
        selectedIdParam: "selected",
        tabs,
        getEntityId: (household) => String(household.id),
        getEntityLabel: (household) => household.name,
        renderListItem: (household, itemState) => (
            <EntityListItem
                selected={itemState.selected}
                leading={<Avatar className="size-10"><AvatarFallback>{getInitials(household.name)}</AvatarFallback></Avatar>}
                title={household.name}
                description={`${household.active_member_count} ${household.active_member_count === 1 ? "member" : "members"} · ${household.head_of_household ?? "No primary contact"}`}
                meta={household.location || `Assembly #${household.assembly}`}
                aria-label={`Open ${household.name}`}
            />
        ),
        renderHeader: (household) => <HouseholdProfileHeader household={household} canManage={canViewSensitive} />,
        renderOverview: (household) => <HouseholdOverview household={household} showNotes={canViewSensitive} />,
        renderTabContent: ({ entity, tab }) => <HouseholdTabContent household={entity} tab={tab} />,
        primaryAction: canViewSensitive ? <HouseholdFormDialog triggerVariant="default" /> : undefined,
        filters: <EntityFilterMenu value={state.filters} options={[
            { value: "all", label: "All households" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "closed", label: "Closed" },
        ]} onValueChange={state.setFilters} />,
        emptyState: <EmptyState type="households" variant="both" />,
    }), [canViewSensitive, state.filters, state.setFilters, tabs])

    return (
        <View className="min-h-0 gap-0 overflow-hidden">
            <View.Body className="min-h-0 p-0 pb-0 lg:px-6 lg:pb-4">
                <EntityMasterDetailView
                    config={config}
                    entities={query.data?.results ?? []}
                    selectedEntity={selectedEntity}
                    selectedId={state.selectedId}
                    activeTab={state.activeTab}
                    search={state.search}
                    totalCount={query.data?.count ?? 0}
                    isListLoading={query.isLoading || query.isFetching}
                    isDetailLoading={Boolean(state.selectedId) && detailQuery.isLoading}
                    error={query.error ?? detailQuery.error}
                    pagination={{ page: state.page, pageSize: state.pageSize, total: query.data?.count ?? 0, onPageChange: state.setPage }}
                    onRetry={() => { void query.refetch(); if (state.selectedId) void detailQuery.refetch() }}
                    onSearchChange={state.setSearch}
                    onSelect={state.setSelectedId}
                    onTabChange={state.setActiveTab}
                />
            </View.Body>
        </View>
    )
}

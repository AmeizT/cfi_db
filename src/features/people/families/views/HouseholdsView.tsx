"use client"

import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"
import View from "@/components/ui/view"
import { useActiveAssemblyId, useUser } from "@/hooks/query/use-user"
import { useHousehold, useHouseholds, useDeleteHousehold } from "../hooks"
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
import { useCreateOptions } from "@/features/create/forms/FormShell"
import { HouseholdQuickAdd } from "../../households/components/HouseholdQuickAdd"
import { Plus, HousePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HOUSEHOLD_TAB_VALUES, getHouseholdTabs, type HouseholdTab } from "../../households/config/households-view.config"

import { toast } from "sonner"
import { PeopleSwipeRow } from "../../shared/master-detail/PeopleSwipeRow"
import { HouseholdActionsMenu, TransferHouseholdDialog } from "../../households/components/HouseholdRowActions"

type HouseholdEntity = Household | HouseholdDetail

export function HouseholdsView() {
    const assemblyId = useActiveAssemblyId()
    return <ScopedHouseholdsView key={assemblyId} />
}

function ScopedHouseholdsView() {
    const userQuery = useUser()
    const createOptions = useCreateOptions()
    const canCreate = Boolean(createOptions.data)
    const canViewSensitive = Boolean(userQuery.data?.is_admin || userQuery.data?.is_staff || userQuery.data?.is_db_staff || userQuery.data?.is_region_staff)
    const tabs = getHouseholdTabs(canViewSensitive)
    const visibleTabValues = tabs.filter((tab) => tab.visible !== false).map((tab) => tab.value)
    const state = useMasterDetailUrlState<HouseholdTab>({
        defaultTab: "overview",
        validTabs: visibleTabValues.length ? visibleTabValues : HOUSEHOLD_TAB_VALUES,
    })
    const [draftOpen, setDraftOpen] = React.useState(false)
    const [draftActive, setDraftActive] = React.useState(false)
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const closeDraft = React.useCallback(() => {
        setDraftOpen(false)
        setDraftActive(false)
        buttonRef.current?.focus()
    }, [])
    const context = JSON.stringify([state.search, state.filters, state.page])
    const [createdRecord, setCreatedRecord] = React.useState<{ id: string; context: string } | null>(null)
    const createdId = createdRecord?.context === context ? createdRecord.id : null
    const createdQuery = useHousehold(createdId)
    const onSelect: typeof state.setSelectedId = (id, options) => {
        setDraftActive(false)
        setCreatedRecord(null)
        state.setSelectedId(id, options)
    }
    const statusFilter = ["active", "inactive", "closed"].includes(state.filters) ? state.filters : undefined
    const query = useHouseholds({ search: state.search, status: statusFilter, page: state.page, page_size: state.pageSize })
    const detailQuery = useHousehold(state.selectedId)
    const selectedSummary = query.data?.results.find((household) => String(household.id) === state.selectedId)
    const selectedEntity: HouseholdEntity | undefined = detailQuery.data ?? selectedSummary
    const [transferHousehold, setTransferHousehold] = React.useState<HouseholdEntity | null>(null)
    const deleteMutation = useDeleteHousehold()
    const handleDelete = React.useCallback((household: HouseholdEntity) => {
        if (deleteMutation.isPending || !window.confirm(`Delete ${household.name}?`)) return
        deleteMutation.mutate(household.id, {
            onSuccess: () => {
                setCreatedRecord(null)
                if (state.selectedId === String(household.id)) state.setSelectedId(null)
                toast.success("Household deleted")
            },
            onError: error => toast.error(error.message),
        })
    }, [deleteMutation, state])
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
            <PeopleSwipeRow label={household.name} pending={deleteMutation.isPending} onDelete={() => handleDelete(household)} onTransfer={() => setTransferHousehold(household)}>
            <div className="relative">
            <EntityListItem
                className="pr-14"
                selected={itemState.selected}
                leading={<Avatar className="size-10"><AvatarFallback>{getInitials(household.name)}</AvatarFallback></Avatar>}
                title={household.name}
                description={`${household.active_member_count} ${household.active_member_count === 1 ? "member" : "members"} · ${household.head_of_household ?? "No primary contact"}`}
                meta={household.location || `Assembly #${household.assembly}`}
                aria-label={`Open ${household.name}`}
            />
            <div className="absolute right-3 top-3"><HouseholdActionsMenu name={household.name} pending={deleteMutation.isPending} onDelete={() => handleDelete(household)} onTransfer={() => setTransferHousehold(household)} /></div>
            </div>
            </PeopleSwipeRow>
        ),
        renderHeader: (household) => <HouseholdProfileHeader household={household} canManage={canViewSensitive} actions={<HouseholdActionsMenu name={household.name} pending={deleteMutation.isPending} onDelete={() => handleDelete(household)} onTransfer={() => setTransferHousehold(household)} />} />,
        renderOverview: (household) => <HouseholdOverview household={household} showNotes={canViewSensitive} />,
        renderTabContent: ({ entity, tab }) => <HouseholdTabContent household={entity} tab={tab} />,
        primaryAction: canCreate ? <Button ref={buttonRef} type="button" size="sm" aria-expanded={draftOpen} onClick={() => { setDraftOpen(true); setDraftActive(true) }}><Plus className="size-4" aria-hidden="true" /> New</Button> : undefined,
        listStart: canCreate && draftOpen ? <button type="button" aria-pressed={draftActive} onClick={() => setDraftActive(true)} className={`flex w-full items-center gap-3 border-b border-border-subtle p-4 text-left ${draftActive ? "bg-primary/10 text-primary" : "hover:bg-muted/50"}`}>
            <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-primary/40 bg-primary/10 text-primary"><HousePlus className="size-5" aria-hidden="true" /></span>
            <span><span className="block font-semibold">New household</span><span className="text-sm text-muted-foreground">Draft · editing</span></span>
        </button> : undefined,
        detailOverlay: canCreate && draftOpen ? {
            active: draftActive,
            title: "New household",
            onBack: () => { setDraftActive(false); state.setSelectedId(null) },
            content: <HouseholdQuickAdd onCancel={closeDraft} onCreated={id => {
                setCreatedRecord({ id, context })
                closeDraft()
                state.setSelectedId(id)
            }} />,
        } : undefined,
        filters: <EntityFilterMenu value={state.filters} options={[
            { value: "all", label: "All households" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "closed", label: "Closed" },
        ]} onValueChange={state.setFilters} />,
        emptyState: <EmptyState type="households" variant="both" />,
    }), [deleteMutation.isPending, handleDelete, canCreate, canViewSensitive, closeDraft, context, draftActive, draftOpen, state, tabs])

    return (
        <View className="min-h-0 gap-0 overflow-hidden">
            <View.Body className="min-h-0 p-0 pb-0 lg:px-6 lg:pb-4">
                <EntityMasterDetailView
                    config={config}
                    entities={createdId && createdQuery.data ? [createdQuery.data, ...(query.data?.results ?? []).filter(household => String(household.id) !== createdId)] : query.data?.results ?? []}
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
                    onSelect={onSelect}
                    onTabChange={state.setActiveTab}
                />
            </View.Body>
            {transferHousehold ? <TransferHouseholdDialog key={transferHousehold.id} household={transferHousehold} onClose={() => setTransferHousehold(null)} onTransferred={() => { setCreatedRecord(null); state.setSelectedId(null) }} /> : null}
        </View>
    )
}

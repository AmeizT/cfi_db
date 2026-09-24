"use client"

import * as React from "react"
import { PlusIcon, UserPlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { EmptyState } from "@/components/ui/empty-state"
import View from "@/components/ui/view"
import { useChildrenDirectory } from "@/features/people/children/hooks"
import type { ChildDirectoryRow } from "@/features/people/children/schema"
import { useMemberDetail, useMembersDirectoryPage } from "@/features/people/members/hooks/use-members-directory"
import type { Member } from "@/features/people/members/schemas/member"
import { TransferMemberDialog } from "@/features/people/transfers/components/TransferMemberDialog"
import { useCreateOptions } from "@/features/create/forms/FormShell"
import { MemberQuickAdd } from "@/features/people/members/components/MemberQuickAdd"
import { PeopleSwipeRow } from "../../shared/master-detail/PeopleSwipeRow"
import { MemberActionsMenu } from "./member-actions-menu"
import { MemberEditDialog } from "@/features/people/members/components/MemberEditDialog"
import { deleteMember } from "@/features/people/members/services/get-members-directory"
import { useActiveAssemblyId, useUser } from "@/hooks/query/use-user"
import {
    EntityMasterDetailView,
    EntityFilterMenu,
    type MasterDetailEntityConfig,
    useMasterDetailUrlState,
} from "../../shared/master-detail"
import { FormerMembersDirectory } from "../../former-members/components/former-members-directory"
import { ChildOverview, ChildProfileHeader, ChildTabContent } from "./child-profile"
import { DirectoryChildListItem, DirectoryMemberListItem } from "./directory-list-items"
import { MemberOverview, MemberProfileHeader, MemberTabContent } from "./member-profile"
import {
    DIRECTORY_SEGMENTS,
    DIRECTORY_SEGMENT_VALUES,
    getDirectoryTabs,
    type DirectoryTab,
} from "../config/directory-view.config"

type DirectoryState = ReturnType<typeof useMasterDetailUrlState<DirectoryTab>>

function canManagePeople(user: ReturnType<typeof useUser>["data"]) {
    return Boolean(user?.is_admin || user?.is_staff || user?.is_db_staff || user?.is_region_staff)
}

function useMemberQuickAdd(state: DirectoryState) {
    const options = useCreateOptions()
    const canCreate = options.data?.can_create_member === true
    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState(false)
    const context = JSON.stringify([state.search, state.activeSegment, state.page])
    const [createdRecord, setCreatedRecord] = React.useState<{ id: string; context: string } | null>(null)
    const createdId = createdRecord?.context === context ? createdRecord.id : null
    const created = useMemberDetail(createdId)
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const close = React.useCallback(() => {
        setOpen(false)
        setActive(false)
        buttonRef.current?.focus()
    }, [])
    const select: DirectoryState["setSelectedId"] = (id, options) => {
        setCreatedRecord(null)
        setActive(false)
        state.setSelectedId(id, options)
    }
    return {
        select,
        createdMember: createdId ? created.data : undefined,
        clearCreated: () => setCreatedRecord(null),
        config: {
            primaryAction: canCreate ? <Button ref={buttonRef} type="button" size="sm" aria-expanded={open} onClick={() => { setOpen(true); setActive(true) }}><PlusIcon aria-hidden="true" className="size-4" /> New</Button> : undefined,
            listStart: canCreate && open ? <button type="button" onClick={() => setActive(true)} aria-pressed={active} className={`flex w-full items-center gap-3 border-b border-border-subtle p-4 text-left ${active ? "bg-primary/10 text-primary" : "hover:bg-muted/50"}`}>
                <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-primary/40 bg-primary/10 text-primary"><UserPlusIcon className="size-5" aria-hidden="true" /></span>
                <span><span className="block font-semibold">New member</span><span className="text-sm text-muted-foreground">Draft · editing</span></span>
            </button> : undefined,
            detailOverlay: canCreate && open ? {
                active,
                title: "New member",
                onBack: () => { setActive(false); state.setSelectedId(null) },
                content: <MemberQuickAdd onCancel={close} onCreated={id => { setCreatedRecord({ id, context }); close(); state.setSelectedId(id) }} />,
            } : undefined,
        },
    }
}

function ActiveMembersDirectory({ state, group, canManage, canViewSensitive, assemblyName }: {
    state: DirectoryState
    group: "all" | "adults"
    canManage: boolean
    canViewSensitive: boolean
    assemblyName?: string
}) {
    const quickAdd = useMemberQuickAdd(state)
    const queryClient = useQueryClient()
    const [transferMember, setTransferMember] = React.useState<Member | null>(null)
    const [editingMember, setEditingMember] = React.useState<Member | null>(null)
    const query = useMembersDirectoryPage({ search: state.search, group, page: state.page, page_size: state.pageSize })
    const selectedSummary = query.data?.results.find((member) => member.member_key === state.selectedId)
    const detailQuery = useMemberDetail(state.selectedId)
    const selectedEntity = detailQuery.data ?? selectedSummary
    const tabs = getDirectoryTabs(canViewSensitive)
    const deleteMutation = useMutation({
        mutationFn: deleteMember,
        onSuccess: async () => {
            quickAdd.clearCreated()
            state.setSelectedId(null)
            await queryClient.invalidateQueries({ queryKey: ["assembly"] })
            toast.success("Member deleted")
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Member could not be deleted."),
    })
    const handleDelete = React.useCallback((member: Member) => {
        if (deleteMutation.isPending) return
        if (!window.confirm(`Delete ${member.full_name}? Their historical records will be preserved.`)) return
        deleteMutation.mutate(member.member_key)
    }, [deleteMutation])
    const config = React.useMemo<MasterDetailEntityConfig<Member, DirectoryTab>>(() => ({
        entityType: "member",
        title: "Directory",
        itemCountLabel: (count) => `${count} ${group === "adults" ? "adult " : ""}${count === 1 ? "member" : "members"}`,
        searchPlaceholder: "Search members…",
        selectedIdParam: "selected",
        tabs,
        getEntityId: (member) => member.member_key,
        getEntityLabel: (member) => member.full_name,
        renderListItem: (member, itemState) => <PeopleSwipeRow label={member.full_name} pending={deleteMutation.isPending} onDelete={() => handleDelete(member)} onTransfer={() => setTransferMember(member)}><DirectoryMemberListItem member={member} selected={itemState.selected} actions={
            <MemberActionsMenu
                memberName={member.full_name}
                canManage={canManage}
                onTransfer={() => setTransferMember(member)}
                onEdit={() => setEditingMember(member)}
                onDelete={() => handleDelete(member)}
                deleting={deleteMutation.isPending}
                className="opacity-0 group-hover/member-row:opacity-100 group-focus-within/member-row:opacity-100 data-[state=open]:opacity-100 [@media(pointer:coarse)]:opacity-100"
            />
        } /></PeopleSwipeRow>,
        renderHeader: (member) => (
            <MemberProfileHeader
                member={member}
                assemblyName={assemblyName}
                canManage={canManage}
                onEdit={() => setEditingMember(member)}
                onDelete={() => handleDelete(member)}
                onTransfer={() => setTransferMember(member)}
                deleting={deleteMutation.isPending}
            />
        ),
        renderOverview: (member) => <MemberOverview member={member} assemblyName={assemblyName} showNotes={canViewSensitive} />,
        renderTabContent: ({ entity, tab }) => <MemberTabContent member={entity} tab={tab} />,
        ...quickAdd.config,
        filters: <EntityFilterMenu value={state.activeSegment} options={DIRECTORY_SEGMENTS} onValueChange={state.setSegment} />,
        emptyState: <EmptyState type={state.search ? "filteredReports" : "demographics"} variant="both" context={{ label: "members" }} />,
    }), [quickAdd, assemblyName, canManage, canViewSensitive, deleteMutation.isPending, group, handleDelete, state.activeSegment, state.search, state.setSegment, tabs])

    return (
        <>
            <EntityMasterDetailView
                config={config}
                entities={quickAdd.createdMember && group === "all" ? [quickAdd.createdMember, ...(query.data?.results ?? []).filter(member => member.member_key !== quickAdd.createdMember?.member_key)] : query.data?.results ?? []}
                selectedEntity={selectedEntity}
                selectedId={state.selectedId}
                activeTab={state.activeTab}
                search={state.search}
                totalCount={query.data?.count ?? 0}
                isListLoading={query.isLoading || query.isFetching}
                isDetailLoading={Boolean(state.selectedId) && detailQuery.isLoading}
                error={query.error ?? detailQuery.error}
                segments={DIRECTORY_SEGMENTS}
                activeSegment={state.activeSegment}
                pagination={{ page: state.page, pageSize: state.pageSize, total: query.data?.count ?? 0, onPageChange: state.setPage }}
                onRetry={() => { void query.refetch(); if (state.selectedId) void detailQuery.refetch() }}
                onSearchChange={state.setSearch}
                onSegmentChange={state.setSegment}
                onSelect={quickAdd.select}
                onTabChange={state.setActiveTab}
            />
            <TransferMemberDialog
                key={transferMember?.member_key ?? "transfer-closed"}
                member={transferMember}
                open={Boolean(transferMember)}
                onOpenChange={(open) => { if (!open) setTransferMember(null) }}
            />
            <MemberEditDialog
                key={editingMember?.member_key ?? "closed"}
                member={editingMember}
                open={Boolean(editingMember)}
                onOpenChange={(open) => { if (!open) setEditingMember(null) }}
            />
        </>
    )
}

function ChildrenDirectory({ state, assemblyName }: { state: DirectoryState; assemblyName?: string }) {
    const quickAdd = useMemberQuickAdd(state)
    const query = useChildrenDirectory({ search: state.search, page: state.page, page_size: state.pageSize })
    const selectedEntity = query.data?.results.find((child) => child.member_key === state.selectedId)
    const tabs = getDirectoryTabs(false).map((tab) => ({ ...tab, visible: ["overview", "attendance", "activity"].includes(tab.value) }))
    const config = React.useMemo<MasterDetailEntityConfig<ChildDirectoryRow, DirectoryTab>>(() => ({
        entityType: "member",
        title: "Directory",
        itemCountLabel: (count) => `${count} ${count === 1 ? "child" : "children"}`,
        searchPlaceholder: "Search children or guardians…",
        selectedIdParam: "selected",
        tabs,
        getEntityId: (child) => child.member_key,
        getEntityLabel: (child) => child.full_name,
        renderListItem: (child, itemState) => <DirectoryChildListItem child={child} selected={itemState.selected} />,
        renderHeader: (child) => <ChildProfileHeader child={child} assemblyName={assemblyName} />,
        renderOverview: (child) => <ChildOverview child={child} assemblyName={assemblyName} />,
        renderTabContent: ({ entity, tab }) => <ChildTabContent child={entity} tab={tab} />,
        ...quickAdd.config,
        filters: <EntityFilterMenu value={state.activeSegment} options={DIRECTORY_SEGMENTS} onValueChange={state.setSegment} />,
        emptyState: <EmptyState type={state.search ? "filteredReports" : "demographics"} variant="both" context={{ label: "children" }} />,
    }), [quickAdd, assemblyName, state.activeSegment, state.search, state.setSegment, tabs])

    return (
        <EntityMasterDetailView
            config={config}
            entities={query.data?.results ?? []}
            selectedEntity={selectedEntity}
            selectedId={state.selectedId}
            activeTab={state.activeTab}
            search={state.search}
            totalCount={query.data?.count ?? 0}
            isListLoading={query.isLoading || query.isFetching}
            error={query.error}
            segments={DIRECTORY_SEGMENTS}
            activeSegment={state.activeSegment}
            pagination={{ page: state.page, pageSize: state.pageSize, total: query.data?.count ?? 0, onPageChange: state.setPage }}
            onRetry={() => void query.refetch()}
            onSearchChange={state.setSearch}
            onSegmentChange={state.setSegment}
            onSelect={quickAdd.select}
            onTabChange={state.setActiveTab}
        />
    )
}

export function DirectoryView({ initialSegment = "all" }: { initialSegment?: string }) {
    const userQuery = useUser()
    const assemblyId = useActiveAssemblyId()
    const canManage = canManagePeople(userQuery.data)
    const canViewSensitive = canManage
    const tabs = getDirectoryTabs(canViewSensitive).filter((tab) => tab.visible !== false).map((tab) => tab.value)
    const state = useMasterDetailUrlState<DirectoryTab>({
        defaultTab: "overview",
        validTabs: tabs,
        defaultSegment: DIRECTORY_SEGMENT_VALUES.includes(initialSegment) ? initialSegment : "all",
        validSegments: DIRECTORY_SEGMENT_VALUES,
    })
    const assemblyName = userQuery.data?.assembly?.name

    return (
        <View className="min-h-0 gap-0 overflow-hidden">
            <View.Body className="min-h-0 p-0 pb-0 lg:px-6 lg:pb-4">
                {state.activeSegment === "former" ? (
                    <FormerMembersDirectory state={state} canManage={canManage} assemblyName={assemblyName} />
                ) : state.activeSegment === "children" ? (
                    <ChildrenDirectory key={assemblyId} state={state} assemblyName={assemblyName} />
                ) : (
                    <ActiveMembersDirectory key={assemblyId} state={state} group={state.activeSegment === "adults" ? "adults" : "all"} canManage={canManage} canViewSensitive={canViewSensitive} assemblyName={assemblyName} />
                )}
            </View.Body>
        </View>
    )
}

export type { DirectoryState }

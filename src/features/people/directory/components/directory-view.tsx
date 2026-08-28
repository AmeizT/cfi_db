"use client"

import * as React from "react"
import Link from "next/link"
import { UserPlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APP_ROUTES } from "@/config/app-routes"
import { EmptyState } from "@/components/ui/empty-state"
import View from "@/components/ui/view"
import { useChildrenDirectory } from "@/features/people/children/hooks"
import type { ChildDirectoryRow } from "@/features/people/children/schema"
import { useMemberDetail, useMembersDirectoryPage } from "@/features/people/members/hooks/use-members-directory"
import type { Member } from "@/features/people/members/schemas/member"
import { useUser } from "@/hooks/query/use-user"
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

function AddMemberAction({ visible }: { visible: boolean }) {
    if (!visible) return null
    return <Button asChild size="sm"><Link href={APP_ROUTES.members.onboarding}><UserPlusIcon aria-hidden="true" className="size-4" /> Add member</Link></Button>
}

function ActiveMembersDirectory({ state, group, canManage, canViewSensitive, assemblyName }: {
    state: DirectoryState
    group: "all" | "adults"
    canManage: boolean
    canViewSensitive: boolean
    assemblyName?: string
}) {
    const query = useMembersDirectoryPage({ search: state.search, group, page: state.page, page_size: state.pageSize })
    const selectedSummary = query.data?.results.find((member) => member.member_key === state.selectedId)
    const detailQuery = useMemberDetail(state.selectedId)
    const selectedEntity = detailQuery.data ?? selectedSummary
    const tabs = getDirectoryTabs(canViewSensitive)
    const config = React.useMemo<MasterDetailEntityConfig<Member, DirectoryTab>>(() => ({
        entityType: "member",
        title: "Directory",
        itemCountLabel: (count) => `${count} ${group === "adults" ? "adult " : ""}${count === 1 ? "member" : "members"}`,
        searchPlaceholder: "Search members…",
        selectedIdParam: "selected",
        tabs,
        getEntityId: (member) => member.member_key,
        getEntityLabel: (member) => member.full_name,
        renderListItem: (member, itemState) => <DirectoryMemberListItem member={member} selected={itemState.selected} />,
        renderHeader: (member) => <MemberProfileHeader member={member} assemblyName={assemblyName} />,
        renderOverview: (member) => <MemberOverview member={member} assemblyName={assemblyName} showNotes={canViewSensitive} />,
        renderTabContent: ({ entity, tab }) => <MemberTabContent member={entity} tab={tab} />,
        primaryAction: <AddMemberAction visible={canManage} />,
        filters: <EntityFilterMenu value={state.activeSegment} options={DIRECTORY_SEGMENTS} onValueChange={state.setSegment} />,
        emptyState: <EmptyState type={state.search ? "filteredReports" : "demographics"} variant="both" context={{ label: "members" }} />,
    }), [assemblyName, canManage, canViewSensitive, group, state.activeSegment, state.search, state.setSegment, tabs])

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
            isDetailLoading={Boolean(state.selectedId) && detailQuery.isLoading}
            error={query.error ?? detailQuery.error}
            segments={DIRECTORY_SEGMENTS}
            activeSegment={state.activeSegment}
            pagination={{ page: state.page, pageSize: state.pageSize, total: query.data?.count ?? 0, onPageChange: state.setPage }}
            onRetry={() => { void query.refetch(); if (state.selectedId) void detailQuery.refetch() }}
            onSearchChange={state.setSearch}
            onSegmentChange={state.setSegment}
            onSelect={state.setSelectedId}
            onTabChange={state.setActiveTab}
        />
    )
}

function ChildrenDirectory({ state, canManage, assemblyName }: { state: DirectoryState; canManage: boolean; assemblyName?: string }) {
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
        primaryAction: <AddMemberAction visible={canManage} />,
        filters: <EntityFilterMenu value={state.activeSegment} options={DIRECTORY_SEGMENTS} onValueChange={state.setSegment} />,
        emptyState: <EmptyState type={state.search ? "filteredReports" : "demographics"} variant="both" context={{ label: "children" }} />,
    }), [assemblyName, canManage, state.activeSegment, state.search, state.setSegment, tabs])

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
            onSelect={state.setSelectedId}
            onTabChange={state.setActiveTab}
        />
    )
}

export function DirectoryView({ initialSegment = "all" }: { initialSegment?: string }) {
    const userQuery = useUser()
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
                    <ChildrenDirectory state={state} canManage={canManage} assemblyName={assemblyName} />
                ) : (
                    <ActiveMembersDirectory state={state} group={state.activeSegment === "adults" ? "adults" : "all"} canManage={canManage} canViewSensitive={canViewSensitive} assemblyName={assemblyName} />
                )}
            </View.Body>
        </View>
    )
}

export type { DirectoryState }

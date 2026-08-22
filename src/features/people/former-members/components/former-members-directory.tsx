"use client"

import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"
import type { DirectoryState } from "../../directory/components/directory-view"
import { DIRECTORY_SEGMENTS, type DirectoryTab } from "../../directory/config/directory-view.config"
import {
    EntityListItem,
    EntityFilterMenu,
    EntityMasterDetailView,
    formatEntityDate,
    getInitials,
    type MasterDetailEntityConfig,
} from "../../shared/master-detail"
import { useFormerMember, useFormerMembers } from "../hooks"
import type { FormerMember } from "../schema"
import { FormerMemberOverview, FormerMemberProfileHeader, FormerMemberTabContent } from "./former-member-profile"

export function FormerMembersDirectory({ state, canManage }: { state: DirectoryState; canManage: boolean; assemblyName?: string }) {
    const query = useFormerMembers({ search: state.search, page: state.page, page_size: state.pageSize })
    const detailQuery = useFormerMember(state.selectedId)
    const selectedSummary = query.data?.results.find((former) => String(former.id) === state.selectedId)
    const selectedEntity = detailQuery.data ?? selectedSummary
    const config = React.useMemo<MasterDetailEntityConfig<FormerMember, DirectoryTab>>(() => ({
        entityType: "former-member",
        title: "Directory",
        itemCountLabel: (count) => `${count} former ${count === 1 ? "member" : "members"}`,
        searchPlaceholder: "Search former members…",
        selectedIdParam: "selected",
        tabs: [
            { value: "overview", label: "Overview" },
            { value: "activity", label: "History & Activity" },
            { value: "notes", label: "Notes" },
        ],
        getEntityId: (former) => String(former.id),
        getEntityLabel: (former) => former.member_full_name,
        renderListItem: (former, itemState) => (
            <EntityListItem
                selected={itemState.selected}
                leading={<Avatar className="size-10"><AvatarFallback>{getInitials(former.member_full_name)}</AvatarFallback></Avatar>}
                title={former.member_full_name}
                description={former.former_assembly_name}
                meta={`${former.end_reason || "Reason unavailable"} · ${formatEntityDate(former.ended_on)}`}
                aria-label={`Open ${former.member_full_name}'s former member profile`}
            />
        ),
        renderHeader: (former) => <FormerMemberProfileHeader former={former} canManage={canManage} />,
        renderOverview: (former) => <FormerMemberOverview former={former} />,
        renderTabContent: ({ entity, tab }) => <FormerMemberTabContent former={entity} tab={tab} />,
        filters: <EntityFilterMenu value={state.activeSegment} options={DIRECTORY_SEGMENTS} onValueChange={state.setSegment} />,
        emptyState: <EmptyState type="formerMembers" variant="both" />,
    }), [canManage, state.activeSegment, state.setSegment])

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

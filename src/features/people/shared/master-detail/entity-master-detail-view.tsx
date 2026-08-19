"use client"

import * as React from "react"
import { EntityDetailPanel } from "./entity-detail-panel"
import { EntityListHeader } from "./entity-list-header"
import { EntityListPanel } from "./entity-list-panel"
import { EntityProfileTabs } from "./entity-profile-tabs"
import {
    EntityDetailSkeleton,
    EntityListSkeleton,
    EntityMasterDetailEmpty,
    EntityMasterDetailError,
    EntityNeutralDetail,
} from "./entity-master-detail-states"
import type { EntityMasterDetailViewProps } from "./entity-master-detail.types"

export function EntityMasterDetailView<TEntity, TTab extends string>({
    config,
    entities,
    selectedEntity,
    selectedId,
    activeTab,
    search,
    totalCount,
    isListLoading,
    isDetailLoading,
    error,
    segments,
    activeSegment,
    pagination,
    onRetry,
    onSearchChange,
    onSegmentChange,
    onSelect,
    onTabChange,
}: EntityMasterDetailViewProps<TEntity, TTab>) {
    const firstId = entities[0] ? config.getEntityId(entities[0]) : null

    React.useEffect(() => {
        if (isListLoading || error || typeof window === "undefined") return
        const desktop = window.matchMedia("(min-width: 1024px)").matches
        if (!selectedId && firstId && desktop) onSelect(firstId, { replace: true })
    }, [error, firstId, isListLoading, onSelect, selectedId])

    React.useEffect(() => {
        if (isListLoading || !selectedId || selectedEntity || !firstId) return
        onSelect(firstId, { replace: true })
    }, [firstId, isListLoading, onSelect, selectedEntity, selectedId])

    const detailVisible = Boolean(selectedId)
    const visibleTabs = config.tabs.filter((tab) => tab.visible !== false)
    const resolvedActiveTab = visibleTabs.some((tab) => tab.value === activeTab)
        ? activeTab
        : (visibleTabs[0]?.value ?? activeTab)

    return (
        <div className="flex min-h-0 flex-1 overflow-hidden border-y border-border-subtle bg-background lg:rounded-lg lg:border">
            <EntityListPanel
                hidden={detailVisible}
                pagination={pagination}
                header={(
                    <EntityListHeader
                        key={search}
                        title={config.title}
                        countLabel={config.itemCountLabel(totalCount)}
                        search={search}
                        searchPlaceholder={config.searchPlaceholder}
                        segments={segments}
                        activeSegment={activeSegment}
                        primaryAction={config.primaryAction}
                        filters={config.filters}
                        onSearchChange={onSearchChange}
                        onSegmentChange={onSegmentChange}
                    />
                )}
            >
                {error ? <EntityMasterDetailError error={error} onRetry={onRetry} />
                    : isListLoading && entities.length === 0 ? <EntityListSkeleton />
                    : entities.length === 0 ? <EntityMasterDetailEmpty>{config.emptyState}</EntityMasterDetailEmpty>
                    : entities.map((entity) => {
                        const id = config.getEntityId(entity)
                        const selected = id === selectedId
                        return (
                            <div key={id}>
                                <div onClick={() => onSelect(id)}>
                                    {config.renderListItem(entity, { selected })}
                                </div>
                            </div>
                        )
                    })}
            </EntityListPanel>

            <EntityDetailPanel
                visible={detailVisible}
                mobileTitle={selectedEntity ? config.getEntityLabel(selectedEntity) : undefined}
                onBack={() => onSelect(null)}
            >
                {isDetailLoading ? <EntityDetailSkeleton />
                    : selectedEntity ? (
                        <>
                            {config.renderHeader(selectedEntity)}
                            <EntityProfileTabs tabs={config.tabs} value={resolvedActiveTab} onValueChange={onTabChange} />
                            <div className="min-w-0 p-4 sm:p-6">
                                {resolvedActiveTab === "overview" ? config.renderOverview(selectedEntity) : config.renderTabContent({ entity: selectedEntity, tab: resolvedActiveTab })}
                            </div>
                        </>
                    ) : <EntityNeutralDetail />}
            </EntityDetailPanel>
        </div>
    )
}

import type { ReactNode } from "react"

export type EntityTab<TTab extends string> = {
    value: TTab
    label: string
    visible?: boolean
}

export type EntitySegment = {
    value: string
    label: string
}

export type ListItemState = {
    selected: boolean
}

export type EntityPagination = {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
}

export type MasterDetailEntityConfig<TEntity, TTab extends string> = {
    entityType: "member" | "former-member" | "household"
    title: string
    itemCountLabel: (count: number) => string
    searchPlaceholder: string
    selectedIdParam: string
    tabs: Array<EntityTab<TTab>>
    getEntityId: (entity: TEntity) => string
    getEntityLabel: (entity: TEntity) => string
    renderListItem: (entity: TEntity, state: ListItemState) => ReactNode
    renderHeader: (entity: TEntity) => ReactNode
    renderOverview: (entity: TEntity) => ReactNode
    renderTabContent: (args: { entity: TEntity; tab: TTab }) => ReactNode
    primaryAction?: ReactNode
    filters?: ReactNode
    emptyState: ReactNode
}

export type EntityMasterDetailViewProps<TEntity, TTab extends string> = {
    config: MasterDetailEntityConfig<TEntity, TTab>
    entities: TEntity[]
    selectedEntity?: TEntity
    selectedId: string | null
    activeTab: TTab
    search: string
    totalCount: number
    isListLoading?: boolean
    isDetailLoading?: boolean
    error?: unknown
    segments?: EntitySegment[]
    activeSegment?: string
    pagination?: EntityPagination
    onRetry?: () => void
    onSearchChange: (value: string) => void
    onSegmentChange?: (value: string) => void
    onSelect: (id: string | null, options?: { replace?: boolean }) => void
    onTabChange: (tab: TTab) => void
}

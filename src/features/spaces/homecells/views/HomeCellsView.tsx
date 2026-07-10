"use client"

import * as React from "react"
import { HomeIcon, NetworkIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { DataTable } from "@/features/reports/core/components/DataTable"
import {
    ResourceViewToggle,
    type ResourceViewMode,
} from "@/features/resource-directory/components/ResourceViewToggle"
import { homecellsTableSchema } from "../config/table-schema"
import { useHomecellsDirectory } from "../hooks/use-homecells-directory"
import type { HomecellSummary } from "../schemas/homecell"

type HomecellTableRow = Record<string, unknown> & {
    id: number
    group_name: string
    id_label: string
}

const tableOptions = {
    enablePinning: true,
}

function mapHomecellRow(homecell: HomecellSummary): HomecellTableRow {
    return {
        id: homecell.id,
        group_name: homecell.group_name,
        id_label: `#${homecell.id}`,
    }
}

function HomeCellCard({ homecell }: { homecell: HomecellSummary }) {
    return (
        <article
            tabIndex={0}
            className="flex min-h-44 flex-col rounded-lg border border-border bg-card p-4 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
        >
            <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <HomeIcon className="size-5" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-semibold text-foreground">
                        {homecell.group_name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Home cell summary record
                    </p>
                </div>
            </div>

            <div className="mt-auto pt-5">
                <Badge variant="outline">Record #{homecell.id}</Badge>
            </div>
        </article>
    )
}

function HomeCellCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
                <Skeleton className="size-11 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-44" />
                </div>
            </div>
            <Skeleton className="mt-8 h-5 w-24" />
        </div>
    )
}

function HomeCellsEmpty() {
    return (
        <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <HomeIcon className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
                No home cells found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Home cell records from the current assembly scope will appear here.
            </p>
        </div>
    )
}

function HomeCellsError({ error }: { error: unknown }) {
    const message = error instanceof Error
        ? error.message
        : "Home cells could not be loaded."

    return (
        <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
            <NetworkIcon
                aria-hidden="true"
                className="mx-auto size-10 text-muted-foreground"
            />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
                Unable to load home cells
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {message}
            </p>
        </div>
    )
}

export function HomeCellsView() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const viewParam = searchParams.get("view")
    const view: ResourceViewMode = viewParam === "cards" ? "cards" : "table"

    const homecellsQuery = useHomecellsDirectory()
    const homecells = React.useMemo(
        () => homecellsQuery.data ?? [],
        [homecellsQuery.data]
    )
    const tableRows = React.useMemo(
        () => homecells.map(mapHomecellRow),
        [homecells]
    )
    const isLoading = homecellsQuery.isLoading || homecellsQuery.isFetching
    const isInitialCardLoading = isLoading && homecells.length === 0

    const handleViewChange = React.useCallback(
        (nextView: ResourceViewMode) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("view", nextView)

            const query = params.toString()
            router.replace(query ? `${pathname}?${query}` : pathname, {
                scroll: false,
            })
        },
        [pathname, router, searchParams]
    )

    return (
        <View className="gap-0">
            <View.Header
                pagename="Home Cells"
                description="Home cell summary records in the current assembly scope."
                actions={(
                    <ResourceViewToggle
                        value={view}
                        onChange={handleViewChange}
                    />
                )}
            />

            <View.Body className="gap-4 py-4">
                {homecellsQuery.isError ? (
                    <HomeCellsError error={homecellsQuery.error} />
                ) : !isLoading && homecells.length === 0 ? (
                    <HomeCellsEmpty />
                ) : view === "cards" ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {isInitialCardLoading
                            ? Array.from({ length: 8 }).map((_, index) => (
                                <HomeCellCardSkeleton key={index} />
                            ))
                            : homecells.map((homecell) => (
                                <HomeCellCard
                                    key={homecell.id}
                                    homecell={homecell}
                                />
                            ))}
                    </div>
                ) : (
                    <DataTable<HomecellTableRow>
                        data={tableRows}
                        config={homecellsTableSchema}
                        isLoading={isLoading}
                        loadingMode="overlay"
                        options={tableOptions}
                        showToolbar={false}
                        showRowActions={false}
                        enableDelete={false}
                        exportFilename="home-cells"
                    />
                )}
            </View.Body>
        </View>
    )
}

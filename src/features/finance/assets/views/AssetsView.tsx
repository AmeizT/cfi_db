"use client"

import * as React from "react"
import { CalendarDaysIcon, ImageIcon, PackageIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import View from "@/components/ui/view"
import { DataTable } from "@/features/reports/core/components/DataTable"
import { useDataTablePagination } from "@/features/reports/core/components/hooks/useDataTablePagination"
import {
    ResourceViewToggle,
    type ResourceViewMode,
} from "@/features/resource-directory/components/ResourceViewToggle"
import { formatCurrency } from "@/utils"
import { assetsTableSchema } from "../config/table-schema"
import { useAssetsDirectory } from "../hooks/use-assets-directory"
import type { Asset } from "../schemas/asset"

type AssetTableRow = Record<string, unknown> & {
    id: number
    item_name: string
    item_code: string
    asset_type: string
    condition: string
    assembly_label: string
    units: number
    acquisition_date_label: string
    acquisition_cost: string
    vendor: string
    currency?: string
    primary_currency?: string
}

const tableOptions = {
    enablePinning: true,
}

function formatDate(value: string) {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return "Not available"
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date)
}

function formatAssetValue(asset: Asset) {
    const amount = Number(asset.acquisition_cost)

    if (!Number.isFinite(amount)) {
        return "Not available"
    }

    if (!asset.assembly.currency) {
        return new Intl.NumberFormat(asset.assembly.language || undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }).format(amount)
    }

    return formatCurrency(amount, {
        language: asset.assembly.language,
        currency: asset.assembly.currency,
        currencyDisplay: "narrowSymbol",
    })
}

function getAssetImage(asset: Asset) {
    return asset.asset_images[0]?.image ?? null
}

function mapAssetRow(asset: Asset): AssetTableRow {
    return {
        id: asset.id,
        item_name: asset.item_name,
        item_code: asset.item_code || "Not assigned",
        asset_type: asset.asset_type,
        condition: asset.condition,
        assembly_label: `Assembly #${asset.assembly.id}`,
        units: asset.units,
        acquisition_date_label: formatDate(asset.acquisition_date),
        acquisition_cost: asset.acquisition_cost ?? "0.00",
        vendor: asset.vendor || "Not available",
        currency: asset.assembly.currency,
        primary_currency: asset.assembly.currency,
    }
}

function AssetImage({ asset }: { asset: Asset }) {
    const image = getAssetImage(asset)

    if (!image) {
        return (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-muted text-muted-foreground">
                <PackageIcon className="size-8" aria-hidden="true" />
            </div>
        )
    }

    return (
        <div
            className="aspect-[4/3] w-full rounded-md bg-muted bg-cover bg-center"
            role="img"
            aria-label={`${asset.item_name} image`}
            style={{ backgroundImage: `url(${image})` }}
        />
    )
}

function AssetCard({ asset }: { asset: Asset }) {
    return (
        <article
            tabIndex={0}
            className="flex min-h-80 flex-col rounded-lg border border-border bg-card p-4 outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
        >
            <AssetImage asset={asset} />

            <div className="mt-4 min-w-0">
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-semibold text-foreground">
                            {asset.item_name}
                        </h2>
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                            {asset.item_code || "No asset code"}
                        </p>
                    </div>
                    <Badge variant="secondary">{asset.condition}</Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline">{asset.asset_type}</Badge>
                    <Badge variant="outline">{asset.units} units</Badge>
                </div>
            </div>

            <dl className="mt-4 grid gap-3 text-sm">
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Value</dt>
                    <dd className="mt-1 font-semibold text-foreground">
                        {formatAssetValue(asset)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Assigned Assembly</dt>
                    <dd className="mt-1 text-foreground">Assembly #{asset.assembly.id}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Acquired</dt>
                    <dd className="mt-1 flex items-center gap-2 text-foreground">
                        <CalendarDaysIcon
                            className="size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        {formatDate(asset.acquisition_date)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Vendor</dt>
                    <dd className="mt-1 truncate text-foreground">
                        {asset.vendor || "Not available"}
                    </dd>
                </div>
            </dl>
        </article>
    )
}

function AssetCardSkeleton() {
    return (
        <div className="rounded-lg border border-border bg-card p-4">
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
            </div>
        </div>
    )
}

function AssetsError({ error }: { error: unknown }) {
    const message = error instanceof Error
        ? error.message
        : "Assets could not be loaded."

    return (
        <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
            <ImageIcon
                aria-hidden="true"
                className="mx-auto size-10 text-muted-foreground"
            />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
                Unable to load assets
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {message}
            </p>
        </div>
    )
}

export function AssetsView() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pagination = useDataTablePagination()
    const viewParam = searchParams.get("view")
    const view: ResourceViewMode = viewParam === "cards" ? "cards" : "table"

    const assetsQuery = useAssetsDirectory({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
    })
    const assets = React.useMemo(
        () => assetsQuery.data?.results ?? [],
        [assetsQuery.data?.results]
    )
    const tableRows = React.useMemo(
        () => assets.map(mapAssetRow),
        [assets]
    )
    const isLoading = assetsQuery.isLoading || assetsQuery.isFetching
    const isInitialCardLoading = isLoading && assets.length === 0

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
                pagename="Assets"
                description="Assembly assets from the finance asset register."
                actions={(
                    <ResourceViewToggle
                        value={view}
                        onChange={handleViewChange}
                    />
                )}
            />

            <View.Body className="gap-4 py-4">
                {assetsQuery.isError ? (
                    <AssetsError error={assetsQuery.error} />
                ) : !isLoading && assets.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card px-6 py-12">
                        <EmptyState
                            type="assets"
                            variant="both"
                            context={{ label: "assets" }}
                        />
                    </div>
                ) : view === "cards" ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {isInitialCardLoading
                            ? Array.from({ length: 8 }).map((_, index) => (
                                <AssetCardSkeleton key={index} />
                            ))
                            : assets.map((asset) => (
                                <AssetCard key={asset.id} asset={asset} />
                            ))}
                    </div>
                ) : (
                    <DataTable<AssetTableRow>
                        data={tableRows}
                        config={assetsTableSchema}
                        isLoading={isLoading}
                        loadingMode="overlay"
                        options={tableOptions}
                        showToolbar={false}
                        showRowActions={false}
                        enableDelete={false}
                        totalRows={assetsQuery.data?.count ?? 0}
                        currentPage={pagination.currentPage}
                        pageSize={pagination.pageSize}
                        pageSizeOptions={pagination.pageSizeOptions}
                        onPageChange={pagination.onPageChange}
                        onPageSizeChange={pagination.onPageSizeChange}
                        exportFilename="assets"
                    />
                )}
            </View.Body>
        </View>
    )
}

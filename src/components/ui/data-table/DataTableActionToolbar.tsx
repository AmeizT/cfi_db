import { motion, AnimatePresence } from "motion/react"
import { Trash2, X } from "lucide-react"
import { useOptimisticMutation } from "@/hooks/use-optimistic-mutation";
import { queryKeys } from "../editable-cell";
import { useSearchParams } from "next/navigation";
import { bulksoftDeleteRecords } from "@/features/reports/core/actions/delete/bulkSoftDelete";
import type { ApiBulkDeleteRouteKey } from "@/config/urls";
import { removeRecordsFromCache } from "@/helpers/removeFromCache";
import { Button } from "@/components/ui/button"

type BulkActionToolbarProps = {
    selectedCount: number
    selectedIds: (number)[]
    // onDelete: (ids: (number)[]) => void
    resource?: ApiBulkDeleteRouteKey
    onClear: () => void
    queryKey?: readonly unknown[]
}

export function DataTableBulkActionToolbar({
    selectedCount,
    selectedIds,
    // onDelete,
    onClear,
    resource,
    queryKey,
}: BulkActionToolbarProps) {
    const searchParams = useSearchParams()
    const reportId = searchParams.get("reportId")
        ?? searchParams.get("reportid")
        ?? searchParams.get("report_id")
        ?? ""
    const resolvedQueryKey = queryKey
        ?? (resource ? queryKeys[resource as keyof typeof queryKeys]?.(reportId) : undefined)
        ?? ["data-table-records", resource ?? "selection"]
    
    const mutation = useOptimisticMutation({
        queryKey: resolvedQueryKey,
        mutationFn: bulksoftDeleteRecords,
        updateCache: (old, payload) =>
            removeRecordsFromCache(
                old,
                payload.ids
            ),

        successMessage: "Records deleted",
        invalidateAll: true,

        onSuccess: () => {
            onClear()
        },
    })

    function handleBulkDelete(){
        if (!resource) return
        mutation.mutate({
            resource,
            ids: selectedIds,
        })
    }

    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                    }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="flex items-center gap-3 rounded-full border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
                        {/* Selection Count */}
                        <span className="text-sm font-medium px-3">
                            {selectedCount} selected
                        </span>

                        {/* Delete */}
                        {resource ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={mutation.isPending}
                                onClick={handleBulkDelete}
                                className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                                {mutation.isPending ? "Deleting…" : "Delete"}
                            </Button>
                        ) : null}

                        {/* Clear */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Clear row selection"
                            onClick={onClear}
                            className="size-8 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

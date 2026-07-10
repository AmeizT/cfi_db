import { motion, AnimatePresence } from "motion/react"
import { Trash2, X } from "lucide-react"
import { useOptimisticMutation } from "@/hooks/use-optimistic-mutation";
import { queryKeys } from "../editable-cell";
import { useSearchParams } from "next/navigation";
import { bulksoftDeleteRecords } from "@/features/reports/core/actions/delete/bulkSoftDelete";
import type { ApiBulkDeleteRouteKey } from "@/config/urls";
import { removeRecordsFromCache } from "@/helpers/removeFromCache";

type BulkActionToolbarProps = {
    selectedCount: number
    selectedIds: (number)[]
    // onDelete: (ids: (number)[]) => void
    resource: ApiBulkDeleteRouteKey
    onClear: () => void
}

export function DataTableBulkActionToolbar({
    selectedCount,
    selectedIds,
    // onDelete,
    onClear,
    resource,
}: BulkActionToolbarProps) {
    const searchParams = useSearchParams()
    const reportId = searchParams.get("reportid") ?? ""
    const queryKey = queryKeys[resource as keyof typeof queryKeys]?.(reportId)
    
    const mutation = useOptimisticMutation({
        queryKey,
        mutationFn: bulksoftDeleteRecords,
        updateCache: (old, payload) =>
            removeRecordsFromCache(
                old,
                payload.ids
            ),

        successMessage: "Records deleted",

        onSuccess: () => {
            onClear()
        },
    })

    function handleBulkDelete(){
        console.log("deleting bulk...")
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
                        <button
                            onClick={() => handleBulkDelete()}
                            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>

                        {/* Clear */}
                        <button
                            onClick={onClear}
                            className="p-2 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

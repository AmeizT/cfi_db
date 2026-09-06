import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

type UseOptimisticMutationProps<TPayload> = {
    queryKey: readonly unknown[]
    mutationFn: (payload: TPayload) => Promise<unknown>
    updateCache: (old: unknown, payload: TPayload) => unknown
    successMessage?: string
    errorMessage?: string
    onSuccess?: (payload: TPayload) => void
    invalidateAll?: boolean
}

export function useOptimisticMutation<TPayload>({
    queryKey,
    mutationFn,
    updateCache,
    successMessage = "Updated successfully",
    errorMessage = "Update failed",
    onSuccess,
    invalidateAll = false,
}: UseOptimisticMutationProps<TPayload>) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn,

        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey })

            const previous = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, (old) =>
                updateCache(old, payload)
            )

            return { previous }
        },

        onError: (_, __, context) => {
            queryClient.setQueryData(queryKey, context?.previous)
            toast.error(errorMessage)
        },

        onSuccess: async (data, payload) => {
            await queryClient.invalidateQueries({ queryKey })
            toast.success(successMessage)
            onSuccess?.(payload)
        },
        onSettled: async () => {
            if (invalidateAll) {
                await queryClient.invalidateQueries()
            } else {
                await queryClient.invalidateQueries({ queryKey })
            }
        },
    })
}

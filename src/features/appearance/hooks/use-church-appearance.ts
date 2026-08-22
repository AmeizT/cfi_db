"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { User } from "@/features/auth/schemas/user"
import { userQueryKeys } from "@/lib/query-keys"
import { applyChurchTheme } from "../lib/apply-church-theme"
import { updateChurchAppearance } from "../services/update-church-appearance"

function withAppearance(user: User | null | undefined, color: string) {
    if (!user) return user
    return {
        ...user,
        assembly: user.assembly ? { ...user.assembly, avatar_fallback: color } : user.assembly,
        assemblies: user.assemblies.map((assembly) =>
            assembly.id === user.church
                ? { ...assembly, avatar_fallback: color }
                : assembly
        ),
    }
}

export function useChurchAppearance() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (color: string) => {
            const user = queryClient.getQueryData<User | null>(userQueryKeys.current)
            const publicId = user?.assembly?.public_id

            if (!publicId) {
                throw new Error("The active church is missing its public_id.")
            }

            return updateChurchAppearance({ publicId, color })
        },
        onMutate: async (color) => {
            await queryClient.cancelQueries({ queryKey: userQueryKeys.current })
            const previousUser = queryClient.getQueryData<User | null>(userQueryKeys.current)
            const previousColor = previousUser?.assembly?.avatar_fallback
            applyChurchTheme(color)
            queryClient.setQueryData<User | null>(userQueryKeys.current, (user) => withAppearance(user, color) ?? null)
            return { previousUser, previousColor }
        },
        onError: (_error, _color, context) => {
            queryClient.setQueryData(userQueryKeys.current, context?.previousUser)
            applyChurchTheme(context?.previousColor)
            toast.error("Could not update church appearance")
        },
        onSuccess: (response) => {
            applyChurchTheme(response.avatar_fallback)
            queryClient.setQueryData<User | null>(userQueryKeys.current, (user) => withAppearance(user, response.avatar_fallback) ?? null)
            toast.success("Church appearance updated")
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: userQueryKeys.current })
        },
    })
}

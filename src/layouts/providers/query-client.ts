import { QueryClient } from "@tanstack/react-query"

import type { User } from "@/features/auth/schemas/user"
import { userQueryKeys } from "@/lib/query-keys"

const SSR_STALE_TIME = 60_000

/** Create a request-local server client or the browser's long-lived client. */
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Hydrated server data must remain stable through the first client render.
                staleTime: SSR_STALE_TIME,
            },
        },
    })
}

export function seedCurrentUser(queryClient: QueryClient, user: User | null) {
    queryClient.setQueryData(userQueryKeys.current, user)
}

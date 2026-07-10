import { useQuery } from "@tanstack/react-query"
import { getHomecellsDirectory } from "../services/get-homecells-directory"
import type { HomecellsListResponse } from "../schemas/homecell"

export function useHomecellsDirectory() {
    return useQuery<HomecellsListResponse>({
        queryKey: ["spaces", "homecells"],
        queryFn: () => getHomecellsDirectory(),
    })
}

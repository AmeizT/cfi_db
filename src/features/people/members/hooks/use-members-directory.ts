import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
    getMembersDirectory,
    type MembersDirectoryParams,
} from "../services/get-members-directory"
import type { MembersListResponse } from "../schemas/member"

export function useMembersDirectory(params: MembersDirectoryParams) {
    return useQuery<MembersListResponse>({
        queryKey: [
            "people",
            "members",
            params.search?.trim() ?? "",
        ],
        queryFn: () => getMembersDirectory(params),
        placeholderData: keepPreviousData,
    })
}

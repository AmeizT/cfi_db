import { useQuery } from "@tanstack/react-query"
import { getTithes, getTrashedTithes } from "../services/get-tithes"

export function useTithes({ trashed = false } = {}) {
    return useQuery({
        queryKey: trashed ? ["trashed_tithes"] : ["tithes"],
        queryFn: trashed ? getTrashedTithes : getTithes,
    })
}

export function useTrashedTithes() {
    return useQuery({
        queryKey: ["trashed_tithes"],
        queryFn: () => getTrashedTithes(),
    })
}
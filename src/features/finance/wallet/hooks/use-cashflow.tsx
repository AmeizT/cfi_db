import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { getCashflow } from "../services/get-cashflow"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

export function useCashflow() {
    const assemblyId = useActiveAssemblyId()
    const now = new Date()
    const searchParams = useSearchParams()

    const fy = searchParams.get("fy")

    const year = fy || String(now.getFullYear())

    const queryParams = `?year=${year}`

    return useQuery({
        queryKey: assemblyQueryKeys.key(assemblyId, "cashflow", year),
        queryFn: () => getCashflow(queryParams),
        enabled: Boolean(assemblyId && year),
    })
}

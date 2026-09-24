import { useUser } from "@/hooks/query/use-user"
import { usesRegionalShell } from "./scope"

export function useRegionalZoneKey() {
    const { data: user } = useUser()
    return usesRegionalShell(user) ? user?.active_regional_zone?.id ?? "no-zone" : "region"
}

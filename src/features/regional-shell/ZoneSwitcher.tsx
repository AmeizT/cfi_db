"use client"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Check, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/hooks/query/use-user"
import { userQueryKeys } from "@/lib/query-keys"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ZoneIdentity } from "@/features/auth/schemas/user"
import { oklchLinearGradient } from "@/layouts/utils/get-oklch-gradient"
import { getTextColor } from "@/layouts/utils/get-text-color"
import { setActiveRegionalZone } from "./actions"
import { zoneSwitchHref } from "./scope"

function ZoneAvatar({ zone }: { zone?: ZoneIdentity | null }) {
    const color = zone?.zone_avatar_fallback || "oklch(0.55 0.08 250)"
    return <Avatar className="size-7 shrink-0"><AvatarImage src={zone?.zone_avatar || undefined} /><AvatarFallback style={{ background: oklchLinearGradient(color), color: getTextColor(color) }}>{zone?.name.charAt(0) || "Z"}</AvatarFallback></Avatar>
}
export function ZoneSwitcher() {
    const { data: user } = useUser()
    const [open, setOpen] = useState(false)
    const [pending, setPending] = useState(false)
    const queryClient = useQueryClient(), router = useRouter(), pathname = usePathname()
    const active = user?.active_regional_zone
    async function select(zone: ZoneIdentity) {
        if (pending) return
        if (zone.id === active?.id) { setOpen(false); return }
        setPending(true)
        try {
            await queryClient.cancelQueries()
            const updated = await setActiveRegionalZone(zone.id)
            queryClient.setQueryData(userQueryKeys.current, updated)
            setOpen(false)
            router.replace(zoneSwitchHref(pathname, window.location.search, zone.region))
            await queryClient.invalidateQueries()
            router.refresh()
        } catch (error) { toast.error(error instanceof Error ? error.message : "Could not switch zones.") }
        finally { setPending(false) }
    }
    return <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild><Button variant="ghost" disabled={pending} aria-label="Switch active zone" aria-busy={pending} className="h-auto min-h-10 w-full min-w-0 justify-start gap-2 px-2 text-sidebar-foreground">
            <ZoneAvatar zone={active} /><span className="min-w-0 flex-1 truncate text-left">{pending ? "Switching zone…" : active?.name || "Select zone"}</span><ChevronDown className="size-4 shrink-0" />
        </Button></PopoverTrigger>
        <PopoverContent align="start" className="w-[min(22rem,calc(100vw-2rem))] p-0"><Command>
            <CommandInput placeholder="Find a zone…" /><CommandList><CommandEmpty>No permitted zones.</CommandEmpty>
                {user?.regional_zones?.map(zone => <CommandItem key={zone.id} value={`${zone.name} ${zone.id}`} disabled={pending} onSelect={() => void select(zone)} className="gap-2"><ZoneAvatar zone={zone} /><span className="min-w-0 flex-1 truncate">{zone.name}</span>{zone.id === active?.id && <Check className="size-4" />}</CommandItem>)}
            </CommandList>
        </Command></PopoverContent>
    </Popover>
}

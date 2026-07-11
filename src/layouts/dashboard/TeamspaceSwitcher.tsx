import React from "react"
import { toast } from "sonner"
import { FormState } from "@/types/form-state"
import { useUser } from "@/hooks/query/use-user"
import { useQueryClient } from "@tanstack/react-query"
import { setActiveTeamspace } from "@/layouts/actions/change-workspace"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { AssemblySummary } from "@/features/auth/schemas/user"

interface TeamspaceSwitchProps {
    teamspace: AssemblySummary
    selectedTeamspaceId: string
    setSelectedTeamspaceId: React.Dispatch<React.SetStateAction<string>>
}

const DEFAULT_AVATAR_COLOR = "oklch(0.55 0.08 250)"

const initialFormState: FormState = {
    success: false,
    status: -1,
    message: ""
}

export function TeamspaceSwitcher({
    teamspace,
    selectedTeamspaceId,
    setSelectedTeamspaceId,
}: TeamspaceSwitchProps) {
    const { data: user } = useUser()
    const queryClient = useQueryClient()

    const [formState, formAction] = React.useActionState(
        setActiveTeamspace,
        initialFormState
    )

    React.useEffect(() => {
        if (formState.status === -1) return

        console.log("formState", formState)

        toast(
            formState.success
                ? "Teamspace changed"
                : "Failed to change teamspace"
        )

        if (formState.success) {
            queryClient.invalidateQueries({ queryKey: ["user"] })
        }
    }, [formState, queryClient])

    async function submitTeamspaceChange(formData: FormData) {
        if (user?.id) {
            formData.append("userId", String(user.id))
        }

        await formAction(formData)
    }

    function onSelectTeamspace(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value === selectedTeamspaceId) return
        setSelectedTeamspaceId(event.target.value)
        event.currentTarget.form?.requestSubmit()
    }
    
    function withLightness(oklch: string, lightness: number, alpha = 1) {
        const match = oklch.match(/oklch\(([^ ]+) ([^ ]+) ([^)]+)\)/)
        if (!match) return oklch
        const [, , c, h] = match
        return `oklch(${lightness} ${c} ${h} / ${alpha})`
    }

    function gradient(base: string) {
        return `linear-gradient(
            ${withLightness(base, 0.80)},
            ${withLightness(base, 0.55)}
        )`
    }

    return (
        <form action={submitTeamspaceChange} className="w-full">
            <label
                htmlFor={`teamspace-${teamspace.id}`}
                className="flex items-center gap-x-2 text-sm capitalize cursor-pointer"
            >
                <input
                    id={`teamspace-${teamspace.id}`}
                    type="radio"
                    name="church"
                    value={teamspace.id}
                    checked={String(teamspace.id) === selectedTeamspaceId}
                    onChange={onSelectTeamspace}
                    className="sr-only"
                />

                <Avatar className="size-7">
                    <AvatarImage src={teamspace.avatar ?? undefined} />
                    <AvatarFallback
                        className="text-sm font-medium text-white uppercase"
                        style={{
                            background: gradient(teamspace.avatar_fallback ?? DEFAULT_AVATAR_COLOR),
                        }}
                    >
                        {teamspace.name?.[0]}
                    </AvatarFallback>
                </Avatar>

                {teamspace.name}
            </label>
        </form>
    )
}

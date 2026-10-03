"use client"

import React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { AssemblyCardDeck } from "./AssemblyCardDeck"

import { useUser } from "@/hooks/query/use-user"
import { refreshAfterAssemblySwitch } from "@/lib/query-keys"
import { setActiveTeamspace } from "@/layouts/actions/change-workspace"

import type { AssemblySummary } from "@/features/auth/schemas/user"
import type { FormState } from "@/types/form-state"

import { AssemblySwitchingOverlay } from "./AssemblySwitchingOverlay"

const initialFormState: FormState = {
    success: false,
    status: -1,
    message: "",
}

export function AssemblySwitcher({ variant = "default" }: { variant?: "default" | "sidebar" }) {
    const [selectedAssemblyId, setSelectedAssemblyId] =
        React.useState<string>("")

    const [switchingAssembly, setSwitchingAssembly] =
        React.useState<AssemblySummary | null>(null)

    const switchingAssemblyRef =
        React.useRef<AssemblySummary | null>(null)

    const switchFormRef = React.useRef<HTMLFormElement>(null)
    const churchInputRef = React.useRef<HTMLInputElement>(null)

    const { data: user, isLoading } = useUser()

    const queryClient = useQueryClient()
    const router = useRouter()

    const [formState, formAction, pending] = React.useActionState(
        setActiveTeamspace,
        initialFormState
    )

    const assemblies = user?.assemblies ?? []

    const currentAssemblyId = selectedAssemblyId || String(user?.church ?? "")
    const activeAssembly = assemblies.find(
        (assembly) => String(assembly.id) === currentAssemblyId
    ) ?? user?.assembly ?? assemblies[0]

    /**
     * Keep switching alive after the card deck closes.
     *
     * The server action updates the active assembly first.
     * We then refresh all assembly-dependent queries and finally
     * refresh Server Components that may read the assembly from
     * the session/cookie.
     */
    React.useEffect(() => {
        if (formState.status === -1) return

        const assembly = switchingAssemblyRef.current

        if (!assembly) return

        let cancelled = false

        async function finishAssemblySwitch() {
            if (!formState.success) {
                if (!cancelled) {
                    switchingAssemblyRef.current = null
                    setSwitchingAssembly(null)

                    // Fall back to the assembly still stored on the user.
                    setSelectedAssemblyId("")

                    toast.error(
                        "We couldn't switch assemblies. Please try again."
                    )
                }

                return
            }

            try {
                await refreshAfterAssemblySwitch(
                    queryClient,
                    assembly?.id as unknown as number | string
                )

                // Some dashboard Server Components read the
                // active assembly from the session/cookie.
                router.refresh()

                if (!cancelled) {
                    toast(
                        `Switched to ${assembly?.name}`
                    )
                }
            } catch {
                if (!cancelled) {
                    toast.warning(
                        `Switched to ${assembly?.name}, but some data couldn't be refreshed.`
                    )
                }
            } finally {
                if (!cancelled) {
                    switchingAssemblyRef.current = null
                    setSwitchingAssembly(null)
                }
            }
        }

        void finishAssemblySwitch()

        return () => {
            cancelled = true
        }
    }, [formState, queryClient, router])

    async function submitTeamspaceChange(formData: FormData) {
        if (user?.id) {
            formData.append("userId", String(user.id))
        }

        try {
            await formAction(formData)
        } catch {
            switchingAssemblyRef.current = null
            setSwitchingAssembly(null)
            setSelectedAssemblyId("")

            toast.error(
                "We couldn't switch assemblies. Please try again."
            )
        }
    }

    function handleAssemblySelect(assembly: AssemblySummary) {
        if (pending) return

        const nextAssemblyId = String(assembly.id)

        /*
         * Selecting the already-active assembly does not need
         * another server request. Just dismiss the chooser.
         */
        if (nextAssemblyId === currentAssemblyId) {
            return
        }

        /*
         * Immediately update the interaction state so the user
         * receives feedback without waiting for the server.
         */
        setSelectedAssemblyId(nextAssemblyId)

        switchingAssemblyRef.current = assembly
        setSwitchingAssembly(assembly)

        /*
         * The form is deliberately mounted outside the card deck,
         * so closing the deck cannot interrupt the action.
         */
        if (churchInputRef.current) {
            churchInputRef.current.value = nextAssemblyId
        }

        switchFormRef.current?.requestSubmit()
    }

    return (
        <>
            <form ref={switchFormRef} action={submitTeamspaceChange} className="hidden">
                <input ref={churchInputRef} type="hidden" name="church" defaultValue="" />
            </form>
            {switchingAssembly && <AssemblySwitchingOverlay assembly={switchingAssembly} />}
            <AssemblyCardDeck
                assemblies={assemblies}
                activeAssembly={activeAssembly}
                loading={isLoading}
                pending={pending || Boolean(switchingAssembly)}
                variant={variant}
                onSelect={handleAssemblySelect}
            />
        </>
    )
}

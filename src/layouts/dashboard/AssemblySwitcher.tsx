"use client"

import React from "react"
import {
    ArrowDown,
    ArrowUp,
    Check,
    ChevronDown,
    CornerDownLeft,
    type LucideIcon,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/animate-ui/components/animate/avatar-group"
import { Button } from "@/components/ui/button"
import { Flex } from "@/components/ui/box"
import { FileSearchIcon } from "@/components/icons/FilesIcon"
import { Skeleton } from "@/components/ui/skeleton"

import { useUser } from "@/hooks/query/use-user"
import { refreshAfterAssemblySwitch } from "@/lib/query-keys"
import { setActiveTeamspace } from "@/layouts/actions/change-workspace"
import { cn } from "@/utils/cn"

import type { AssemblySummary } from "@/features/auth/schemas/user"
import type { FormState } from "@/types/form-state"

import { getTextColor } from "../utils/get-text-color"
import { oklchLinearGradient } from "../utils/get-oklch-gradient"
import { AssemblySwitchingOverlay } from "./AssemblySwitchingOverlay"

const DEFAULT_AVATAR_COLOR = "oklch(0.55 0.08 250)"

const initialFormState: FormState = {
    success: false,
    status: -1,
    message: "",
}

type KbdNavigationItem = {
    label: string
    icon: LucideIcon
}

type KbdNavigationGroup = {
    label: string
    items: KbdNavigationItem[]
}

const kbdNavigation: KbdNavigationGroup[] = [
    {
        label: "Navigate",
        items: [
            {
                label: "Navigate up",
                icon: ArrowUp,
            },
            {
                label: "Navigate down",
                icon: ArrowDown,
            },
        ],
    },
    {
        label: "Select",
        items: [
            {
                label: "Select assembly",
                icon: CornerDownLeft,
            },
        ],
    },
]

export function AssemblySwitcher() {
    const [open, setOpen] = React.useState(false)

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

    const assemblyCount = assemblies.length
    const hasMultipleAssemblies = assemblyCount > 1

    const activeAssembly = user?.assembly

    const currentAssemblyId =
        selectedAssemblyId || String(user?.church ?? "")

    const otherAssemblies = assemblies.filter(
        (assembly) => assembly.id !== activeAssembly?.id
    )

    const visibleAssemblies = activeAssembly
        ? [activeAssembly, ...otherAssemblies.slice(0, 2)]
        : assemblies.slice(0, 3)

    const remainingAssemblies = Math.max(
        assemblyCount - visibleAssemblies.length,
        0
    )

    /**
     * Keep switching alive after the Popover closes.
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
            setOpen(false)
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
         * The chooser has completed its job.
         * Close it before showing the workspace transition.
         */
        setOpen(false)

        /*
         * The form is deliberately mounted outside the Popover,
         * so closing the Popover cannot interrupt the action.
         */
        if (churchInputRef.current) {
            churchInputRef.current.value = nextAssemblyId
        }

        switchFormRef.current?.requestSubmit()
    }

    const triggerContent = isLoading ? (
        <>
            <Skeleton className="size-7 shrink-0 rounded-full" />

            <Skeleton className="hidden h-4 w-20 min-w-0 sm:block sm:w-24" />

            {hasMultipleAssemblies && (
                <Skeleton className="ml-auto hidden size-4 shrink-0 rounded-full sm:block" />
            )}
        </>
    ) : (
        <>
            {/* Mobile: active assembly avatar only */}
            <div className="flex items-center sm:hidden">
                <Avatar className="size-7 shrink-0 rounded-full">
                    <AvatarImage
                        src={activeAssembly?.avatar || undefined}
                    />

                    <AvatarFallback
                        className="font-semibold"
                        style={{
                            background: oklchLinearGradient(
                                activeAssembly?.avatar_fallback ||
                                    "oklch(87.2% 0.007 219.6)"
                            ),
                            color: getTextColor(
                                activeAssembly?.avatar_fallback ||
                                    "oklch(45% 0.017 213.2)"
                            ),
                        }}
                    >
                        {activeAssembly?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Tablet/Desktop */}
            <div className="hidden min-w-0 flex-1 items-center gap-2 overflow-hidden p-1.5 sm:flex">
                {hasMultipleAssemblies ? (
                    <div className="flex gap-1.5">
                        <div className="flex space-x-[-0.6rem]">
                            {visibleAssemblies.map((assembly, index) => {
                                const isActive =
                                    assembly.id ===
                                    activeAssembly?.id

                                return (
                                    <Avatar
                                        key={assembly.id}
                                        className={cn(
                                            "size-7 rounded-full ring-2 ring-(--shell-chrome-hover) group-hover/switcher:ring-offset-(--shell-chrome-active)",
                                            isActive &&
                                                "z-20 ring-2 ring-primary ring-offset-(--shell-chrome-hover) group-hover/switcher:ring-offset-(--shell-chrome-active)"
                                        )}
                                        style={{
                    zIndex: isActive
                        ? 50
                        : visibleAssemblies.length - index,
                }}
                                    >
                                        <AvatarImage
                                            src={
                                                assembly.avatar ||
                                                undefined
                                            }
                                        />

                                        <AvatarFallback
                                            className="font-semibold"
                                            style={{
                                                background:
                                                    oklchLinearGradient(
                                                        assembly.avatar_fallback ||
                                                            "oklch(87.2% 0.007 219.6)"
                                                    ),
                                                color: getTextColor(
                                                    assembly.avatar_fallback ||
                                                        "oklch(45% 0.017 213.2)"
                                                ),
                                            }}
                                        >
                                            {assembly.name?.charAt(0) ||
                                                "A"}
                                        </AvatarFallback>
                                    </Avatar>
                                )
                            })}
                        </div>

                        {remainingAssemblies > 0 && (
                            <Avatar className="h-7 w-fit rounded-full">
                                <AvatarFallback className="bg-transparent text-right! font-semibold">
                                    +{remainingAssemblies}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ) : (
                    <Avatar className="size-7 shrink-0 rounded-full">
                        <AvatarImage
                            src={
                                activeAssembly?.avatar ||
                                undefined
                            }
                        />

                        <AvatarFallback
                            className="font-semibold"
                            style={{
                                background: oklchLinearGradient(
                                    activeAssembly?.avatar_fallback ||
                                        "oklch(87.2% 0.007 219.6)"
                                ),
                                color: getTextColor(
                                    activeAssembly?.avatar_fallback ||
                                        "oklch(45% 0.017 213.2)"
                                ),
                            }}
                        >
                            {activeAssembly?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                )}

                <span className="min-w-0 max-w-28 truncate text-(--shell-chrome-foreground) sm:max-w-32">
                    {activeAssembly?.name}
                </span>
            </div>

            {hasMultipleAssemblies && (
                <ChevronDown
                    strokeWidth={2.5}
                    className="hidden size-4 shrink-0 text-(--shell-chrome-foreground) sm:block"
                />
            )}
        </>
    )

    const triggerClassName = cn(
        "group/switcher flex h-fit min-w-0 w-fit lg:w-full items-center justify-between gap-2 rounded-full has-[>svg]:px-0.5 lg:has-[>svg]:pr-3 py-0.5",
        "border-0 border-(--shell-sidebar-border)",
        "bg-(--shell-chrome-hover)",
        "text-(--shell-chrome-foreground)",
        "hover:bg-(--shell-chrome-active)"
    )

    const trigger = (
        <Button
            type="button"
            aria-label={
                hasMultipleAssemblies
                    ? `Switch assembly. Current assembly: ${
                          activeAssembly?.name ?? "None"
                      }`
                    : `Current assembly: ${
                          activeAssembly?.name ?? "None"
                      }`
            }
            aria-busy={isLoading || pending}
            disabled={isLoading || pending}
            variant="outline"
            className={cn(
                triggerClassName,
                !hasMultipleAssemblies &&
                    "cursor-default"
            )}
        >
            {triggerContent}
        </Button>
    )

    return (
        <>
            {/* 
                This form remains mounted even after the Popover closes.
                It owns the assembly-switch server action.
            */}
            <form
                ref={switchFormRef}
                action={submitTeamspaceChange}
                className="hidden"
            >
                <input
                    ref={churchInputRef}
                    type="hidden"
                    name="church"
                    defaultValue=""
                />
            </form>

            {/* Full workspace transition */}
            {switchingAssembly && (
                <AssemblySwitchingOverlay
                    assembly={switchingAssembly}
                />
            )}

            {hasMultipleAssemblies ? (
                <Popover
                    open={open}
                    onOpenChange={(nextOpen) => {
                        if (pending) return
                        setOpen(nextOpen)
                    }}
                >
                    <PopoverTrigger asChild>
                        {trigger}
                    </PopoverTrigger>

                    <PopoverContent
                        align="start"
                        alignOffset={1.5}
                        sideOffset={4}
                        className="w-[min(25rem,calc(100vw-1rem))] rounded-2xl border-0 border-border-subtle p-0 shadow-elevation-sm"
                    >
                        <Command className="w-full rounded-xl">
                            <CommandInput
                                placeholder="Search for an assembly..."
                                className="h-11 border-border-subtle"
                            />

                            <CommandList className="p-2">
                                <CommandEmpty>
                                    <Flex
                                        direction="column"
                                        align="center"
                                        className="h-full w-full"
                                    >
                                        <FileSearchIcon />
                                        No results found.
                                    </Flex>
                                </CommandEmpty>

                                {isLoading ? (
                                    <>
                                        {[...Array(assemblies.length)].map(
                                            (_, index) => (
                                                <CommandItem
                                                    key={index}
                                                    className="my-0.5 flex h-5 items-center px-2"
                                                >
                                                    <Skeleton className="h-5 w-full rounded-md" />
                                                </CommandItem>
                                            )
                                        )}
                                    </>
                                ) : (
                                    assemblies.map((assembly) => (
                                        <CommandItem
                                            key={assembly.id}
                                            value={`${assembly.name} ${assembly.id}`}
                                            disabled={pending}
                                            onSelect={() =>
                                                handleAssemblySelect(
                                                    assembly
                                                )
                                            }
                                            className="flex h-9 cursor-pointer items-center rounded-lg px-2 hover:bg-mist-200"
                                        >
                                            <AssemblySwitcherItem
                                                assembly={assembly}
                                                selectedAssemblyId={
                                                    currentAssemblyId
                                                }
                                            />
                                        </CommandItem>
                                    ))
                                )}
                            </CommandList>

                            <footer className="flex w-full items-center gap-4 border-t border-border-subtle p-2">
                                {kbdNavigation.map((group) => (
                                    <div
                                        key={group.label}
                                        className="flex items-center gap-1.5"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {group.items.map(
                                                (item) => {
                                                    const Icon =
                                                        item.icon

                                                    return (
                                                        <kbd
                                                            key={
                                                                item.label
                                                            }
                                                            aria-label={
                                                                item.label
                                                            }
                                                            title={
                                                                item.label
                                                            }
                                                            className="flex size-6 items-center justify-center rounded-md bg-white text-foreground shadow-elevation-sm dark:bg-neutral-800"
                                                        >
                                                            <Icon
                                                                strokeWidth={
                                                                    2.2
                                                                }
                                                                className="size-4"
                                                            />
                                                        </kbd>
                                                    )
                                                }
                                            )}
                                        </div>

                                        <span className="text-xs font-medium text-muted-foreground">
                                            {group.label}
                                        </span>
                                    </div>
                                ))}
                            </footer>
                        </Command>
                    </PopoverContent>
                </Popover>
            ) : (
                trigger
            )}
        </>
    )
}

interface AssemblySwitcherItemProps {
    assembly: AssemblySummary
    selectedAssemblyId: string
}

function AssemblySwitcherItem({
    assembly,
    selectedAssemblyId,
}: AssemblySwitcherItemProps) {
    function withLightness(
        oklch: string,
        lightness: number,
        alpha = 1
    ) {
        const match = oklch.match(
            /oklch\(([^ ]+) ([^ ]+) ([^)]+)\)/
        )

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

    const isSelected =
        String(assembly.id) === String(selectedAssemblyId)

    return (
        <div className="flex w-full items-center gap-x-2 text-sm capitalize">
            <Avatar className="size-7">
                <AvatarImage
                    src={assembly.avatar ?? undefined}
                />

                <AvatarFallback
                    className="text-sm font-medium text-white uppercase"
                    style={{
                        background: gradient(
                            assembly.avatar_fallback ??
                                DEFAULT_AVATAR_COLOR
                        ),
                    }}
                >
                    {assembly.name?.[0]}
                </AvatarFallback>
            </Avatar>

            <span className="min-w-0 flex-1 truncate">
                {assembly.name}
            </span>

            {isSelected && (
                <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-(--shell-chrome-hover) text-(--shell-chrome-foreground)">
                    <Check
                        strokeWidth={2.5}
                        className="size-3"
                    />
                </span>
            )}
        </div>
    )
}
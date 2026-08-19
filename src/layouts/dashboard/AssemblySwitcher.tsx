"use client"

import React from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/query/use-user"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn";
import { getTextColor } from "../utils/get-text-color"
import { oklchLinearGradient } from "../utils/get-oklch-gradient"

import { toast } from "sonner"
import { FormState } from "@/types/form-state"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { refreshAfterAssemblySwitch } from "@/lib/query-keys"
import { setActiveTeamspace } from "@/layouts/actions/change-workspace"
import type { AssemblySummary } from "@/features/auth/schemas/user"
import { ArrowDown, ArrowUp, Check, ChevronDown, CornerDownLeft, LucideIcon } from "lucide-react";
import { FileSearchIcon } from "@/components/icons/FilesIcon";
import { Flex } from "@/components/ui/box";
import { AvatarGroup, AvatarGroupTooltip } from "@/components/animate-ui/components/animate/avatar-group";

export function AssemblySwitcher(){
    const [open, setOpen] = React.useState(false)
    const { data: user, isLoading } = useUser()
    const assemblies = user?.assemblies ?? []

    const [selectedAssemblyId, setSelectedAssemblyId] = React.useState<string>("")
    const currentAssemblyId = selectedAssemblyId || String(user?.church ?? "")

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

    const assemblyCount = assemblies.length
const hasMultipleAssemblies = assemblyCount > 1

const activeAssembly = user?.assembly

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

const triggerContent = isLoading ? (
    <>
        <Skeleton className="size-7.5 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-20 min-w-0 sm:w-24" />

        {hasMultipleAssemblies && (
            <Skeleton className="ml-auto size-4 shrink-0 rounded-full" />
        )}
    </>
) : (
    <>
        <div className="p-1 flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            {hasMultipleAssemblies ? (
                <AvatarGroup className="h-fit shrink-0">
                    {visibleAssemblies.map((assembly) => {
                        const isActive =
                            assembly.id === activeAssembly?.id

                        return (
                            <Avatar
                                key={assembly.id}
                                className={cn(
                                    "size-7.5 rounded-full",
                                    isActive &&
                                        "z-20 ring-2 ring-primary ring-offset-[1.5px] ring-offset-(--shell-chrome-hover)"
                                )}
                            >
                                <AvatarImage
                                    src={assembly.avatar || undefined}
                                />

                                <AvatarFallback
                                    className="font-semibold"
                                    style={{
                                        background: oklchLinearGradient(
                                            assembly.avatar_fallback ||
                                                "oklch(87.2% 0.007 219.6)"
                                        ),
                                        color: getTextColor(
                                            assembly.avatar_fallback ||
                                                "oklch(45% 0.017 213.2)"
                                        ),
                                    }}
                                >
                                    {assembly.name?.charAt(0) || "A"}
                                </AvatarFallback>
                            </Avatar>
                        )
                    })}

                    {remainingAssemblies > 0 && (
                        <Avatar className="size-7.5 rounded-full">
                            <AvatarFallback className="font-semibold">
                                +{remainingAssemblies}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </AvatarGroup>
            ) : (
                <Avatar className="size-7.5 shrink-0 rounded-full">
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
            )}

            <span className="min-w-0 max-w-28 truncate text-(--shell-chrome-foreground) sm:max-w-32">
                {activeAssembly?.name}
            </span>
        </div>

        {hasMultipleAssemblies && (
            <ChevronDown
                strokeWidth={2.5}
                className="size-4 shrink-0 text-(--shell-chrome-foreground)"
            />
        )}
    </>
)

const triggerClassName = cn(
    "flex h-fit min-w-0 max-w-60 items-center justify-between gap-2 rounded-full has-[>svg]:px-0.5 has-[>svg]:pr-2 py-0.5",
    "border border-(--shell-sidebar-border)",
    "bg-(--shell-chrome-hover)",
    "text-(--shell-chrome-foreground)",
    "shadow-sm",
    "hover:bg-(--shell-chrome-active)"
)

const trigger = (
    <Button
        type="button"
        aria-label={
            hasMultipleAssemblies
                ? `Switch assembly. Current assembly: ${activeAssembly?.name ?? "None"}`
                : `Current assembly: ${activeAssembly?.name ?? "None"}`
        }
        aria-busy={isLoading}
        disabled={isLoading}
        variant="outline"
        className={cn(
            triggerClassName,
            !hasMultipleAssemblies && "cursor-default"
        )}
    >
        {triggerContent}
    </Button>
)

return (
    <>
        {hasMultipleAssemblies ? (
            <Popover open={open} onOpenChange={setOpen}>
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
                                <>
                                    {assemblies.map((assembly) => (
                                        <CommandItem
                                            key={assembly.id}
                                            className="flex h-9 items-center rounded-lg px-2 hover:bg-mist-200"
                                        >
                                            <AssemblySwitcherItem
                                                assembly={assembly}
                                                selectedAssemblyId={
                                                    currentAssemblyId
                                                }
                                                setSelectedAssemblyId={
                                                    setSelectedAssemblyId
                                                }
                                            />
                                        </CommandItem>
                                    ))}
                                </>
                            )}
                        </CommandList>

                        <footer className="flex w-full items-center gap-4 border-t border-border-subtle p-2">
                            {kbdNavigation.map((group) => (
                                <div
                                    key={group.label}
                                    className="flex items-center gap-1.5"
                                >
                                    <div className="flex items-center gap-1.5">
                                        {group.items.map((item) => {
                                            const Icon = item.icon

                                            return (
                                                <kbd
                                                    key={item.label}
                                                    aria-label={item.label}
                                                    title={item.label}
                                                    className="flex size-6 items-center justify-center rounded-md bg-white text-foreground shadow-elevation-sm dark:bg-neutral-800"
                                                >
                                                    <Icon
                                                        strokeWidth={2.2}
                                                        className="size-4"
                                                    />
                                                </kbd>
                                            )
                                        })}
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
    setSelectedAssemblyId: React.Dispatch<React.SetStateAction<string>>
}

const DEFAULT_AVATAR_COLOR = "oklch(0.55 0.08 250)"

const initialFormState: FormState = {
    success: false,
    status: -1,
    message: ""
}

export function AssemblySwitcherItem({
    assembly,
    selectedAssemblyId,
    setSelectedAssemblyId,
}: AssemblySwitcherItemProps) {
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const router = useRouter()

    const [formState, formAction] = React.useActionState(
        setActiveTeamspace,
        initialFormState
    )

    React.useEffect(() => {
        if (formState.status === -1) return

        toast(
            formState.success
                ? "You're now working in the selected assembly"
                : "We couldn't switch assemblies. Please try again."
        )

        if (formState.success) {
            void refreshAfterAssemblySwitch(queryClient, assembly.id).then(() => {
                // Dashboard routes can contain Server Components that read the
                // active assembly from the session/cookie.
                router.refresh()
            })
        }
    }, [assembly.id, formState, queryClient, router])

    async function submitTeamspaceChange(formData: FormData) {
        if (user?.id) {
            formData.append("userId", String(user.id))
        }

        await formAction(formData)
    }

    function onSelectAssembly(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value === selectedAssemblyId) return
        setSelectedAssemblyId(event.target.value)
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
                htmlFor={`assembly-${assembly.id}`}
                className="flex items-center gap-x-2 text-sm capitalize cursor-pointer"
            >
                <input
                    id={`assembly-${assembly.id}`}
                    type="radio"
                    name="church"
                    value={assembly.id}
                    checked={String(assembly.id) === selectedAssemblyId}
                    onChange={onSelectAssembly}
                    className="sr-only"
                />

                <Avatar className="size-7">
                    <AvatarImage src={assembly.avatar ?? undefined} />
                    <AvatarFallback
                        className="text-sm font-medium text-white uppercase"
                        style={{
                            background: gradient(assembly.avatar_fallback ?? DEFAULT_AVATAR_COLOR),
                        }}
                    >
                        {assembly.name?.[0]}
                    </AvatarFallback>
                </Avatar>

                {assembly.name}

                {String(assembly.id) === selectedAssemblyId && (
                    <span className="ml-auto size-5 flex items-center justify-center rounded-full bg-(--shell-chrome-hover) text-(--shell-chrome-foreground)">
                        <Check strokeWidth={2.5} className="size-3" />
                    </span>
                )}
            </label>
        </form>
    )
}

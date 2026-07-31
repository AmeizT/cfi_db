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
import { oklchLinearGradient, themeVariant } from "../utils/get-oklch-gradient"

import { toast } from "sonner"
import { FormState } from "@/types/form-state"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { refreshAfterAssemblySwitch } from "@/lib/query-keys"
import { setActiveTeamspace } from "@/layouts/actions/change-workspace"
import type { AssemblySummary } from "@/features/auth/schemas/user"
import { ArrowDown, ArrowUp, ChevronDown, CornerDownLeft, LucideIcon } from "lucide-react";
import { FileSearchIcon } from "@/components/icons/FilesIcon";
import { Flex } from "@/components/ui/box";

export function AssemblySwitcher(){
    const [open, setOpen] = React.useState(false)
    const { data: user, isLoading } = useUser()
    const assemblies = user?.assemblies ?? []

    const [selectedAssemblyId, setSelectedAssemblyId] = React.useState<string>("")
    const currentAssemblyId = selectedAssemblyId || String(user?.church ?? "")

    const primaryVariant = themeVariant(user?.assembly?.avatar_fallback || "oklch(87.2% 0.007 219.6)", { lightness: 0.95})

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

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {isLoading ? (
                    <Skeleton className="size-8 rounded-full bg-[var(--shell-chrome-hover)]" />
                ) : (
                    <Button 
                    onClick={() => setOpen(true)} 
                    variant={"outline"} 
                    className={cn("px-1 has-[>svg]:px-1 flex items-center gap-1.5 justify-between rounded-[10px] border border-[var(--shell-sidebar-border)] bg-[var(--shell-chrome-hover)] text-[var(--shell-chrome-foreground)] shadow-sm hover:bg-[var(--shell-chrome-active)]")} 
                    >
                        <div className="w-full flex items-center gap-1.5">
                            <Avatar className="rounded-md size-6">
                                <AvatarImage src={user?.assembly?.avatar || undefined} />
                                <AvatarFallback
                                    className="font-semibold rounded-md"
                                    style={{
                                        background: oklchLinearGradient(user?.assembly?.avatar_fallback || "oklch(87.2% 0.007 219.6)"),
                                        color: getTextColor(user?.assembly?.avatar_fallback || "oklch(45% 0.017 213.2)"),
                                    }}
                                >
                                    {user?.assembly?.name.charAt(0) || "A"}
                                </AvatarFallback>
                            </Avatar>

                            <span className="text-[var(--shell-chrome-foreground)]">
                                {user?.assembly?.name}
                            </span>
                        </div>

                        <span className="pr-1 size-6 flex justify-center items-center">
                            <ChevronDown strokeWidth={2.5} className="text-[var(--shell-chrome-foreground)]" />
                        </span>
                    </Button>
                )}
            </PopoverTrigger>

            <PopoverContent align="start" alignOffset={1.5} sideOffset={4} className="p-0 w-lg rounded-xl border-border-subtle shadow-xs">
                <Command className="w-full rounded-xl">
                    <CommandInput placeholder="Search for an assembly..." className="h-11 border-border-subtle" />
                    <CommandList className="p-2">
                        <CommandEmpty>
                            <Flex direction="column" align="center" className="w-full h-full">
                                <FileSearchIcon />
                                No results found.
                            </Flex>
                        </CommandEmpty>
                        {isLoading ? (
                            <React.Fragment>
                                {[...Array(assemblies.length)].map((_, index) => (
                                    <CommandItem
                                        key={index}
                                        className="px-2 my-0.5 h-5 flex items-center"
                                    >
                                        <Skeleton className="w-full h-5 rounded-md" />
                                    </CommandItem>
                                ))}
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {assemblies?.map((assembly) => (
                                    <CommandItem key={assembly.id} className="px-2 h-9 flex items-center rounded-lg hover:bg-mist-200">
                                        <AssemblySwitcherItem
                                            assembly={assembly}
                                            selectedAssemblyId={currentAssemblyId}
                                            setSelectedAssemblyId={setSelectedAssemblyId}
                                        />
                                    </CommandItem>
                                ))}
                            </React.Fragment>
                        )}
                    </CommandList>

                    <footer className="flex min-h-11 w-full items-center gap-4 border-t border-border-subtle bg-zinc-50 p-1.5 dark:bg-neutral-900">
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
                                                className="flex size-6 items-center justify-center rounded-md bg-white text-foreground shadow-[0_4px_8px_rgba(41,41,41,0.06),0_2px_4px_rgba(41,41,41,0.04),0_1px_2px_rgba(41,41,41,0.04),0_0_0_1px_rgba(41,41,41,0.08),inset_0_-0.5px_0.5px_rgba(41,41,41,0.08)] dark:bg-neutral-800"
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
            </label>
        </form>
    )
}

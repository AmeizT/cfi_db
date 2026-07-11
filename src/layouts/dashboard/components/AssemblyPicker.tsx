"use client"

import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useUser } from "@/hooks/query/use-user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarButtonSkeleton } from "./AvatarButtonSkeleton"
import React from "react"

export default function DropdownWorkspaceSelector() {
    const [open, setOpen] = useState(false)
    const { data: user, isLoading } = useUser()

    const workspaces = user?.assemblies || []
    const selectedWorkspace = workspaces?.find(workspace => Number(workspace?.id) === user?.church)
    const hasManyWorkspaces = Boolean((workspaces?.length ?? 0) > 1)
    const selectedWorkspaceLabel = selectedWorkspace?.country ?? selectedWorkspace?.country_code ?? ""

    return (
        <div className="w-full">
            {hasManyWorkspaces ? (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        {/* <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-auto rounded-xl">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage
                                        src={selectedWorkspace?.avatar}
                                        alt={`@${selectedWorkspace?.name}`}
                                    />
                                    <AvatarFallback
                                        className="text-white"
                                        style={{ backgroundColor: selectedWorkspace?.avatar_fallback }}
                                    >
                                        {selectedWorkspace?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col items-start">
                                    <span className="font-medium">{selectedWorkspace?.name}</span>
                                    <span className="text-xs text-muted-foreground">{selectedWorkspace?.country} Plan</span>
                                </div>
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button> */}

                        {isLoading ? (
                            <AvatarButtonSkeleton />
                        ) : (
                            <button aria-expanded={open} className="w-full flex items-center gap-2 bg-gradient-to-b hover:from-white hover:to-zinc-50 border border-transparent hover:border-zinc-200/70 p-2 rounded-lg transition-colors duration-200">
                                <div>
                                    <Avatar className="size-8">
                                        <AvatarImage src={selectedWorkspace?.avatar ?? undefined} alt={`@${selectedWorkspace?.name}`} />
                                        <AvatarFallback className="text-white text-sm font-medium" style={{ backgroundColor: selectedWorkspace?.avatar_fallback ?? undefined }}>
                                            {selectedWorkspace?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="flex flex-col items-start">
                                    <small className="text-sm leading-tight font-medium">
                                        {selectedWorkspace?.name}
                                    </small>

                                    <small className="inline-flex items-center gap-1 text-xs text-body-muted leading-tight">
                                        {selectedWorkspaceLabel}
                                    </small>
                                </div>
                            </button>
                        )}
                        
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search workspaces..." />
                            <CommandList>
                                <CommandEmpty>No workspace found.</CommandEmpty>

                                {workspaces?.length > 0 && (
                                    <CommandGroup heading="Personal">
                                        {workspaces?.map((workspace) => (
                                            <CommandItem
                                                key={workspace.id}
                                                // onSelect={() => {
                                                //     setSelectedWorkspace(workspace)
                                                //     setOpen(false)
                                                // }}
                                                className="flex items-center gap-3 p-3"
                                            >
                                                <div
                                                    className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                                                        workspace.avatar_fallback ?? undefined,
                                                    )}
                                                >

                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{workspace.name}</div>
                                                    <div className="text-xs text-muted-foreground">{workspace.country ?? workspace.country_code ?? ""} Plan</div>
                                                </div>
                                                <Check
                                                    className={cn("h-4 w-4", selectedWorkspace?.id === workspace.id ? "opacity-100" : "opacity-0")}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            ) : (
                <React.Fragment>
                    {isLoading ? (
                        <AvatarButtonSkeleton />
                    ) : (
                        <button aria-expanded={false} className="w-full flex items-center gap-2 bg-gradient-to-b hover:from-white hover:to-zinc-50 border border-transparent hover:border-zinc-200/70 p-2 rounded-lg transition-colors duration-200">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage
                                        src={selectedWorkspace?.avatar ?? undefined}
                                        alt={`@${selectedWorkspace?.name}`}
                                    />
                                    <AvatarFallback
                                        className="text-white"
                                        style={{ backgroundColor: selectedWorkspace?.avatar_fallback ?? undefined }}
                                    >
                                        {selectedWorkspace?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col items-start">
                                    <span className="font-medium">{selectedWorkspace?.name}</span>
                                    <span className="text-xs text-muted-foreground">{selectedWorkspaceLabel} Plan</span>
                                </div>
                            </div>
                        </button>
                    )}
                </React.Fragment>
            )}
            
        </div>
    )
}

"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useUser } from "@/hooks/query/use-user"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { WorkspaceSwitchForm } from "./WorkspaceSwitchForm"

export function WorkspaceSwitcher() {
    const { data: user } = useUser()
    const workspaces = user?.assemblies || []    
    const [selectedWorkspace, setSelectedWorkspace] = React.useState<string>("")
    const workspacesMap = workspaces?.map(assembly => assembly.country)
    const groupedWorkspaces = [...new Set(workspacesMap)]

    React.useEffect(() => {
        setSelectedWorkspace(String(user?.church))
    }, [user?.church])

    const currentWorkspace = workspaces?.find(workspace => workspace?.id === Number(selectedWorkspace))

    return (
        <Command className="rounded-t-3xl w-full overflow-y-hidden ">
            <div className="p-4 [&>[data-slot=command-input-wrapper]]:h-fit [&>[data-slot=command-input-wrapper]]:bg-gray-100 dark:[&>[data-slot=command-input-wrapper]]:bg-neutral-700 [&>[data-slot=command-input-wrapper]]:border-0 [&>[data-slot=command-input-wrapper]]:rounded-xl">
                <CommandInput className="h-11 lg:h-10 text-base md:text-sm" placeholder="Search workspaces..." />
            </div>
                    
            <ScrollArea className="h-full">
                <CommandList className="px-4 max-h-full overflow-y-auto">
                    <CommandEmpty>No workspace found.</CommandEmpty>

                    {groupedWorkspaces?.length > 0 && (
                        <React.Fragment>
                            {groupedWorkspaces?.sort()?.map((workspace) => (
                                <CommandGroup key={workspace} heading={workspace} className="px-0">
                                    {user?.assemblies?.filter((assembly) => assembly?.country?.toLowerCase() === workspace?.toLowerCase())
                                        .map((assembly) => (
                                            <CommandItem key={assembly?.id} className="px-0 flex items-center gap-3">
                                                <WorkspaceSwitchForm
                                                    workspace={assembly}
                                                    setSelectedWorkspace={setSelectedWorkspace}
                                                />

                                                <Check
                                                    className={cn("size-4", currentWorkspace?.id === assembly?.id ? "opacity-100" : "opacity-0")}
                                                />
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            ))}
                        </React.Fragment>
                    )}
                </CommandList>
            </ScrollArea>
        </Command>
    )
}

{/* <Popover>
    <PopoverTrigger asChild>
        <ProfileButton
            displayName={currentWorkspace?.name || ""}
            avatarColor={currentWorkspace?.avatar_fallback}
            avatarSrc={currentWorkspace?.avatar || undefined}
            isLoading={isLoading}
            subLabel={currentWorkspace?.country}
            role="combobox"
            aria-expanded={false}
            buttonType="workspace"
        />
    </PopoverTrigger>

    <PopoverContent className="w-[240px] p-0 rounded-xl" align="start">
        <Command className="rounded-xl w-full overflow-y-hidden">
            <CommandInput placeholder="Search workspaces..." />

            <ScrollArea className="h-full">
                <CommandList className="overflow-y-auto">
                    <CommandEmpty>No workspace found.</CommandEmpty>

                    {groupedWorkspaces?.length > 0 && (
                        <React.Fragment>
                            {groupedWorkspaces?.sort()?.map((workspace) => (
                                <CommandGroup key={workspace} heading={workspace}>
                                    {user?.assemblies?.filter((assembly) => assembly?.country?.toLowerCase() === workspace?.toLowerCase())
                                        .map((assembly) => (
                                            <CommandItem key={assembly?.id} className="flex items-center gap-3">
                                                <WorkspaceSwitchForm
                                                    workspace={assembly}
                                                    setSelectedWorkspace={setSelectedWorkspace}
                                                />

                                                <Check
                                                    className={cn("size-4", currentWorkspace?.id === assembly?.id ? "opacity-100" : "opacity-0")}
                                                />
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            ))}
                        </React.Fragment>
                    )}
                </CommandList>
            </ScrollArea>
        </Command>
    </PopoverContent>
</Popover> */}



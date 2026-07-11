import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { useUser } from "@/hooks/query/use-user"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TeamspaceSwitcher } from "./TeamspaceSwitcher"
import { IconChevronRight, IconPlus } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ExpandableListProps<T> {
    items: T[]
    collapsedCount?: number
    renderItem: (item: T, index: number) => React.ReactNode
    className?: string
    isExpanded?: boolean
    onToggle?: () => void
}

export function ExpandableList<T>({
    items,
    collapsedCount = 4,
    renderItem,
    className,
    isExpanded: isExpandedProp,
}: ExpandableListProps<T>) {
    // const hasMore = items.length > collapsedCount
    const isExpanded = isExpandedProp ?? false

    const visibleItems = isExpanded
        ? items
        : items.slice(0, collapsedCount)

    return (
        <div className={className}>
            <AnimatePresence initial={false}>
                <motion.ul
                    key={isExpanded ? "expanded" : "collapsed"}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    {visibleItems.map(renderItem)}
                </motion.ul>
            </AnimatePresence>
        </div>
    )
}

export function Teamspaces() {
    const { data: user, isLoading } = useUser()
    const teamspaces = user?.assemblies ?? []
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)

    const [selectedTeamspaceId, setSelectedTeamspaceId] = React.useState<string>("")
    const currentTeamspaceId = selectedTeamspaceId || String(user?.church ?? "")

    const activeTeamspace = teamspaces?.find(teamspace => teamspace?.id === Number(currentTeamspaceId))

    return (
        <SidebarGroup className="px-0">
            <SidebarGroupLabel
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="hidden _flex items-center gap-6 justify-between hover:bg-gray-100"
            >
                <span>Teamspaces</span>

                <div className="flex items-center gap-0.5 min-w-0">
                    <span
                        className={`hidden px-1.5 max-w-full truncate py-[1.5px] rounded-lg text-xs text-gray-400 hover:text-gray-500 bg-white border border-gray-200 transition-all duration-150 ease-out ${
                            isHovered ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-0.5 pointer-events-none"
                        }`}
                    >
                        {activeTeamspace?.name || "Select Teamspace"}
                    </span>

                    {user?.is_db_staff && (
                        <button
                            className={`p-px flex self-center rounded-[5px] text-xs text-gray-400 border border-transparent [&>svg]:size-4 transition-all duration-150 ease-out hover:text-gray-500 hover:bg-white hover:border-gray-200 ${
                                isHovered
                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                    : "opacity-0 translate-y-0.5 pointer-events-none"
                            }`}
                        >
                            <IconPlus strokeWidth={2.25} stroke={2.25} />
                        </button>
                    )}

                    {teamspaces.length > 4 && (
                        <button
                            title={isExpanded ? "Show less" : `+${teamspaces.length - 4} more`}
                            onClick={() => setIsExpanded(prev => !prev)}
                            className="p-px flex self-center rounded-[5px] text-xs text-gray-400 hover:text-gray-500 hover:bg-white border border-transparent hover:border-gray-200 [&>svg]:size-4">
                            
                            <IconChevronRight strokeWidth={2.25} className={`${isExpanded ? "rotate-90" : ""} transition-transform duration-150 ease-in-out`} />
                        </button>
                    )}
                </div>
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {isLoading ? (
                        <React.Fragment>
                            {[...Array(teamspaces.length)].map((_, index) => (
                                <SidebarMenuItem
                                    key={index}
                                    className="px-2 my-0.5 h-5 flex items-center"
                                >
                                    <Skeleton className="w-full h-5 rounded-md" />
                                </SidebarMenuItem>
                            ))}
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {teamspaces?.map((teamspace) => (
                                <SidebarMenuItem key={teamspace.id} className="px-2 h-9 flex items-center rounded-lg hover:bg-mist-200">
                                    <TeamspaceSwitcher
                                        teamspace={teamspace}
                                        selectedTeamspaceId={currentTeamspaceId}
                                        setSelectedTeamspaceId={setSelectedTeamspaceId}
                                    />
                                </SidebarMenuItem>
                            ))}
                        </React.Fragment>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

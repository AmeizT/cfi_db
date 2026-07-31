import { cn } from "@/lib/utils"
import { RailNavigation } from "../navigation/types"
import {
    Building2Icon,
    PackageIcon,
    UserRoundIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/query/use-user"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileDropdown } from "./ProfileDropdown"
import { Flex } from "@/components/ui/box"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavIcon } from "./AppNavIcon";
import { NavigationIcon } from "../navigation/types"

interface NavRailProps {
    menu: RailNavigation
    handleAssembliesClick?: () => void
}

interface RailItemProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    icon: NavigationIcon
    label: string
    isActive?: boolean
}

function RailItem({
    icon,
    label,
    isActive,
    href = "#", // add href prop
    className,
    ...props
}: RailItemProps & { href?: string }) {
    return (
        <li>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={href}
                        aria-label={label}
                        aria-current={isActive ? "page" : undefined}
                        data-active={isActive}
                        className={cn(railItemClasses, className)}
                        {...props}
                    >
                        <NavIcon
                            icon={icon}
                            className={cn(
                                "size-6",
                            )}
                        />
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </li>
    )
}

function RailCreateMenu({
    icon,
    label,
    isActive,
}: {
    icon: NavigationIcon
    label: string
    isActive?: boolean
}) {
    const items = [
        {
            label: "Assembly",
            href: "/administration/assemblies",
            icon: Building2Icon,
        },
        {
            label: "Member",
            href: "/app/people/members",
            icon: UserRoundIcon,
        },
        {
            label: "Asset",
            href: "/app/finance/assets",
            icon: PackageIcon,
        },
    ]

    return (
        <li>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                aria-label={label}
                                aria-current={isActive ? "page" : undefined}
                                data-active={isActive}
                                variant="ghost"
                                size="icon"
                                className={cn(railItemClasses, "border-none shadow-none")}
                            >
                                <NavIcon
                                    icon={icon}
                                    className="size-6.5"
                                    strokeWidth={1.75}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        <p>{label}</p>
                    </TooltipContent>
                </Tooltip>

                <DropdownMenuContent side="right" align="end" className="w-52">
                    <DropdownMenuLabel>Create</DropdownMenuLabel>
                    {items.map((item) => (
                        <DropdownMenuItem key={item.label} asChild>
                            <Link href={item.href}>
                                <item.icon className="size-5" />
                                {item.label}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    )
}

const railItemClasses = cn(
    "size-9.5 flex items-center justify-center", 
    "rounded-[0.6275rem]",
    // "supports-[corner-shape:squircle]:squircle-24", 
    "text-[var(--shell-chrome-foreground)] hover:bg-[var(--shell-chrome-hover)] hover:text-[var(--shell-chrome-foreground)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--shell-focus-ring)]",
    "data-[active=true]:bg-[var(--shell-chrome-active)] data-[active=true]:text-[var(--shell-chrome-foreground)] data-[active=true]:font-semibold",
)

export function AppNavRail({ menu }: NavRailProps){
    const pathname = usePathname()
    const { isLoading } = useUser()

    return (
        <Flex direction={"column"} justify={"between"} className="py-0 pr-1.5 w-fit h-full rounded-lg">
            <ul className="w-full flex flex-col items-center gap-1">
                {menu.top.map((item) => {
                    const firstSegment = pathname.split("/").filter(Boolean)[0]
                    const itemFirstSegment = String(item.href)
                        .split("?")[0]
                        .split("/")
                        .filter(Boolean)[0]

                    const isCreateMenu = item.label === "Forms"
                    const isActive = isCreateMenu
                        ? firstSegment === "forms"
                        : firstSegment === itemFirstSegment

                    if (isCreateMenu) {
                        return (
                            <RailCreateMenu
                                key={item.label}
                                icon={item.icon}
                                label={item.label}
                                isActive={isActive}
                            />
                        )
                    }
                    
                    return (
                        <RailItem 
                            key={item.label} 
                            icon={item.icon} 
                            label={item.label} 
                            href={item.href}
                            isActive={isActive}
                        />
                    )
                })}
            </ul>

            <ul className="w-full flex flex-col items-center gap-0.5">
                {/* {menu.bottom.map((item) => {
                    return (
                        <RailItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                        />
                    )
                })} */}

                <li>
                    {isLoading ? (
                        <Skeleton className="size-8 rounded-full bg-mist-300" />
                    ) : (
                        <ProfileDropdown />
                    )}
                </li>
            </ul>
        </Flex>
    )
}

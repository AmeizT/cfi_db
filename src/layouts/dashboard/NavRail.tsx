import { cn } from "@/lib/utils"
import { RailNavigation } from "../navigation/types"
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/query/use-user"
import { oklchLinearGradient } from "../utils/get-oklch-gradient"
import { getTextColor } from "../utils/get-text-color"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileDropdown } from "./ProfileDropdown"
import { cva } from "class-variance-authority"
import { Flex } from "@/components/ui/box"
import { Button } from "@/components/ui/button"

interface NavRailProps {
    menu: RailNavigation
    handleAssembliesClick?: () => void
}

interface RailItemProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    icon: IconSvgElement
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
                        <HugeiconsIcon
                            icon={icon}
                            className="size-6.5"
                            strokeWidth={1.75}
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

const railItemClasses = cn(
    "size-11 flex items-center justify-center rounded-[10px] text-sidebar-icon transition-colors hover:bg-user-theme/5 hover:text-icon-active",
    "data-[active=true]:bg-linear-to-b data-[active=true]:from-[#ffffff20] data-[active=true]:to-[#ffffff30] dark:data-[active=true]:from-taupe-800 dark:data-[active=true]:to-taupe-900 dark:data-[active=true]:border-[1.25px] dark:data-[active=true]:border-taupe-800 data-[active=true]:text-icon-active",
)

const sidebarIconButton = cva(
    "size-11 flex items-center justify-center rounded-[10px] transition-colors",
    {
        variants: {
            active: {
                true: "bg-surface-subtle text-icon-active",
                false: "text-sidebar-icon hover:bg-mist-100 dark:hover:bg-taupe-900 hover:text-icon-active"
            }
        }
    }
)

export function NavRail({ menu, handleAssembliesClick }: NavRailProps){
    const pathname = usePathname()
    const { data: user, isLoading } = useUser()

    return (
        <Flex direction={"column"} justify={"between"} className="px-2 py-2 h-full bg-user-theme">
            <ul className="w-full flex flex-col items-center gap-1">
                <li>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {isLoading ? (
                                <Skeleton className="size-8 rounded-full bg-mist-300" />
                            ) : (
                                <Button variant={"outline"} onClick={handleAssembliesClick} className={cn(
                                    "border-none shadow-none bg-none",
                                    sidebarIconButton()
                                )}>
                                        <Avatar className="rounded-[36%]">
                                            <AvatarImage src={user?.assembly?.avatar || undefined} />
                                            <AvatarFallback
                                                className="font-semibold rounded-[36%]"
                                                style={{
                                                    background: oklchLinearGradient(user?.assembly?.avatar_fallback || "oklch(87.2% 0.007 219.6)"),
                                                    color: getTextColor(user?.assembly?.avatar_fallback || "oklch(45% 0.017 213.2)"),
                                                }}
                                            >
                                                {user?.assembly?.name.charAt(0) || "A"}
                                            </AvatarFallback>
                                        </Avatar>
                                </Button>
                            )}
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center">
                            <p>{user?.assembly?.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </li>

                {menu.top.map((item) => {
                    const firstSegment = pathname.split("/").filter(Boolean)[0]
                    const itemFirstSegment = String(item.href)
                        .split("?")[0]
                        .split("/")
                        .filter(Boolean)[0]

                    const isActive = firstSegment === itemFirstSegment
                    
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
                {menu.bottom.map((item) => {
                    return (
                        <RailItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                        />
                    )
                })}

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
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { NavigationIcon } from "../navigation/types"
import { cn } from "@/utils/cn";

interface NavIconProps {
    icon: NavigationIcon
    size?: number
    strokeWidth?: number
    className?: string
}

function isHugeIcon(icon: NavigationIcon): icon is IconSvgElement {
    return Array.isArray(icon)
}

export function NavIcon({
    icon,
    size = 24,
    strokeWidth,
    className,
}: NavIconProps) {
    if (isHugeIcon(icon)) {
        return (
            <HugeiconsIcon
                icon={icon}
                size={size}
                strokeWidth={strokeWidth}
                className={className}
                aria-hidden="true"
            />
        )
    }

    const CustomIcon = icon

    return (
        <CustomIcon
            width={size}
            height={size}
            strokeWidth={strokeWidth}
            className={cn("text-current", className)}
            aria-hidden="true"
        />
    )
}

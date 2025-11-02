import React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon } from "@hugeicons/core-free-icons"

interface ProfileButtonProps extends React.AllHTMLAttributes<HTMLDivElement> {
    avatarSrc?: string
    avatarColor?: string
    displayName: string
    isLoading?: boolean
    label?: string
}

function ProfileButtonSkeleton() {
    return (
        <div className="p-0 flex items-center gap-3">
            <Skeleton className="size-8 rounded-xl" />
            {/* <Skeleton className="w-px h-5 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-full" /> */}
        </div>
    )
}

export function ProfileButton({
    avatarSrc,
    avatarColor,
    displayName,
    label,
    // buttonType = "profile",
    isLoading = false,
    ...props
}: ProfileButtonProps) {
    return isLoading ? (
        <ProfileButtonSkeleton />
    ) : (
        <div className={cn("group/profile w-fit lg:w-full flex justify-between items-center gap-2 p-0 rounded-xl transition-colors duration-200 cursor-default bg-red-500", props.className)} {...props}>
            <div className="flex items-center gap-x-3">
                <Avatar className="size-8 lg:size-8 rounded-full">
                    <AvatarImage draggable={false} src={avatarSrc} alt={displayName} className="object-cover" />
                    <AvatarFallback className="size-8 uppercase text-white text-lg font-medium rounded-xl" style={{ backgroundColor: avatarColor }}>
                        {displayName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className="w-full flex justify-between items-center">
                    <div className="hidden lg:flex flex-col items-start">
                        <h5 className="text-sm font-semibold leading-tight">
                            {displayName}
                        </h5>

                        {label && <small className="text-muted-foreground leading-tight">{label}</small>}
                    </div>

                    <HugeiconsIcon icon={ArrowDown01Icon} />
                </div>
            </div>
        </div>
    )
}
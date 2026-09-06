"use client"

import { UsersRound } from "lucide-react"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type MemberAvatar = {
    src: string
    alt?: string
    className: string
    faded?: boolean
}

interface MembersEmptyStateProps {
    onAddMember?: () => void
    className?: string
    avatars?: string[]
}

const avatarPositions = [
    // outer / upper-left
    {
        className:
            "left-[9%] top-[29%] size-11 sm:left-[12%] sm:top-[25%] sm:size-13",
        faded: true,
    },

    // upper-left
    {
        className:
            "left-[24%] top-[10%] size-11 sm:left-[27%] sm:size-13",
    },

    // upper-middle
    {
        className:
            "left-[43%] top-[9%] size-13 sm:size-15",
    },

    // upper-right
    {
        className:
            "right-[23%] top-[16%] size-13 sm:size-15",
    },

    // far upper-right
    {
        className:
            "right-[8%] top-[6%] size-10 sm:right-[10%] sm:size-11",
        faded: true,
    },

    // middle-right
    {
        className:
            "right-[12%] top-[31%] size-11 sm:right-[14%] sm:size-13",
        faded: true,
    },

    // lower-left
    {
        className:
            "left-[24%] top-[47%] size-11 sm:left-[27%] sm:size-13",
    },

    // lower-right
    {
        className:
            "right-[17%] top-[52%] size-11 sm:right-[19%] sm:size-13",
        faded: true,
    },
]

export function MembersEmptyState({
    onAddMember,
    className,
    avatars = [],
}: MembersEmptyStateProps) {
    const people: MemberAvatar[] = avatarPositions.map((position, index) => ({
        src: avatars[index] ?? "",
        alt: "Member",
        ...position,
    }))

    return (
        <div
            className={cn(
                "flex min-h-125 w-full flex-col items-center justify-start overflow-hidden",
                className
            )}
        >
            <div className="relative flex h-100 w-full max-w-165 shrink-0 justify-center">
                {/* Concentric community rings */}
                <div
                    className="pointer-events-none absolute left-1/2 -top-20 h-122.5 w-122.5 -translate-x-1/2 sm:h-140 sm:w-140"
                    style={{
                        maskImage:
                            "linear-gradient(to bottom, black 0%, black 56%, rgba(0,0,0,.75) 70%, transparent 96%)",
                        WebkitMaskImage:
                            "linear-gradient(to bottom, black 0%, black 56%, rgba(0,0,0,.75) 70%, transparent 96%)",
                    }}
                >
                    <CommunityRing className="inset-[0%]" />
                    <CommunityRing className="inset-[9%]" />
                    <CommunityRing className="inset-[18%] dark:border-neutral-700" />
                    <CommunityRing className="inset-[27%] dark:border-neutral-700" />
                    <CommunityRing className="inset-[36%] flex items-center justify-center dark:border-neutral-700">
                        <div className="flex size-18 items-center justify-center rounded-3xl border border-border-subtle dark:border-neutral-700 sm:size-20">
                            <UsersRound
                                className="size-8 text-foreground sm:size-9"
                                strokeWidth={1.8}
                            />
                        </div>
                    </CommunityRing>
                </div>

                {/* Member portraits */}
                {people.map((person, index) => {
                    if (!person.src) return null

                    return (
                        <div
                            key={index}
                            className={cn(
                                "absolute z-10 overflow-hidden rounded-full border border-border-subtle bg-background p-0.5 shadow-sm",
                                person.faded && "opacity-50",
                                person.className
                            )}
                        >
                            <Image
                                width={60}
                                height={60}
                                src={person.src}
                                alt={person.alt ?? "Member"}
                                className="rounded-full object-cover"
                            />
                        </div>
                    )
                })}
            </div>

            {/* Copy */}
            <div className="relative z-30 -mt-8 flex max-w-xl flex-col items-center px-6 text-center">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    No members yet
                </h2>

                <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                    Add your first member to start building your assembly
                    directory.
                </p>

                <Button
                    size="lg"
                    className="mt-7 min-w-36"
                    onClick={onAddMember}
                >
                    Add member
                </Button>
            </div>
        </div>
    )
}

function CommunityRing({ className, children }: { className?: string; children?: React.ReactNode }) {
    return (
        <div
            className={cn(
                "absolute rounded-full border border-border-subtle dark:border-neutral-800",
                className
            )}
        >
            {children}
        </div>
    )
}

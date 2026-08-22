import Image from "next/image"

import { cn } from "@/lib/utils"

interface JethroLogoProps {
    className?: string
}

export function JethroLogo({
    className,
}: JethroLogoProps) {
    return (
        <span
            className={cn(
                "relative flex items-center justify-center",
                className
            )}
        >
            <Image
                src="/brand/jethro/jethro-primary.svg"
                alt="Jethro AI"
                width={40}
                height={40}
                sizes="48px"
                className="object-contain"
                priority
            />
        </span>
    )
}
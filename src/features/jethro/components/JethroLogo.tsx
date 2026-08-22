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
                src="/icons/easy-bloom.png"
                alt="Jethro AI"
                fill
                sizes="48px"
                className="object-contain"
                priority
            />
        </span>
    )
}
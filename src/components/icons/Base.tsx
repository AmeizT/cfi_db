import * as React from "react"
import { cn } from "@/lib/utils"

type SvgProps = React.SVGProps<SVGSVGElement> & {
    size?: number | string
}

export function Svg({
    className,
    size = 24,
    style,
    ...props
}: SvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            className={cn("inline-block shrink-0", className)}
            role="img"
            style={{
                color: "var(--color-indigo-600)",
                ["--chart-primary" as string]: "var(--color-indigo-600)",
                ["--chart-secondary" as string]: "var(--color-indigo-400)",
                ["--chart-accent" as string]: "var(--color-accent)",
                ...style,
            }}
            {...props}
        />
    )
}
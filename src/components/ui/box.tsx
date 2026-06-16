import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

const flexVariants = cva(
    "flex",
    {
        variants: {
            direction: {
                row: "flex-row",
                column: "flex-col",
            },
            justify: {
                start: "justify-start",
                center: "justify-center",
                between: "justify-between",
                end: "justify-end",
            },
            align: {
                start: "items-start",
                center: "items-center",
                end: "items-end",
                stretch: "items-stretch",
            },
            wrap: {
                wrap: "flex-wrap",
                nowrap: "flex-nowrap",
            },
            gap: {
                0.5: "gap-0.5",
                0.75: "gap-0.75",
                1: "gap-1",
                2: "gap-2",
                3: "gap-3",
                4: "gap-4",
                5: "gap-5",
                6: "gap-6",
            },
        },
        defaultVariants: {
            justify: "center",
            align: "center",
            direction: "row",
            wrap: "nowrap",
        },
    }
)

function Flex({
    className,
    justify,
    align,
    direction,
    wrap,
    gap,
    asChild = false,
    ...props
}: React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof flexVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot : "div"

    return (
        <Comp
            data-slot="flexbox"
            className={cn(flexVariants({ justify, align, direction, wrap, gap, className }))}
            {...props}
        />
    )
}

export { Flex, flexVariants }
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tableVariants = cva(
    "relative w-full overflow-auto rounded-md border border-border",
    {
        variants: {
            variant: {
                default: "",
                striped: "[&_[data-row]:nth-child(even)]:bg-muted/40",
                zebra: "[&_[data-row]:nth-child(odd)]:bg-muted/40",
            },
            density: {
                default: "",
                compact: "[&_[data-row]]:h-7 [&_[data-cell]]:text-xs",
                comfortable: "[&_[data-row]]:h-10",
            },
        },
        defaultVariants: {
            variant: "default",
            density: "default",
        },
    }
)

type TableProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof tableVariants>

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
    ({ className, variant, density, ...props }, ref) => (
        <div
            ref={ref} // expose ref for virtualization
            role="table"
            className={cn(tableVariants({ variant, density }), className)}
            {...props}
        />
    )
)

Table.displayName = "Table" // fix the lint warning

export function TableHead(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            role="rowgroup"
            className="border-b border-border bg-muted/40"
            {...props}
        />
    )
}

export function TableBody(props: React.HTMLAttributes<HTMLDivElement>) {
    return <div role="rowgroup" {...props} />
}

type RowProps = React.HTMLAttributes<HTMLDivElement> & {
    columns: number
}

export function Row({ columns, className, ...props }: RowProps) {
    const [selected, setSelected] = React.useState(false)

    return (
        <div
            {...props}
            role="row"
            data-row
            onClick={() => setSelected(!selected)}
            className={cn(
                "grid items-stretch border-b border-border",
                "min-h-8",
                "hover:bg-muted/30 cursor-pointer",
                selected && "bg-accent",
                className
            )}
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(140px, 1fr))`,
            }}
        />
    )
}

type CellProps = React.HTMLAttributes<HTMLDivElement>

export const Cell = React.forwardRef<HTMLDivElement, CellProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                role="cell"
                data-cell
                ref={ref} // forward the ref here
                className={cn(
                    "flex items-center px-3",
                    "border-r border-border last:border-r-0",
                    "h-full min-h-8",
                    "whitespace-nowrap overflow-hidden",
                    "focus-within:ring-[1.5px] focus-within:ring-mist-400 focus-within:bg-white focus-within:rounded-sm focus-within:shadow-lg",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Cell.displayName = "Cell"

export function CustomTable(){
    return (
        <Table variant="striped">

            <TableHead>
                <Row columns={4}>
                    <Cell>Week</Cell>
                    <Cell>Adults</Cell>
                    <Cell>Children</Cell>
                    <Cell>Guests</Cell>
                </Row>
            </TableHead>

            <TableBody>

                <Row columns={4}>
                    <Cell>Week 1</Cell>
                    <Cell>30</Cell>
                    <Cell>10</Cell>
                    <Cell>5</Cell>
                </Row>

                <Row columns={4}>
                    <Cell>Week 2</Cell>
                    <Cell>28</Cell>
                    <Cell>9</Cell>
                    <Cell>6</Cell>
                </Row>

            </TableBody>

        </Table>
    )
}
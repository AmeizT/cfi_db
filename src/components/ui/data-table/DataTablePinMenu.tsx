"use client"

import { Header } from "@tanstack/react-table"
import {
    ArrowLeftToLineIcon,
    ArrowRightToLineIcon,
    EllipsisIcon,
    PinOffIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTablePinMenuProps<TData> {
    header: Header<TData, unknown>
}

export function DataTablePinMenu<TData>({
    header,
}: DataTablePinMenuProps<TData>) {
    const column = header.column;
    const isPinned = column.getIsPinned();

    const headerLabel =
        typeof column.columnDef.header === "string"
        ? column.columnDef.header
        : column.id;

    if (!column.getCanPin()) {
        return null;
    }

    if (isPinned) {
        return (
            <Button
                aria-label={`Unpin ${headerLabel} column`}
                className="-mr-1 size-7 shadow-none"
                onClick={() => column.pin(false)}
                size="icon"
                title={`Unpin ${headerLabel} column`}
                variant="ghost"
            >
                <PinOffIcon
                aria-hidden="true"
                className="opacity-60"
                size={16}
                />
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label={`Pin options for ${headerLabel} column`}
                    className="-mr-1 size-7 shadow-none"
                    size="icon"
                    title={`Pin options for ${headerLabel} column`}
                    variant="ghost"
                >
                <EllipsisIcon
                    aria-hidden="true"
                    className="opacity-60"
                    size={16}
                />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem
                onClick={() => column.pin("left")}
                >
                    <ArrowLeftToLineIcon
                        aria-hidden="true"
                        className="opacity-60"
                        size={16}
                    />
                    Pin to left
                </DropdownMenuItem>

                <DropdownMenuItem
                onClick={() => column.pin("right")}
                >
                    <ArrowRightToLineIcon
                        aria-hidden="true"
                        className="opacity-60"
                        size={16}
                    />
                    Pin to right
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
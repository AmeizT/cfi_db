import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSearchParams } from "next/navigation"
import { AddCircleIcon } from "@hugeicons/core-free-icons"
import { DocumentText, Notepad2, Shapes, Stickynote } from "iconsax-reactjs"

export function CreateDropdown(){
    const searchParams = useSearchParams()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none [&_svg]:focus-within:outline-none">
                <HugeiconsIcon
                    icon={AddCircleIcon}
                    strokeWidth={2}
                    className="size-5 text-muted-foreground"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[20rem] flex flex-col justify-center items-center rounded-2xl border-gray-200/70 shadow-xl">
                {createMenu.map((item, index) => (
                    <React.Fragment key={item.name}>
                        <DropdownMenuItem className="py-2 rounded-xl gap-2 font-[450] text-gray-800">
                            <Link href={{ pathname: "/editor", query: {
                                ...Object.fromEntries(searchParams.entries()), form: "initial",
                                },
                            }} 
                            className="flex gap-2 items-center">
                                <span className="size-10 grid place-content-center bg-gray-50 rounded-lg">
                                    <item.icon className={`size-6 ${item.color}`} variant="Bulk" />
                                </span>
                                
                                <div className="flex flex-col">
                                    <h5 className="text-sm font-semibold">
                                        {item.name}
                                    </h5>

                                    <small className="text-xs text-muted-foreground">
                                        {item?.description}
                                    </small>
                                </div>
                            </Link>
                        </DropdownMenuItem>

                        {index === createMenu.length - 4 && <DropdownMenuSeparator className="w-[calc(100%-20px)] bg-gray-200/75" />}
                    </React.Fragment>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

interface CreateMenuProps {
    name: string
    color: string
    icon: React.ElementType
    action?: string
    description?: string
}

const createMenu: CreateMenuProps[] = [
    {
        name: "Report",
        icon: DocumentText,
        color: "text-blue-500",
        action: "/editor?form=initial",
        description: "Create and submit church reports."
    },
    {
        name: "Submission",
        icon: Notepad2,
        color: "text-orange-500",
        description: "Send updates or required forms."
    },
    {
        name: "Workspace",
        icon: Shapes,
        color: "text-teal-500",
        description: "Access tools and shared projects."
    },
    {
        name: "Prayer note",
        icon: Stickynote,
        color: "text-rose-500",
        description: "Write and keep prayer requests."
    }
]
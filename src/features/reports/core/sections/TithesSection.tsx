"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { BsFilter, BsSearch } from "react-icons/bs"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tithe } from "@/types"
import Link from "next/link"
import { toast } from "sonner"
import { UrlObject } from "url"
import { formatCurrency } from "@/utils"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useQueryClient } from "@tanstack/react-query"
import { EmptyState } from "@/components/ui/empty-state"
import { IconUpload, IconNote } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import { IconHistory, IconPaperclip, IconPencilMinus, IconSettings } from "@tabler/icons-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteTithe, restoreTithe } from "@/features/finance/tithes/actions/delete-tithe"
import { TitheActionButton } from "@/features/finance/tithes/components/TitheActionButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Search02Icon } from "@hugeicons/core-free-icons"

const inititalState = {
    message: "",
    status: -1,
    success: false,
}

interface TithesTabProps {
    data: Tithe[] | undefined
    isLoading: boolean
}

function TableHeaders() {
    const tbHeaders: string[] = [
        "Date",
        "Member",
        "Amount",
        "Payment Method"
    ]

    return (
        <React.Fragment>
            {tbHeaders?.map(header => (
                <TableHead key={header} className="font-[650]">
                    {header}
                </TableHead>
            ))}
        </React.Fragment>
    )
}

export function TithesSection({ data, isLoading }: TithesTabProps) {
    const itemsPerPage = 20
    const pathname = usePathname()
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const isTrashPage = pathname?.includes("trash")
    const [formState, formAction] = React.useActionState(isTrashPage ? restoreTithe : deleteTithe, inititalState)

    const actionButtonLink = isTrashPage ? "/finance/tithes" : "/trash/tithes"

    const query = searchQuery.toLowerCase()

    const filteredData = (data ?? [])?.filter((item: Tithe) => {
        const member = item?.member?.full_name?.toLowerCase()
        const reference = item?.reference_code?.toLowerCase()

        return member?.includes(query) || reference?.includes(query)
    })

    const totalPages = Math.ceil(filteredData?.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage)

    const badgeClasses = "w-fit px-2.5 h-6 flex items-center font-semibold"

    const getPaymentMethodBadge = (method: string) => {
        switch (method) {
            case "Bank":
                return <Badge className={`${badgeClasses} bg-sky-100 text-sky-800 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-500`}>Bank Transfer</Badge>
            case "Payment By Phone":
                return <Badge className={`${badgeClasses} bg-purple-100 text-purple-800 hover:bg-teal-100 dark:bg-purple-500/10 dark:text-purple-500`}>Mobile Money</Badge>
            case "Cash":
                return <Badge className={`${badgeClasses} bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-500/10 dark:text-teal-500`}>Cash</Badge>
            case "Cheque":
                return <Badge className={`${badgeClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-500`}>Cheque</Badge>
            case "Other":
                return <Badge className={`${badgeClasses} bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-500`}>Other</Badge>
            default:
                return <Badge className={`${badgeClasses} bg-gray-200 text-gray-500 dark:bg-neutral-600 dark:text-gray-400`}>Unknown</Badge>
        }
    }

    async function handleTitheAction(formData: FormData) {
        await formAction(formData)
        queryClient.invalidateQueries({ queryKey: [isTrashPage ? 'trashed_tithes' : 'tithes'] })
    }

    React.useEffect(() => {
        if (formState.status === 200 || formState.status === 204){
            toast(formState?.message || "Moved to trash", {
                action: <Link href={actionButtonLink as unknown as UrlObject} className="px-2 py-1.5 rounded-md hover:bg-primary/10 text-primary font-semibold text-sm">{isTrashPage ? "Open tithes" : "Open trash"}</Link>,
            })
        }
    }, [actionButtonLink, formState, isTrashPage])

    const emptyState = !(data ?? []).length
    const hasFilteredResults = filteredData.length > 0

    if(isLoading){
        return (
            <div>Loading...</div>
        )
    }
    

    return (
        <React.Fragment>
            {emptyState ? (
                <EmptyState 
                    type="tithes"
                />
            ) : (
                <div className="space-y-4">
                    <Card className="px-0 py-0 border-none shadow-none bg-inherit">
                        <CardHeader hidden>
                            <CardTitle>
                                Tithe Records
                            </CardTitle>
                            <CardDescription>
                                View and manage all tithe contributions
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-0">
                            <div className="gap-4 w-full flex flex-col lg:flex-row lg:justify-between items-center mb-4">
                                <div className="w-full lg:w-fit flex gap-x-2">
                                    <div className="px-3 lg:px-2.5 w-full lg:w-80 flex items-center gap-x-2 rounded-xl bg-white border border-border dark:border-neutral-700 focus-within:ring-0 focus-within:ring-neutral-800/10 focus-within:border-border dark:focus-within:ring-primary/10 dark:focus-within:border-primary transition-all duration-300">
                                        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-5 text-gray-500" />
                                        {/* <BsSearch className="size-4.5 text-gray-400" /> */}
                                        <Input
                                            id="search_tithes"
                                            name="search_tithes"
                                            placeholder="Search tithes"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="px-0 w-full h-10 lg:w-60 lg:h-9 font-medium caret-primary border-none focus-visible:ring-0 focus:border-0 placeholder:text-gray-400"
                                        />
                                    </div>

                                    <button className="hidden px-2.5 h-9 lg:h-7.5 items-center gap-x-2 rounded-md border border-dashed border-border dark:bg-neutral-950 dark:border-neutral-600 dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                                        <BsFilter className="size-5 text-gray-400 dark:text-neutral-400" /> More Filters
                                    </button>
                                </div>

                                <div className="w-full lg:w-fit flex flex-wrap items-center gap-2 lg:gap-x-2">
                                    <button className="flex-1 lg:flex-none px-2.5 h-9 lg:h-7.5 flex items-center justify-center gap-x-2 rounded-lg border border-border dark:bg-neutral-950 dark:border-neutral-600 dark:text-white text-sm font-semibold">
                                        <IconSettings strokeWidth={2.2} className="size-5 lg:size-4 text-gray-500" /> Customize
                                    </button>
                                </div>
                            </div>

                            {!hasFilteredResults ? (
                                <div className="py-10 text-center text-sm text-muted-foreground">
                                    No tithes found matching the entered member.
                                </div>
                            ) : (
                                <React.Fragment>
                                        <div className="px-4 rounded-xl border border-border bg-white dark:bg-neutral-800">
                                            <Table>
                                                <TableHeader className="sticky top-0 z-20">
                                                    <TableRow className="hover:bg-inherit">
                                                        <TableHead className="px-0 w-7 sticky left-0 z-30">
                                                            <span className="flex items-center gap-3">
                                                                <Checkbox className="lg:size-4.5 lg:rounded bg-gray-50 border border-border dark:border-neutral-600 shadow-none" id="select_all_tithes" />
                                                                <Label hidden htmlFor="select_all_tithes" />
                                                            </span>
                                                        </TableHead>

                                                        <TableHeaders />

                                                        <TableHead className="w-20"></TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {paginatedData?.map((item: Tithe) => (
                                                        <TableRow key={item?.id}>
                                                            <TableCell className="pl-0 pr-4 sticky left-0 z-20">
                                                                <span className="flex items-center gap-3">
                                                                    <Checkbox id={item?.id} className="lg:size-4.5 lg:rounded bg-gray-50 border border-border dark:border-neutral-600 shadow-none" />
                                                                    <Label hidden htmlFor={item?.id} />
                                                                </span>
                                                            </TableCell>

                                                            <TableCell>
                                                                {format(new Date(item?.timestamp), "MMMM d, yyyy")}
                                                            </TableCell>

                                                            <TableCell className={`flex gap-2 items-center ${item?.member ? "text-neutral-700 dark:text-white" : "text-red-500!"} font-semibold`}>
                                                                <Avatar className="size-7">
                                                                    <AvatarImage src="https://github.com/shadcn.png" />
                                                                    <AvatarFallback>CN</AvatarFallback>
                                                                </Avatar>
                                                                {item?.member?.full_name || "Private"}
                                                            </TableCell>

                                                            <TableCell className="slashed-zero font-geist">
                                                                {formatCurrency(item?.amount, {
                                                                    language: item?.assembly?.language,
                                                                    currency: item?.assembly?.currency
                                                                })}

                                                            </TableCell>

                                                            <TableCell>
                                                                {getPaymentMethodBadge(item.payment_method)}
                                                            </TableCell>

                                                            <TableCell>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="size-6 p-0 rounded-md hover:bg-white dark:hover:bg-neutral-800 hover:border border-border dark:border-neutral-700 transition-[colors]">
                                                                            <span className="sr-only">Open menu</span>
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-60 flex flex-col justify-center items-center border-border dark:border-neutral-600 dark:bg-neutral-800 rounded-[10px]">
                                                                        {actions
                                                                            .filter(action => action.show(isTrashPage))
                                                                            .map((action, index) => {
                                                                                const Icon = action.icon
                                                                                return (
                                                                                    <DropdownMenuItem
                                                                                        key={index}
                                                                                        className={`flex items-center gap-x-2 hover:bg-gray-400`}
                                                                                        onClick={action.onClick}
                                                                                    >
                                                                                        <Icon strokeWidth={2} className="size-4.5" />
                                                                                        {action.label}
                                                                                    </DropdownMenuItem>
                                                                                )
                                                                            })}
                                                                        <DropdownMenuSeparator className="w-[calc(100%-16px)] bg-gray-200 dark:bg-neutral-700" />
                                                                        <DropdownMenuItem asChild className={`p-0 ${isTrashPage ? "focus:text-theme-500" : "focus:text-red-500"}`}>
                                                                            <form action={handleTitheAction}>
                                                                                <input hidden name="titheId" type="text" defaultValue={String(item.id)} />
                                                                                <TitheActionButton isTrashPage={isTrashPage} />
                                                                            </form>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {totalPages > 1 && (
                                            <Pagination className="mt-4">
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                                                            }}
                                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                        />
                                                    </PaginationItem>

                                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                        const pageNumber = i + 1
                                                        return (
                                                            <PaginationItem key={pageNumber}>
                                                                <PaginationLink
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        setCurrentPage(pageNumber)
                                                                    }}
                                                                    isActive={currentPage === pageNumber}
                                                                >
                                                                    {pageNumber}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        )
                                                    })}
                                                    {totalPages > 5 && (
                                                        <React.Fragment>
                                                            <PaginationItem>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink
                                                                    href="#"
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        setCurrentPage(totalPages)
                                                                    }}
                                                                    isActive={currentPage === totalPages}
                                                                >
                                                                    {totalPages}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        </React.Fragment>
                                                    )}
                                                    <PaginationItem>
                                                        <PaginationNext
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                                            }}
                                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                                        />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        )}
                                </React.Fragment>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </React.Fragment>
    )
}

const actions = [
    {
        label: "View Receipt",
        icon: IconPaperclip,
        onClick: () => console.log("View receipt"),
        show: () => true,
    },
    {
        label: "Upload Payment Proof",
        icon: IconUpload,
        onClick: () => console.log("Upload payment proof"),
        show: (isTrashPage: boolean) => !isTrashPage,
    },
    {
        label: "Add Note",
        icon: IconNote,
        onClick: () => console.log("Add note"),
        show: () => true,
    },
    {
        label: "Edit Tithe",
        icon: IconPencilMinus,
        onClick: () => console.log("Edit tithe"),
        show: (isTrashPage: boolean) => !isTrashPage,
    },
    {
        label: "Contribution History",
        icon: IconHistory,
        onClick: () => console.log("Analyze member contributions"),
        show: () => true,
    },
]
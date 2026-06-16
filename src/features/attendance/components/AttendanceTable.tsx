"use client"

import { useState } from "react"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAttendance } from "../hooks/use-attendance"
import { Attendance } from "../schemas/attendance"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"

interface SortIconProps {
    field: string
    sortField: string
    sortDirection: "asc" | "desc"
}   

function SortIcon({ field, sortField, sortDirection }: SortIconProps) {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
        <IconChevronUp strokeWidth={2.5} className="size-4 inline ml-1" />
    ) : (
        <IconChevronDown strokeWidth={2.5} className="h-4 w-4 inline ml-1" />
    )
}

export function AttendanceTable() {
    const { data } = useAttendance()
    const attendance = data?.results ?? []

    const [sortField, setSortField] = useState<string>("timestamp")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const filteredAndSortedData = attendance
        .filter((record: Attendance) => {
            const matchesSearch =
                record?.preacher?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                record?.sermon?.toLowerCase()?.includes(searchTerm.toLowerCase())
            const matchesCategory = categoryFilter === "all" || record.category === categoryFilter
            return matchesSearch && matchesCategory
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
            const aValue = a[sortField]
            const bValue = b[sortField]
            const direction = sortDirection === "asc" ? 1 : -1

            if (typeof aValue === "string") {
                return aValue.localeCompare(bValue) * direction
            }
            return (aValue - bValue) * direction
        })

    const categoryColors = {
        sunday: "bg-theme-100 dark:bg-primary/20 dark:text-primary text-theme-500",
        friday: "bg-purple-100 dark:bg-purple-500/20 text-purple-500",
        homecell: "bg-green-100 dark:bg-green-500/20 text-green-500",
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    const formatTime = (timeString: string) => {
        return new Date(timeString).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    return (
        <div className="space-y-4 px-8 pt-4">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search preacher, sermon, church..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-1">
                        {["all", "sunday", "friday", "homecell"].map((category) => (
                            <Button
                                key={category}
                                variant="outline"
                                size="sm"
                                onClick={() => setCategoryFilter(category)}
                                className={`${categoryFilter === category ? "bg-theme-100 dark:bg-primary/20 dark:text-primary text-primary border-primary/20" : ""} h-7.5 text-sm`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-neutral-950">
                            <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800" onClick={() => handleSort("timestamp")}>
                                Date <SortIcon field="timestamp" sortField={sortField} sortDirection={sortDirection} />
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800" onClick={() => handleSort("category")}>
                                Category <SortIcon field="category" sortField={sortField} sortDirection={sortDirection} />
                            </TableHead>
                            <TableHead>Church</TableHead>
                            <TableHead>Service Details</TableHead>
                            <TableHead
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 text-center"
                                onClick={() => handleSort("headcount")}
                            >
                                Total <SortIcon field="headcount" sortField={sortField} sortDirection={sortDirection} />
                            </TableHead>
                            <TableHead className="text-center">Adults</TableHead>
                            <TableHead className="text-center">Children</TableHead>
                            <TableHead className="text-center">Visitors</TableHead>
                            <TableHead className="text-center">Altar Call</TableHead>
                            <TableHead className="text-center">Baptisms</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedData.map((record: Attendance, index: number) => (
                            <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-neutral-900">
                                <TableCell className="font-medium">
                                    <div>
                                        <div>{formatDate(record.timestamp)}</div>
                                        <div className="text-xs text-gray-500">
                                            {formatTime(String(record?.start_time))} - {formatTime(String(record.end_time))}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${categoryColors[record.category as keyof typeof categoryColors]} w-fit h-6 flex items-center capitalize`}>
                                        {record.category}
                                    </Badge>
                                    {record.homecell && <div className="text-xs text-gray-500 mt-1"></div>}
                                </TableCell>
                                <TableCell>{record?.church}</TableCell>
                                <TableCell>
                                    <div className="max-w-xs">
                                        <div className="font-medium truncate">
                                            &quot;{record.sermon}&quot;
                                        </div>
                                        <div className="text-sm text-muted-foreground dark:text-neutral-500 truncate">by {record.preacher}</div>
                                        {record.scriptures && (
                                            <div className="text-xs text-primary truncate">
                                                {record.scriptures}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-semibold">
                                    {record.headcount}
                                </TableCell>
                                <TableCell className="text-center">{record.adults}</TableCell>
                                <TableCell className="text-center">{record.children}</TableCell>
                                <TableCell className="text-center text-green-600 font-medium">{record.visitors}</TableCell>
                                <TableCell className="text-center text-red-600 font-medium">{record.altar_call}</TableCell>
                                <TableCell className="text-center">
                                    {record?.baptism && record?.baptism > 0 ? (
                                        <Badge className=" bg-theme-100 text-theme-800 dark:bg-primary/20 dark:text-primary">{record.baptism}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {filteredAndSortedData.length === 0 && (
                <div className="text-center py-8 text-gray-500">No attendance records found matching your criteria.</div>
            )}
        </div>
    )
}

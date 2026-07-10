"use client"

import React, { useMemo } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { UploadEngine } from "../components/UploadEngine"
import { apiRoutes } from "@/config/urls"
import Link from "next/link"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { AddCircleIcon, GridIcon } from "@hugeicons/core-free-icons"
import { Templates } from "../components/Templates"
import View from "@/components/ui/view"

interface UploadData {
    type: string 
    uploadUrl: string
    imageUploadUrl?: string
    templateUrl: string
}

export default function UploadView(){
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const tab = searchParams.get("tab") ?? ""
    const isTemplates = tab === "templates"

    const selectedUploadConfig = useMemo(() => {
        const uploadConfigMap: Record<string, UploadData> = {
            revenue: {
                type: "revenue",
                uploadUrl: apiRoutes.uploadExcel.revenue,
                templateUrl: apiRoutes.downloadTemplate.revenue
            },
            attendance: {
                type: "attendance",
                uploadUrl: apiRoutes.uploadExcel.attendance,
                templateUrl: apiRoutes.downloadTemplate.attendance
            },
            expenses: {
                type: "expenditure",
                uploadUrl: apiRoutes.uploadExcel.expenses,
                imageUploadUrl: apiRoutes.uploadImage.expenses,
                templateUrl: apiRoutes.downloadTemplate.expenses
            },
            overhead: {
                type: "overhead",
                uploadUrl: apiRoutes.uploadExcel.overhead,
                templateUrl: apiRoutes.downloadTemplate.overhead
            },
            tithes: {
                type: "tithes",
                uploadUrl: apiRoutes.uploadExcel.tithes,
                templateUrl: apiRoutes.downloadTemplate.tithes
            }
        }

        return uploadConfigMap[tab] || { type: "", uploadUrl: "", templateUrl: "" }
    }, [tab])

    const FINANCE_COLUMNS = [
        { key: "timestamp", label: "Date", required: true },
        // { key: "category", label: "Category", required: true },
        { key: "amount", label: "Amount", required: true },
    ]

    const columns = tab !== "attendance" ? FINANCE_COLUMNS : []

    const pageTabs: string[] = [
        "attendance",
        "expenses",
        "overhead",
        "revenue",
        "tithes",
    ]

    function tabStyles(isActive: boolean){
        const styles = cn(
            'capitalize text-[13px] font-semibold',
            'px-3.5 h-8 flex items-center rounded-full', 
            'transition-colors duration-150',
            isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-surface hover:bg-hover"
        )

        return styles
    }


    const tabs = [
        {
            label: "Attendance",
            href: "/attendance"
        },
        {
            label: "Revenue",
            href: "/attendance"
        }
    ]

    const description = isTemplates ? "Download a template to create your monthly report. Do not change the headers in the first row, as this may cause upload errors. After filling in your data, save the file before importing." : "Upload your completed spreadsheet to create your monthly report. Please check that all your data is correct before uploading."
    

    return (
        <View as="article" className="flex flex-col">
            <View.Header 
                pathname={pathname} 
                pagename={(
                    <h3 className="flex gap-3 items-center">
                        {/* <HugeiconsIcon icon={AddCircleIcon} className="size-7 text-mist-300" /> */}
                        <span>
                            {!isTemplates ? `${tab} Upload Spreadsheet` : "Spreadsheet Templates"}
                        </span>
                    </h3>
                )}
                description={description}
            >
                <nav aria-label="Page Tabs" data-ui="page-tabs" className="pt-6 w-full h-fit flex justify-between items-center">
                    <ul className="flex gap-1.75">
                        {pageTabs.map(pageTab => {
                            const isActive = pageTab === tab

                            return (
                                <li key={pageTab}>
                                    <Link
                                        href={`${pathname}?${createQueryString(searchParams, { tab: pageTab })}`}
                                        className={cn(tabStyles(isActive))}
                                    >
                                        {pageTab}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    <ul>
                        <Link
                            href="/imports?tab=templates"
                            className={cn(tabStyles(tab === "templates"), "px-3 gap-2")}
                        >
                            <HugeiconsIcon icon={GridIcon} strokeWidth={1.75} className="size-5" /> Templates
                        </Link>
                    </ul>
                </nav>
            </View.Header>

            <View.Body data-id="view-body" className="px-6 pb-6 flex-row gap-4">
                <div className="grow flex flex-col gap-6">
                    {isTemplates ? (
                        <Templates />
                    ) : (
                        <UploadEngine
                            config={{
                                type: selectedUploadConfig.type,
                                uploadUrl: selectedUploadConfig.uploadUrl,
                                imageUploadUrl: selectedUploadConfig.imageUploadUrl,
                                templateUrl: selectedUploadConfig.templateUrl,
                                columns: [],
                            }}
                        />
                    )}
                </div>

                <div className={cn(
                    "w-1/3 h-full rounded-3xl bg-surface",
                    isTemplates ? "hidden" : "flex"
                )}>
                </div>
            </View.Body>
        </View>
    )
}

"use client"

import { useSearchParams } from "next/navigation"
import { ReportList } from "../components/reports/ReportList"
import React from "react"
import { ReportDetailsView } from "./ReportDetailsView"

function getBooleanParam(searchParams: URLSearchParams, key: string, defaultValue = false) {
    const value = searchParams.get(key)
    if (value === null) return defaultValue
    return value === "true"
}

export default function ReportsView() {
    const searchParams = useSearchParams()
    const detailed = getBooleanParam(searchParams, "detailed")

    return (
        <React.Fragment>
            {detailed ? <ReportDetailsView /> : <ReportList /> }
        </React.Fragment>
    )
}












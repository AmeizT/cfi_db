"use client"
import React from "react"
import Link from "next/link"
// import { SuperDataGrid } from "./DataGrid"
import VaulDrawer from "../components/AttendanceDraw"
import { StatsUploader } from "../components/StatsUploader"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"

export default function DemoTablePage() {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Super Table Demo (20 rows)</h2>
            
            <div className="h-fit flex items-center gap-2">
                <Button asChild variant="outline" className="h-fit">
                    <Link
                        href="http://localhost:8000/api/v1/people/attendance/download_template/"
                    >
                        <HugeiconsIcon icon={Download01Icon} strokeWidth={2} className="size-4.5" />
                        Download Template
                    </Link>
                </Button>

                <StatsUploader />

                <VaulDrawer />
            </div>

            {/* <SuperDataGrid
                data={data}
                columns={COLUMNS}
                rowHeight={36}
                onCellEdit={handleCellEdit}
                
            /> */}
        </div>
    )
}

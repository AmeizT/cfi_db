"use client"

import { getYear } from "date-fns"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { FormController } from "./FormController"
import { CategoryDropdown } from "./CategoryDropdown"
import { Mode, FormKey, getFormMeta } from "../config/form"
import { useReports } from "@/features/reports/core/hooks/use-reports"
import { FormProvider, useFormContext } from "../context/form-context"

function ManagerLayout() {
    const searchParams = useSearchParams()
    const { isPending } = useFormContext()
    const mode: Mode = (searchParams.get("mode") as Mode) ?? "reports"
    const form = searchParams.get("form") as FormKey<typeof mode> | null
    const selectedForm = getFormMeta(mode, form)
    
    const selectedYear = Number(
        searchParams.get("year") ?? getYear(new Date())
    )

    const selectedMonth = searchParams.get("month")

    const { data: reports = [] } = useReports({
        year: String(selectedYear),
    })

    const selectedReport = reports?.find(report => report.id === Number(searchParams.get("reportId")))

    console.log("selectedReport", selectedReport)

    // const reportSections = Object.entries(selectedReport?.data || {}) || []


    // const hasEmptySections = reportSections.some(
    //     eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     ([_, items]) => items?.length === 0
    // )
    
    return (
        <div>
            <div className="px-2">
                <header className="py-6 w-full flex flex-col gap-4 border-b border-gray-200">
                    <div className="w-full flex justify-between">
                        <div className="flex items-center gap-4">
                            <h4 className="text-2xl font-bold">
                                Create {selectedForm?.title}
                            </h4>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* <ReportSelector 
                                selectedMonth={selectedMonth} 
                                selectedYear={selectedYear} 
                                reports={reports} 
                            /> */}

                            <Separator 
                                orientation="vertical" 
                                className="data-[orientation=vertical]:h-5.5" 
                            />

                            <CategoryDropdown mode={mode} />
                        </div>
                    </div>
                </header>
            </div>
            
            <div className="mt-8 grid grid-cols-[50%_auto] gap-8 min-h-0">
                <main className="flex min-h-0 flex-col overflow-y-auto">
                    <div className="px-2 flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto pt-2">
                        <FormController 
                            form={String(form ?? "")} 
                            report={null}
                        />
                    </div>

                    <footer className="px-2 py-8 flex justify-end items-center">
                        <Button
                            className="px-4 min-h-10 rounded-xl relative"
                            type="submit"
                            form={String(form ?? "")}
                        >
                            {isPending ? "Submitting..." : "Submit Draft"}

                            {isPending && (
                                <span className="h-6 w-6 absolute -right-2 top-0 -translate-y-1/2 flex items-center justify-center bg-slate-800 rounded-full border border-slate-50">
                                    <Spinner className="h-[6%] w-[16%] bg-white" />
                                </span>
                            )}
                        </Button>
                    </footer>
                </main>

                <aside className="relative w-80 border-l border-slate-200 px-6 py-4">
                    <div className="sticky top-4 flex flex-col gap-6">
                        <div>
                            <ul>
                                {/* {reportSections?.map(([section, items]) => (
                                    <li key={section} className="flex justify-between items-center border-b border-border">
                                        <h5 className="font-semibold">{section}</h5>
                                        {items.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No data</p>
                                        ) : (
                                            <p className="text-sm">{items.length} records</p>
                                        )}
                                    </li>
                                ))} */}
                            </ul>
                        </div>

                        <div>
                            {selectedReport?.status?.includes("draft") ? (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                    Draft
                                </span>
                            ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    Submitted
                                </span>
                            )}
                        </div>

                        <div>
                            {selectedReport?.status?.includes("draft") ? (
                                <div>
                                    <button className="disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                                        Finalize Report
                                    </button>
                                </div>
                            ) : (
                                <button>
                                    View Report
                                </button>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
        
    )
}

export function ManagerContainer() {
    return (
        <FormProvider>
            <ManagerLayout />
        </FormProvider>
    )
}
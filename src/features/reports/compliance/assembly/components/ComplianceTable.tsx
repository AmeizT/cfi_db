import { FieldDot } from "./FieldDot"
import { ProgressBar } from "./ProgressBar"
import { StarRating } from "./StarRating"
import { StatusPill } from "./StatusPill"
import { SummaryCards } from "./SummaryCards"
import { AssemblyComplianceReport } from "@/dal/types"
import { ComplianceStatus, FieldStatus } from "./types"

const FIELDS = ["attendance", "tithes", "revenue", "overhead"] as const;

const COLUMNS = ["Month", "Report fields", "Completion", "Rating", "Status", "Submitted on"];

interface Props {
  data: AssemblyComplianceReport;
}

export function ComplianceTable({ data }: Props) {
    return (
        <div className="py-6 font-sans">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                <SummaryCards summary={data?.summary} />
            </div>

            <div className="flex items-center gap-4 mb-5 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-5 h-5 rounded-full bg-[#EAF3DE] text-[#3B6D11] flex items-center justify-center text-[9px] font-semibold">
                        ✓
                    </div>
                    Submitted
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="w-5 h-5 rounded-full bg-[#FCEBEB] text-[#A32D2D] flex items-center justify-center text-[9px] font-semibold">
                        ✗
                    </div>
                    Not submitted
                </div>

                <span className="text-[11px] text-gray-400 italic">
                    Hover dots to see field name
                </span>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {COLUMNS.map((col) => (
                                <th
                                    key={col}
                                    className="px-3 pb-3 pt-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    {col}
                                </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {data?.results?.map((report, i) => {
                                const fields = {
                                    attendance: report.attendance ? "submitted" : "missing",
                                    tithes: report.tithes ? "submitted" : "missing",
                                    revenue: report.revenue ? "submitted" : "missing",
                                    overhead: report.overhead ? "submitted" : "missing",
                                }

                                const status: ComplianceStatus =
                                    report.completion === 100
                                        ? "compliant"
                                        : report.completion >= 75
                                            ? "partial"
                                        : "noncompliant";
                                console.log("compliance status", status)

                                return (
                                    <tr
                                        key={report.month}
                                        className={i < data.results.length - 1 ? "border-b border-gray-50" : ""}
                                    >
                                        {/* Month */}
                                        <td className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {report.month}
                                        </td>

                                        {/* Field dots */}
                                        <td className="px-3 py-4">
                                            <div className="flex gap-1.5 items-center">
                                                {FIELDS.map((f) => (
                                                    <FieldDot 
                                                        key={f} 
                                                        field={f} 
                                                        status={fields[f] as FieldStatus} 
                                                    />
                                                ))}
                                            </div>
                                        </td>

                                        {/* Completion */}
                                        <td className="px-3 py-4">
                                            <ProgressBar pct={report?.completion} />
                                        </td>

                                        {/* Rating */}
                                        <td className="px-3 py-4">
                                            <StarRating rating={report.rating} />
                                        </td>

                                        {/* Status */}
                                        <td className="px-3 py-4">
                                            <StatusPill status={status} />
                                        </td>

                                        {/* Date */}
                                        <td className="px-3 py-4 text-xs text-gray-400 whitespace-nowrap">
                                            {report?.month}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

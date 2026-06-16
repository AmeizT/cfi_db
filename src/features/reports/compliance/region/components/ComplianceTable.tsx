"use client";

import { Assembly } from "@/dal/types/index.schemas";
import { ProgressBar } from "./ProgressBar";
import { StarRating } from "./StarRating";
import { StatusPill } from "./StatusPill";
import { FieldDot } from "./FieldDot";

interface Props {
  assembly: Assembly;
}

const FIELDS = ["attendance", "tithes", "income", "expenditure"] as const;

export function ComplianceTable({ assembly }: Props) {
  // const reports = []
  // const overall = Math.round(
  //   reports.reduce((s, r) => s + r.completionPct, 0) / assembly.reports.length
  // );
  // const compliantMonths = assembly.reports.filter((r) => r.status === "compliant").length;

  return (
    <div>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{assembly.name}</h2>
          {/* <p className="text-sm text-gray-500">{assembly.location} · Monthly compliance 2026</p> */}
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {/* {[
            { label: "Overall", value: `${overall}%`, color: overall >= 80 ? "text-green-700" : overall >= 50 ? "text-amber-700" : "text-red-700" },
            { label: "Compliant months", value: `${compliantMonths} / ${assembly.reports.length}`, color: compliantMonths === assembly.reports.length ? "text-green-700" : "text-red-700" },
          ].map((c) => (
            <div key={c.label} className="bg-gray-50 rounded-lg px-4 py-2.5 min-w-22.5">
              <p className="text-[11px] text-gray-400 mb-1">{c.label}</p>
              <p className={`text-xl font-medium ${c.color}`}>{c.value}</p>
            </div>
          ))} */}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Month", "Report fields", "Completion", "Rating", "Status", "Submitted on"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* {assembly.reports.map((report, i) => (
                <tr key={report.month} className={i < assembly.reports.length - 1 ? "border-b border-gray-50" : ""}>
                  <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{report.month}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {FIELDS.map((f) => (
                        <FieldDot key={f} field={f} status={report.fields[f]} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ProgressBar pct={report.completionPct} />
                  </td>
                  <td className="px-4 py-4">
                    <StarRating rating={report.rating} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill status={report.status} />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">{report.submittedOn}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

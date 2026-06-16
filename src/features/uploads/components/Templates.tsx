import Link from "next/link"
import { motion } from "motion/react"
import { apiRoutes } from "@/config/urls"

interface UploadTemplateItem {
    key: string
    label: string
    href: string
    description: string
    columns: string[]
    rows: number
    accentColor: string
    iconPath: string
}

const SheetPreview = ({
    columns,
    rows,
    accentColor,
}: {
    columns: string[]
    rows: number
    accentColor: string
}) => {
    const colLetters = ["A", "B", "C", "D", "E"].slice(0, columns.length)

    return (
        <div className="absolute inset-0 flex flex-col text-[9px] font-mono overflow-hidden">
            {/* Column header row */}
            <div className="flex border-b border-mist-100 bg-mist-50/80 shrink-0">
                {/* Row number gutter */}
                <div className="w-6 shrink-0 border-r border-mist-100" />
                {colLetters.map((letter) => (
                    <div
                        key={letter}
                        className="flex-1 flex items-center justify-center h-5 border-r border-mist-100 last:border-r-0 text-mist-400 font-medium tracking-wider"
                    >
                        {letter}
                    </div>
                ))}
            </div>

            {/* Column label row (row 1 - headers) */}
            <div className="flex border-b shrink-0" style={{ borderColor: accentColor + "40" }}>
                <div
                    className="w-6 shrink-0 border-r border-mist-100 flex items-center justify-center text-mist-300"
                    style={{ backgroundColor: accentColor + "10" }}
                >
                    1
                </div>
                {columns.map((col, i) => (
                    <div
                        key={i}
                        className="flex-1 flex items-center px-1 h-5.5 border-r border-mist-100 last:border-r-0 font-semibold truncate"
                        style={{ backgroundColor: accentColor + "18", color: accentColor }}
                    >
                        {col}
                    </div>
                ))}
            </div>

            {/* Blank data rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex border-b border-mist-100/70 shrink-0">
                    <div className="w-6 shrink-0 border-r border-mist-100 flex items-center justify-center text-mist-300 bg-mist-50/50">
                        {rowIdx + 2}
                    </div>
                    {columns.map((_, colIdx) => (
                        <div
                            key={colIdx}
                            className="flex-1 h-5.5 border-r border-mist-100/70 last:border-r-0"
                        />
                    ))}
                </div>
            ))}

            {/* Formula hint row */}
            <div className="flex border-b border-mist-100/40 shrink-0 mt-auto">
                <div className="w-6 shrink-0 border-r border-mist-100" />
                <div className="flex-1 px-1 h-5.5 flex items-center text-mist-300 italic">
                    = SUM(...)
                </div>
            </div>
        </div>
    )
}

export function Templates() {
    const uploadTemplates: UploadTemplateItem[] = [
        {
            key: "attendance",
            label: "Attendance",
            href: apiRoutes.downloadTemplate.attendance,
            description: "Weekly service attendance records",
            columns: ["Date", "Service", "Members", "Visitors"],
            rows: 7,
            accentColor: "#534AB7",
            iconPath: "M3 4h6M3 6h4M3 8h5",
        },
        {
            key: "tithes",
            label: "Tithes",
            href: apiRoutes.downloadTemplate.tithes,
            description: "Member tithe contributions",
            columns: ["Date", "Member", "Amount", "Method"],
            rows: 7,
            accentColor: "#1D9E75",
            iconPath: "M2 9l2.5-3L7 8l3-5",
        },
        {
            key: "revenue",
            label: "Revenue",
            href: apiRoutes.downloadTemplate.revenue,
            description: "All income sources",
            columns: ["Date", "Source", "Category", "Amount"],
            rows: 7,
            accentColor: "#0F6E56",
            iconPath: "M2 9l2.5-3L7 8l3-5",
        },
        {
            key: "overhead",
            label: "Overhead",
            href: apiRoutes.downloadTemplate.overhead,
            description: "Fixed monthly costs",
            columns: ["Item", "Type", "Frequency", "Amount"],
            rows: 7,
            accentColor: "#D85A30",
            iconPath: "M3 4h6M3 6h6M3 8h4",
        },
        {
            key: "expenses",
            label: "Expenses",
            href: apiRoutes.downloadTemplate.expenses,
            description: "General expenditures",
            columns: ["Date", "Description", "Category", "Amount"],
            rows: 7,
            accentColor: "#BA7517",
            iconPath: "M3 4h6M3 6h6M3 8h4",
        },
    ]

    return (
        <div className="grid grid-cols-4 gap-x-4 gap-y-8">
            {uploadTemplates.map((template) => (
                <Link
                    key={template.key}
                    href={template.href}
                    className="group flex flex-col gap-3"
                >
                    <motion.div
                        whileHover={{
                            y: -6,
                            scale: 1.03,
                            rotateX: 6,
                            rotateY: -6,
                        }}
                        
                        className="relative min-h-64 rounded-2xl overflow-hidden bg-white shadow-card"
                        style={
                            {
                                "--accent": template.accentColor, transformPerspective: 1000
                            } as React.CSSProperties
                        }
                    >
                        {/* Gradient border glow on hover */}
                        <div
                            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{
                                boxShadow: `0 0 0 1.5px ${template.accentColor}60, 0 8px 24px -4px ${template.accentColor}30`,
                            }}
                        />

                        {/* Sheet preview */}
                        <SheetPreview
                            columns={template.columns}
                            rows={template.rows}
                            accentColor={template.accentColor}
                        />
                    </motion.div>

                    {/* Label */}
                    <div className="flex items-center gap-2 px-0.5">
                        <div
                            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors duration-200"
                            style={{
                                backgroundColor: `${template.accentColor}15`,
                                borderColor: `${template.accentColor}30`,
                            }}
                        >
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 12 12"
                                fill="none"
                                style={{ color: template.accentColor }}
                            >
                                <rect
                                    x="1" y="1" width="10" height="10" rx="2"
                                    stroke="currentColor"
                                    strokeWidth="1.2"
                                />
                                <path
                                    d={template.iconPath}
                                    stroke="currentColor"
                                    strokeWidth="1.1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate leading-tight">
                                {template.label}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate leading-tight">
                                {template.description}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
"use client"

import { useMemo, useRef, useState } from "react"
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckSquare2,
    FileText,
    Home,
    Landmark,
    LayoutTemplate,
    Users,
    UsersRound,
} from "lucide-react"

import type {
    AttendanceData,
    AttendanceRow,
    LedgerItem,
    SaveState,
    WizardStep,
} from "../types"
import { AttendanceTable } from "./AttendanceTable"
import { LedgerSection, ledgerTotal, money } from "./LedgerSection"
import { SkipModal } from "./SkipModal"
import { StepTracker } from "./StepTracker"

const weeks = ["Aug 2", "Aug 9", "Aug 16", "Aug 23", "Aug 30"]

const attendanceRows: AttendanceRow[] = [
    { key: "men", label: "Men" },
    { key: "women", label: "Women" },
    { key: "visitor_men", label: "Visitor men" },
    { key: "visitor_women", label: "Visitor women" },
    { key: "new_converts", label: "New converts", special: true },
    { key: "baptisms", label: "Baptisms", special: true },
]

const sundaySchoolRows: AttendanceRow[] = [
    { key: "children", label: "Children" },
    { key: "teachers", label: "Teachers" },
    { key: "visitors", label: "Visitors" },
]

const REVENUE_CATEGORIES = [
    "Offerings",
    "Fundraising & Projects",
    "Donations & Grants",
    "Other Revenue",
]

const OVERHEAD_CATEGORIES = [
    "Facilities & Utilities",
    "Administration",
    "Staff & Salaries",
    "Transport & Logistics",
    "Other Overhead",
]

const initialSteps: WizardStep[] = [
    { key: "attendance", title: "Attendance", status: "not_started" },
    { key: "sunday_school", title: "Sunday school", status: "not_started" },
    { key: "tithes", title: "Tithes", status: "not_started" },
    { key: "other_revenue", title: "Other revenue", status: "not_started" },
    { key: "overhead", title: "Overhead expenses", status: "not_started" },
    { key: "variable", title: "Variable expenses", status: "not_started", optional: true },
    { key: "review", title: "Review & submit", status: "not_started" },
]

function createAttendanceData(rows: AttendanceRow[]): AttendanceData {
    return Object.fromEntries(rows.map((row) => [row.key, {}]))
}

function sumAttendanceRow(data: AttendanceData, rowKey: string) {
    return weeks.reduce((sum, week) => sum + (Number(data[rowKey]?.[week]) || 0), 0)
}

function getAttendanceTotal(
    data: AttendanceData,
    includeSpecial: boolean,
) {
    return weeks.reduce((grand, week) => {
        const weekly = attendanceRows.reduce((sum, row) => {
            if (row.special && !includeSpecial) return sum
            return sum + (Number(data[row.key]?.[week]) || 0)
        }, 0)

        return grand + weekly
    }, 0)
}

function getSundaySchoolTotal(data: AttendanceData) {
    return sundaySchoolRows.reduce(
        (sum, row) => sum + sumAttendanceRow(data, row.key),
        0,
    )
}

type ReportWizardProps = {
    onSubmitted: () => void
    onBackToHub: () => void
}

export function ReportWizard({ onSubmitted, onBackToHub }: ReportWizardProps) {
    const [steps, setSteps] = useState(initialSteps)
    const [current, setCurrent] = useState(0)
    const [saveState, setSaveState] = useState<SaveState>("saved")
    const [includeSpecial, setIncludeSpecial] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [skipModalOpen, setSkipModalOpen] = useState(false)

    const [attendance, setAttendance] = useState<AttendanceData>(() =>
        createAttendanceData(attendanceRows),
    )
    const [sundaySchool, setSundaySchool] = useState<AttendanceData>(() =>
        createAttendanceData(sundaySchoolRows),
    )

    const [tithes, setTithes] = useState<LedgerItem[]>([
        { source: "General tithes", amount: "" },
    ])
    const [otherRevenue, setOtherRevenue] = useState<LedgerItem[]>([
        { category: "Offerings", desc: "", amount: "" },
    ])
    const [overhead, setOverhead] = useState<LedgerItem[]>([
        { category: "Facilities & Utilities", desc: "", amount: "" },
    ])
    const [variable, setVariable] = useState<LedgerItem[]>([])
    const [variableSkipped, setVariableSkipped] = useState(false)
    const [skipReason, setSkipReason] = useState("")

    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const currentStep = steps[current]

    const markSaving = () => {
        setSaveState("saving")
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => setSaveState("saved"), 700)
    }

    const updateAttendance = (
        setter: React.Dispatch<React.SetStateAction<AttendanceData>>,
        row: string,
        week: string,
        value: string,
    ) => {
        setter((previous) => ({
            ...previous,
            [row]: {
                ...previous[row],
                [week]: value,
            },
        }))
        markSaving()
    }

    const updateLedger = (
        setter: React.Dispatch<React.SetStateAction<LedgerItem[]>>,
        index: number,
        field: keyof LedgerItem,
        value: string,
    ) => {
        setter((previous) =>
            previous.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item,
            ),
        )
        markSaving()
    }

    const deleteLedgerRow = (
        setter: React.Dispatch<React.SetStateAction<LedgerItem[]>>,
        index: number,
    ) => {
        setter((previous) => previous.filter((_, itemIndex) => itemIndex !== index))
        markSaving()
    }

    const markCurrentResolved = () => {
        setSteps((previous) =>
            previous.map((step, index) =>
                index === current ? { ...step, status: "submitted" } : step,
            ),
        )
    }

    const handleContinue = () => {
        markCurrentResolved()

        if (current === steps.length - 1) {
            setCompleted(true)
            onSubmitted()
            return
        }

        setCurrent((value) => value + 1)
    }

    const handleSkipVariable = (reason: string) => {
        setVariableSkipped(true)
        setSkipReason(reason)
        setSteps((previous) =>
            previous.map((step) =>
                step.key === "variable" ? { ...step, status: "skipped" } : step,
            ),
        )
        setSkipModalOpen(false)
        setCurrent((value) => Math.min(value + 1, steps.length - 1))
    }

    const reviewRows = useMemo(
        () => [
            {
                key: "attendance",
                label: "Attendance",
                value: `${getAttendanceTotal(attendance, includeSpecial)} total attendance`,
            },
            {
                key: "sunday_school",
                label: "Sunday school",
                value: `${getSundaySchoolTotal(sundaySchool)} total`,
            },
            { key: "tithes", label: "Tithes", value: money(ledgerTotal(tithes)) },
            {
                key: "other_revenue",
                label: "Other revenue",
                value: money(ledgerTotal(otherRevenue)),
            },
            {
                key: "overhead",
                label: "Overhead expenses",
                value: money(ledgerTotal(overhead)),
            },
            {
                key: "variable",
                label: "Variable expenses",
                value: variableSkipped ? "Skipped" : money(ledgerTotal(variable)),
            },
        ],
        [
            attendance,
            includeSpecial,
            sundaySchool,
            tithes,
            otherRevenue,
            overhead,
            variable,
            variableSkipped,
        ],
    )

    const section = (() => {
        switch (currentStep.key) {
            case "attendance":
                return (
                    <AttendanceTable
                        title="Attendance"
                        description="Record weekly service attendance for this reporting period."
                        rows={attendanceRows}
                        weeks={weeks}
                        data={attendance}
                        includeSpecialInTotal={includeSpecial}
                        showSpecialToggle
                        onToggleSpecial={(checked) => {
                            setIncludeSpecial(checked)
                            markSaving()
                        }}
                        onChange={(row, week, value) =>
                            updateAttendance(setAttendance, row, week, value)
                        }
                    />
                )

            case "sunday_school":
                return (
                    <AttendanceTable
                        title="Sunday school"
                        description="Record weekly Sunday school attendance for this reporting period."
                        rows={sundaySchoolRows}
                        weeks={weeks}
                        data={sundaySchool}
                        includeSpecialInTotal
                        onChange={(row, week, value) =>
                            updateAttendance(setSundaySchool, row, week, value)
                        }
                    />
                )

            case "tithes":
                return (
                    <LedgerSection
                        title="Tithes"
                        description="Log tithes received for this reporting period."
                        items={tithes}
                        totalLabel="Total tithes"
                        showRemittance
                        onAdd={() => {
                            setTithes((items) => [...items, { source: "", amount: "" }])
                            markSaving()
                        }}
                        onUpdate={(index, field, value) =>
                            updateLedger(setTithes, index, field, value)
                        }
                        onDelete={(index) => deleteLedgerRow(setTithes, index)}
                    />
                )

            case "other_revenue":
                return (
                    <LedgerSection
                        title="Other revenue"
                        description="Offerings, fundraising, donations, and grants outside of tithes."
                        items={otherRevenue}
                        categories={REVENUE_CATEGORIES}
                        hasDescription
                        totalLabel="Total other revenue"
                        onAdd={() => {
                            setOtherRevenue((items) => [
                                ...items,
                                { category: REVENUE_CATEGORIES[0], desc: "", amount: "" },
                            ])
                            markSaving()
                        }}
                        onUpdate={(index, field, value) =>
                            updateLedger(setOtherRevenue, index, field, value)
                        }
                        onDelete={(index) => deleteLedgerRow(setOtherRevenue, index)}
                    />
                )

            case "overhead":
                return (
                    <LedgerSection
                        title="Overhead expenses"
                        description="Recurring operating costs for this reporting period. This section is mandatory."
                        items={overhead}
                        categories={OVERHEAD_CATEGORIES}
                        hasDescription
                        totalLabel="Total overhead"
                        onAdd={() => {
                            setOverhead((items) => [
                                ...items,
                                { category: OVERHEAD_CATEGORIES[0], desc: "", amount: "" },
                            ])
                            markSaving()
                        }}
                        onUpdate={(index, field, value) =>
                            updateLedger(setOverhead, index, field, value)
                        }
                        onDelete={(index) => deleteLedgerRow(setOverhead, index)}
                    />
                )

            case "variable":
                return variableSkipped ? (
                    <div>
                        <div className="mb-[22px]">
                            <h2 className="text-[22px] font-bold tracking-[-0.01em]">
                                Variable expenses
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                This section was skipped for this reporting period.
                            </p>
                        </div>

                        <div className="rounded-[14px] border border-border bg-card p-5 text-card-foreground">
                            <div className="flex items-start gap-3">
                                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[#c8891a]/[0.14] text-[#c8891a]">
                                    <CheckSquare2 className="size-[18px]" strokeWidth={1.75} />
                                </span>
                                <div>
                                    <div className="text-sm font-semibold">Skipped — reason logged</div>
                                    <div className="mt-1 text-[13.5px] text-muted-foreground">
                                        {skipReason}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setVariableSkipped(false)
                                setSteps((previous) =>
                                    previous.map((step) =>
                                        step.key === "variable"
                                            ? { ...step, status: "not_started" }
                                            : step,
                                    ),
                                )
                            }}
                            className="mt-3.5 rounded-[10px] border border-border bg-card px-4 py-2.5 text-[13.5px] font-semibold text-card-foreground"
                        >
                            Undo skip
                        </button>
                    </div>
                ) : (
                    <LedgerSection
                        title="Variable expenses"
                        description="Optional — irregular or one-off costs for this period. Skip if none were incurred."
                        items={variable}
                        hasDescription
                        totalLabel="Total variable expenses"
                        onAdd={() => {
                            setVariable((items) => [
                                ...items,
                                { source: "", desc: "", amount: "" },
                            ])
                            markSaving()
                        }}
                        onUpdate={(index, field, value) =>
                            updateLedger(setVariable, index, field, value)
                        }
                        onDelete={(index) => deleteLedgerRow(setVariable, index)}
                    />
                )

            case "review": {
                const totalRevenue = ledgerTotal(tithes) + ledgerTotal(otherRevenue)
                const totalExpenses =
                    ledgerTotal(overhead) + (variableSkipped ? 0 : ledgerTotal(variable))

                return (
                    <div>
                        <div className="mb-[22px]">
                            <h2 className="text-[22px] font-bold tracking-[-0.01em]">
                                Review &amp; submit
                            </h2>
                            <p className="mt-1 max-w-[60ch] text-sm leading-[1.5] text-muted-foreground">
                                Check the figures below before submitting the August 2026 report. You can still edit any section.
                            </p>
                        </div>

                        <div className="mb-[18px] grid gap-3.5 sm:grid-cols-3">
                            <div className="rounded-[10px] bg-primary px-4 py-3.5 text-primary-foreground">
                                <div className="text-xs text-primary-foreground/65">Total revenue</div>
                                <div className="mt-1 text-[19px] font-bold">{money(totalRevenue)}</div>
                            </div>
                            <div className="rounded-[10px] border border-border bg-card px-4 py-3.5 text-card-foreground">
                                <div className="text-xs text-muted-foreground">Total expenses</div>
                                <div className="mt-1 text-[19px] font-bold">{money(totalExpenses)}</div>
                            </div>
                            <div className="rounded-[10px] border border-border bg-card px-4 py-3.5 text-card-foreground">
                                <div className="text-xs text-muted-foreground">Net position</div>
                                <div className="mt-1 text-[19px] font-bold">
                                    {money(totalRevenue - totalExpenses)}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {reviewRows.map((row) => {
                                const targetIndex = steps.findIndex((step) => step.key === row.key)
                                const target = steps[targetIndex]
                                const skipped = row.key === "variable" && variableSkipped
                                const resolved = target?.status === "submitted"

                                return (
                                    <div
                                        key={row.key}
                                        className="flex items-center gap-3.5 rounded-[10px] border border-border bg-card px-4 py-3.5 text-card-foreground"
                                    >
                                        <span
                                            className={
                                                skipped
                                                    ? "grid size-[34px] shrink-0 place-items-center rounded-[9px] bg-[#c8891a]/[0.14] text-[#c8891a]"
                                                    : resolved
                                                      ? "grid size-[34px] shrink-0 place-items-center rounded-[9px] bg-[#1f9d6a]/[0.12] text-[#1f9d6a]"
                                                      : "grid size-[34px] shrink-0 place-items-center rounded-[9px] bg-muted text-muted-foreground"
                                            }
                                        >
                                            <Check className="size-4" strokeWidth={1.75} />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold">{row.label}</span>
                                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                                {skipped ? "Skipped · reason logged" : "Resolved"}
                                            </span>
                                        </span>

                                        <span className="text-[14.5px] font-bold">{row.value}</span>

                                        <button
                                            type="button"
                                            onClick={() => setCurrent(targetIndex)}
                                            className="text-[12.5px] font-semibold text-primary"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            }
        }
    })()

    if (completed) {
        return (
            <div className="grid min-h-[calc(100vh-65px)] grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
                <WizardNav />
                <main className="px-4 py-7 sm:px-10">
                    <div className="flex flex-col items-center px-5 py-16 text-center">
                        <span className="mb-3 grid size-16 place-items-center rounded-full bg-[#1f9d6a]/[0.12] text-[#1f9d6a]">
                            <Check className="size-8" strokeWidth={2} />
                        </span>
                        <h1 className="text-[22px] font-bold">August 2026 report submitted</h1>
                        <p className="mt-2 max-w-[40ch] text-sm text-muted-foreground">
                            It can be reopened during the grace period if changes are needed. After that, it locks and becomes read-only.
                        </p>
                        <button
                            type="button"
                            onClick={onBackToHub}
                            className="mt-6 rounded-[11px] bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                        >
                            Back to Create
                        </button>
                    </div>
                </main>
                <aside className="border-l border-border p-5 xl:block">
                    <div className="sticky top-[88px]">
                        <StepTracker steps={steps} current={current} onJump={setCurrent} />
                    </div>
                </aside>
            </div>
        )
    }

    return (
        <>
            <div className="grid min-h-[calc(100vh-65px)] grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
                <WizardNav />

                <main className="flex min-h-[calc(100vh-65px)] flex-col px-4 pt-7 sm:px-10">
                    <div className="mb-[22px] flex items-center justify-between">
                        <div className="text-[12.5px] text-muted-foreground">
                            <strong className="font-semibold text-foreground">{currentStep.title}</strong>
                            {" · "}August 2026 report
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            <span
                                className={
                                    saveState === "saving"
                                        ? "size-1.5 animate-pulse rounded-full bg-[#c8891a]"
                                        : "size-1.5 rounded-full bg-[#1f9d6a]"
                                }
                            />
                            {saveState === "saving" ? "Saving…" : "All changes saved"}
                        </div>
                    </div>

                    <div className="flex-1 pb-8">{section}</div>

                    <div className="sticky bottom-0 mt-6 flex items-center justify-between border-t border-border bg-background/90 py-4 backdrop-blur-md">
                        <button
                            type="button"
                            disabled={current === 0}
                            onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                            className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-card px-4 py-2.5 text-[13.5px] font-semibold text-card-foreground transition hover:border-primary/40 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                        >
                            <ArrowLeft className="size-[15px]" />
                            Back
                        </button>

                        <div className="flex items-center gap-2.5">
                            {currentStep.key === "variable" && !variableSkipped && (
                                <button
                                    type="button"
                                    onClick={() => setSkipModalOpen(true)}
                                    className="px-1.5 py-2.5 text-[13.5px] font-semibold text-muted-foreground transition hover:text-foreground"
                                >
                                    Skip this section
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleContinue}
                                className="inline-flex items-center gap-2 rounded-[11px] bg-primary px-6 py-3 text-[14.5px] font-bold text-primary-foreground transition hover:bg-primary/90"
                            >
                                {current === steps.length - 1 ? "Submit report" : "Save & continue"}
                                <ArrowRight className="size-[15px]" strokeWidth={2.25} />
                            </button>
                        </div>
                    </div>
                </main>

                <aside className="border-l border-border p-5">
                    <div className="sticky top-[88px]">
                        <StepTracker steps={steps} current={current} onJump={setCurrent} />
                    </div>
                </aside>
            </div>

            <SkipModal
                open={skipModalOpen}
                onClose={() => setSkipModalOpen(false)}
                onConfirm={handleSkipVariable}
            />
        </>
    )
}

function WizardNav() {
    const navGroups = [
        {
            label: "Create",
            items: [
                [FileText, "Report wizard", true],
                [LayoutTemplate, "Templates", false],
            ],
        },
        {
            label: "Members",
            items: [
                [Users, "Members", false],
                [Home, "Households", false],
            ],
        },
        {
            label: "Finance",
            items: [[Landmark, "Assets", false]],
        },
        {
            label: "Engagement",
            items: [[UsersRound, "Homecells", false]],
        },
    ] as const

    return (
        <nav className="hidden border-r border-border px-3.5 py-6 xl:flex xl:flex-col xl:gap-[22px]">
            {navGroups.map((group) => (
                <div key={group.label}>
                    <div className="mb-1.5 px-2.5 text-[11px] font-bold uppercase tracking-[0.04em] text-muted-foreground">
                        {group.label}
                    </div>
                    {group.items.map(([Icon, label, active]) => (
                        <a
                            href="#"
                            key={label}
                            className={
                                active
                                    ? "flex items-center gap-2.5 rounded-[9px] bg-primary/15 px-2.5 py-2 text-[13.5px] font-semibold text-primary"
                                    : "flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13.5px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            }
                        >
                            <Icon className="size-[17px] shrink-0" strokeWidth={1.75} />
                            {label}
                        </a>
                    ))}
                </div>
            ))}
        </nav>
    )
}

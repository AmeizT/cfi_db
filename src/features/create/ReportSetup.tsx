"use client"

import { useState } from "react"
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckSquare2,
    ChevronDown,
    FileText,
    PenLine,
} from "lucide-react"

import type { SetupTab } from "./types"

type ReportSetupProps = {
    initialTab: SetupTab
    onBack: () => void
    onContinue: () => void
}

const setupSteps = [
    ["Attendance", "Not started"],
    ["Sunday school", "Not started"],
    ["Tithes", "Not started"],
    ["Other revenue", "Not started"],
    ["Overhead expenses", "Not started"],
    ["Variable expenses", "Optional"],
    ["Review & submit", "Not started"],
]

export function ReportSetup({ initialTab, onBack, onContinue }: ReportSetupProps) {
    const [tab, setTab] = useState<SetupTab>(initialTab)
    const [method, setMethod] = useState<"blank" | "copy">("blank")

    return (
        <main className="flex-1">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-10 px-4 pb-20 pt-8 sm:px-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    <button
                        type="button"
                        onClick={onBack}
                        className="mb-5 inline-flex items-center gap-2 py-1 text-[13.5px] font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-[15px]" />
                        Back to Create
                    </button>

                    <div className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row">
                        <h1 className="text-[26px] font-bold tracking-[-0.01em]">
                            Create monthly report{" "}
                            <span className="font-normal text-muted-foreground">· August 2026</span>
                        </h1>

                        <button
                            type="button"
                            className="flex items-center gap-2 whitespace-nowrap rounded-[10px] border border-border bg-card px-3 py-2 text-[13.5px] font-medium text-card-foreground transition hover:border-primary/40"
                        >
                            <CalendarDays className="size-[15px]" strokeWidth={1.75} />
                            August 2026
                            <ChevronDown className="size-3" />
                        </button>
                    </div>

                    <div className="mb-[22px] inline-flex gap-0.5 rounded-[10px] bg-muted p-1">
                        {(["manual", "uploads"] as const).map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setTab(value)}
                                className={
                                    tab === value
                                        ? "rounded-lg bg-card px-4 py-2 text-[13.5px] font-semibold text-card-foreground shadow-sm"
                                        : "rounded-lg px-4 py-2 text-[13.5px] font-semibold capitalize text-muted-foreground"
                                }
                            >
                                {value === "manual" ? "Manual" : "Uploads"}
                            </button>
                        ))}
                    </div>

                    <div className="mb-7 grid gap-3.5 md:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setMethod("blank")}
                            className={
                                method === "blank"
                                    ? "flex items-start gap-3.5 rounded-[14px] border-[1.5px] border-primary bg-primary/10 p-5 text-left ring-4 ring-primary/10"
                                    : "flex items-start gap-3.5 rounded-[14px] border-[1.5px] border-border p-5 text-left transition hover:border-primary hover:bg-primary/10"
                            }
                        >
                            <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-primary/15 text-primary">
                                <PenLine className="size-[19px]" strokeWidth={1.75} />
                            </span>
                            <span>
                                <span className="block text-[15px] font-semibold">Start from blank</span>
                                <span className="mt-1 block text-[13px] leading-[1.5] text-muted-foreground">
                                    Step through attendance, tithes, and expenses one section at a time.
                                </span>
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMethod("copy")}
                            className={
                                method === "copy"
                                    ? "flex items-start gap-3.5 rounded-[14px] border-[1.5px] border-primary bg-primary/10 p-5 text-left ring-4 ring-primary/10"
                                    : "flex items-start gap-3.5 rounded-[14px] border-[1.5px] border-border p-5 text-left transition hover:border-primary hover:bg-primary/10"
                            }
                        >
                            <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-primary/15 text-primary">
                                <FileText className="size-[19px]" strokeWidth={1.75} />
                            </span>
                            <span>
                                <span className="block text-[15px] font-semibold">Copy last month</span>
                                <span className="mt-1 block text-[13px] leading-[1.5] text-muted-foreground">
                                    Pre-fill figures from July 2026 to adjust rather than re-enter.
                                </span>
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-1.5 rounded-[14px] border border-border bg-card px-8 py-10 text-center text-card-foreground">
                        <span className="mb-2.5 grid size-[52px] place-items-center rounded-[14px] bg-muted text-foreground">
                            <CheckSquare2 className="size-6" strokeWidth={1.75} />
                        </span>
                        <h2 className="text-base font-semibold">Ready to begin Attendance</h2>
                        <p className="mb-5 max-w-[40ch] text-[13.5px] leading-[1.55] text-muted-foreground">
                            The wizard opens on the first unresolved section — attendance for August 2026 — and autosaves as you go.
                        </p>
                        <button
                            type="button"
                            onClick={onContinue}
                            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:gap-3 hover:bg-primary/90"
                        >
                            Continue to Attendance
                            <ArrowRight className="size-[15px]" strokeWidth={2.25} />
                        </button>
                    </div>
                </div>

                <aside className="rounded-[14px] border border-border bg-card p-5 text-card-foreground">
                    <div className="text-xs text-muted-foreground">Report wizard</div>
                    <h2 className="mt-0.5 text-base font-bold">August 2026 report</h2>
                    <p className="mb-4 text-[12.5px] text-muted-foreground">Step 1 of 7 · 0 resolved</p>

                    <div className="flex flex-col">
                        {setupSteps.map(([title, state], index) => (
                            <div key={title} className="relative flex items-center gap-3 px-0.5 py-[9px]">
                                <span
                                    className={
                                        index === 0
                                            ? "relative z-10 grid size-[26px] shrink-0 place-items-center rounded-full border-[1.5px] border-primary bg-primary text-xs font-bold text-primary-foreground"
                                            : "relative z-10 grid size-[26px] shrink-0 place-items-center rounded-full border-[1.5px] border-border bg-muted text-xs font-bold text-muted-foreground"
                                    }
                                >
                                    {index + 1}
                                </span>
                                {index > 0 && (
                                    <span className="absolute left-[13px] top-0 h-1/2 w-[1.5px] bg-border" />
                                )}
                                {index < setupSteps.length - 1 && (
                                    <span className="absolute bottom-0 left-[13px] h-1/2 w-[1.5px] bg-border" />
                                )}
                                <span className="flex-1">
                                    <span
                                        className={
                                            index === 0
                                                ? "block text-[13.5px] font-semibold text-primary"
                                                : "block text-[13.5px] font-semibold"
                                        }
                                    >
                                        {title}
                                    </span>
                                    <span
                                        className={
                                            index === 0
                                                ? "block text-[11.5px] text-primary"
                                                : "block text-[11.5px] text-muted-foreground"
                                        }
                                    >
                                        {state}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-3.5 rounded-[10px] bg-muted px-3.5 py-3 text-xs leading-[1.5] text-muted-foreground">
                        Submitted reports can be reopened during the grace period. Once locked, they become read-only.
                    </div>
                </aside>
            </div>
        </main>
    )
}

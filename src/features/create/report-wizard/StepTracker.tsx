"use client"

import { Check } from "lucide-react"

import type { WizardStep } from "../types"

type StepTrackerProps = {
    steps: WizardStep[]
    current: number
    onJump: (index: number) => void
}

export function StepTracker({ steps, current, onJump }: StepTrackerProps) {
    const resolved = steps.filter(
        (step) => step.status === "submitted" || step.status === "skipped",
    ).length

    return (
        <div>
            <div className="text-xs text-muted-foreground">Report wizard</div>
            <h2 className="mt-0.5 text-base font-bold">August 2026 report</h2>
            <p className="mb-4 text-[12.5px] text-muted-foreground">
                Step {current + 1} of {steps.length} · {resolved} resolved
            </p>

            <div className="flex flex-col">
                {steps.map((step, index) => {
                    const done = step.status === "submitted" || step.status === "skipped"
                    const active = index === current
                    const state =
                        step.status === "submitted"
                            ? "Submitted"
                            : step.status === "skipped"
                              ? "Skipped"
                              : step.optional
                                ? "Optional"
                                : "Not started"

                    return (
                        <button
                            key={step.key}
                            type="button"
                            onClick={() => onJump(index)}
                            className="relative flex items-center gap-3 px-0.5 py-[9px] text-left"
                        >
                            <span
                                className={
                                    done
                                        ? "relative z-10 grid size-[26px] shrink-0 place-items-center rounded-full border-[1.5px] border-[#1f9d6a] bg-[#1f9d6a] text-xs font-bold text-white"
                                        : active
                                          ? "relative z-10 grid size-[26px] shrink-0 place-items-center rounded-full border-[1.5px] border-primary bg-primary text-xs font-bold text-primary-foreground"
                                          : "relative z-10 grid size-[26px] shrink-0 place-items-center rounded-full border-[1.5px] border-border bg-muted text-xs font-bold text-muted-foreground"
                                }
                            >
                                {done ? <Check className="size-3" strokeWidth={3} /> : index + 1}
                            </span>

                            {index > 0 && (
                                <span className="absolute left-[13px] top-0 h-1/2 w-[1.5px] bg-border" />
                            )}
                            {index < steps.length - 1 && (
                                <span className="absolute bottom-0 left-[13px] h-1/2 w-[1.5px] bg-border" />
                            )}

                            <span className="flex-1">
                                <span
                                    className={
                                        active
                                            ? "block text-[13.5px] font-semibold text-primary"
                                            : "block text-[13.5px] font-semibold"
                                    }
                                >
                                    {step.title}
                                </span>
                                <span
                                    className={
                                        done
                                            ? "block text-[11.5px] text-[#1f9d6a]"
                                            : active
                                              ? "block text-[11.5px] text-primary"
                                              : "block text-[11.5px] text-muted-foreground"
                                    }
                                >
                                    {state}
                                </span>
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="mt-3.5 rounded-[10px] bg-muted px-3.5 py-3 text-xs leading-[1.5] text-muted-foreground">
                Submitted reports can be reopened during the grace period. Once locked, they become read-only.
            </div>
        </div>
    )
}

"use client"

import Link from "next/link"
import { CheckIcon } from "lucide-react"
import { useLayoutEffect, useRef } from "react"


import {
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperTitle,
    StepperTrigger,
} from "@/components/ui/stepper"
import { cn } from "@/utils/cn"

import {
    createReportWizardHref as createWizardHref,
    type ReportWizardReport,
    type ReportWizardSection,
    type ReportWizardSectionSnapshot,
} from "@/features/report-wizard/config/report-types"
import { usePathname } from "next/navigation";

interface ReportWizardStepperProps {
    steps: ReportWizardSection[]
    current: ReportWizardSection
    sections: ReportWizardSectionSnapshot[]
    report: ReportWizardReport | null
}

type StepVisualState = "active" | "completed" | "skipped" | "pending"

const itemStyles: Record<StepVisualState, string> = {
    active: cn(
        "!border-blue-200",
        "!bg-blue-100",
        "!text-blue-800",
        "dark:!border-blue-800",
        "dark:!bg-blue-950",
        "dark:!text-blue-300"
    ),
    completed: cn(
        "!border-emerald-200",
        "!bg-emerald-100",
        "!text-emerald-700",
        "dark:!border-emerald-800",
        "dark:!bg-emerald-950",
        "dark:!text-emerald-300"
    ),
    skipped: cn(
        "!border-amber-200",
        "!bg-amber-100",
        "!text-amber-700",
        "dark:!border-amber-800",
        "dark:!bg-amber-950",
        "dark:!text-amber-300"
    ),
    pending: cn(
        "!border-zinc-200",
        "!bg-zinc-100 hover:!bg-zinc-50",
        "!text-zinc-700",
        "dark:!border-neutral-900",
        "dark:!bg-neutral-900",
        "dark:!text-neutral-300"
    ),
}

const indicatorStyles: Record<StepVisualState, string> = {
    active: cn(
        "!border-blue-700",
        "!bg-blue-700",
        "!text-white"
    ),
    completed: cn(
        "!border-emerald-700",
        "!bg-emerald-700",
        "!text-white"
    ),
    skipped: cn(
        "!border-amber-700",
        "!bg-amber-700",
        "!text-white"
    ),
    pending: cn(
        "!border-white dark:!border-neutral-800",
        "!bg-white shadow-md dark:!bg-neutral-800",
        "!text-zinc-600 dark:!text-neutral-100"
    ),
}

export default function ReportWizardStepper({
    steps,
    current,
    sections,
    report,
}: ReportWizardStepperProps) {
    const pathname = usePathname()
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const currentStepIndex = steps.findIndex(
        (section) => section.id === current.id
    )

    const currentStep = Math.max(currentStepIndex + 1, 1)

    const scrollStorageKey = `report-wizard-stepper-scroll-${
        report?.id ?? "new"
    }`

    function saveScrollPosition() {
        const container = scrollContainerRef.current

        if (!container) return

        sessionStorage.setItem(
            scrollStorageKey,
            String(container.scrollLeft)
        )
    }

    useLayoutEffect(() => {
        const container = scrollContainerRef.current

        if (!container) return

        const savedPosition = Number(
            sessionStorage.getItem(scrollStorageKey) ?? 0
        )

        let secondFrame = 0

        const firstFrame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => {
                container.scrollTo({
                    left: savedPosition,
                    behavior: "instant",
                })
            })
        })

        return () => {
            cancelAnimationFrame(firstFrame)
            cancelAnimationFrame(secondFrame)
        }
    }, [pathname, scrollStorageKey])

    return (
        <div
            ref={scrollContainerRef}
            onScroll={saveScrollPosition}
            className={cn(
                "w-full min-w-0 overflow-x-auto overscroll-x-contain pb-2",
                "snap-x snap-mandatory scroll-smooth scroll-px-3 no-scrollbar"
            )}
        >
            <Stepper
                value={currentStep}
                orientation="horizontal"
                className={cn(
                    "w-full min-w-0 items-stretch gap-1",
                )}
            >
                {steps.map((section, index) => {
                    const step = index + 1

                    const snapshot = sections.find(
                        (item) => item.name === section.backendId
                    )

                    const active = section.id === current.id
                    const completed = snapshot?.status === "submitted"
                    const skipped = snapshot?.status === "skipped"

                    /*
                    * Completed and skipped take precedence over active.
                    * Therefore, an active completed step remains emerald.
                    */
                    const visualState: StepVisualState = completed
                        ? "completed"
                        : skipped
                        ? "skipped"
                        : active
                            ? "active"
                            : "pending"

                    const description = completed
                        ? "Completed"
                        : skipped
                        ? "Skipped"
                        : active
                            ? "Current section"
                            : "Not completed"

                    return (
                        <StepperItem
                            key={section.id}
                            step={step}
                            className={cn(
                                "relative min-w-0 self-stretch",
                                "flex-[1_0_14rem] sm:flex-[1_0_15rem]",
                                "snap-start rounded-xl border-0",
                                itemStyles[visualState]
                            )}
                        >
                            <StepperTrigger asChild>
                                <Link
                                    href={createWizardHref(section.id, {
                                        method: "manual-entry",
                                        report_id: report?.id,
                                    })}
                                    scroll={false}
                                    onPointerDown={saveScrollPosition}
                                    onClick={saveScrollPosition}
                                    aria-current={active ? "step" : undefined}
                                    className={cn(
                                        "group flex h-full w-full items-center gap-3",
                                        "rounded-xl px-3 py-3 text-left outline-none",
                                        "focus-visible:ring-2",
                                        "focus-visible:ring-ring",
                                        "focus-visible:ring-offset-2"
                                    )}
                                >
                                    <StepperIndicator
                                        className={cn(
                                            "relative z-10 size-7 shrink-0",
                                            "border text-xs font-semibold",
                                            indicatorStyles[visualState]
                                        )}
                                    >
                                        {completed ? (
                                            <CheckIcon className="size-4 text-white" />
                                        ) : (
                                            <span>{step}</span>
                                        )}
                                    </StepperIndicator>

                                    <span className="flex min-w-0 flex-col">
                                        <StepperTitle
                                            className={cn(
                                                "truncate text-sm text-current",
                                                active
                                                    ? "font-semibold"
                                                    : "font-medium"
                                            )}
                                        >
                                            {section.label}
                                        </StepperTitle>

                                        <StepperDescription className="text-xs text-current opacity-70">
                                            {description}
                                        </StepperDescription>
                                    </span>
                                </Link>
                            </StepperTrigger>
                        </StepperItem>
                    )
                })}
            </Stepper>
        </div>
    )
}
"use client"

import { cn } from "@/utils/cn"

export type GaugeStatus =
    | "stable"
    | "watch"
    | "at_risk"
    | "critical"

interface GaugeLevel {
    value: GaugeStatus
    label: string
    shortDescription: string
    arcClassName: string
    dotClassName: string
    badgeClassName: string
}

const GAUGE_LEVELS: GaugeLevel[] = [
    {
        value: "stable",
        label: "Stable",
        shortDescription: "Everything is within the expected range.",
        arcClassName: "stroke-emerald-500",
        dotClassName: "bg-emerald-500",
        badgeClassName:
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
    {
        value: "watch",
        label: "Watch",
        shortDescription: "Some indicators require monitoring.",
        arcClassName: "stroke-amber-400",
        dotClassName: "bg-amber-400",
        badgeClassName:
            "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    },
    {
        value: "at_risk",
        label: "At risk",
        shortDescription: "Material issues require attention.",
        arcClassName: "stroke-orange-500",
        dotClassName: "bg-orange-500",
        badgeClassName:
            "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    },
    {
        value: "critical",
        label: "Critical",
        shortDescription: "Immediate intervention is required.",
        arcClassName: "stroke-red-500",
        dotClassName: "bg-red-500",
        badgeClassName:
            "bg-red-500/10 text-red-700 dark:text-red-300",
    },
]

interface StatusGaugeProps {
    title: string
    status: GaugeStatus
    description?: string
    showArcLabels?: boolean
    showLegend?: boolean
    className?: string
}

const CENTER_X = 140
const CENTER_Y = 132

const ARC_RADIUS = 86
const LABEL_RADIUS = 116

const START_ANGLE = -180
const TOTAL_ANGLE = 180

const SEGMENT_ANGLE = TOTAL_ANGLE / GAUGE_LEVELS.length
const SEGMENT_GAP = 5

function getPoint(angle: number, radius: number) {
    const radians = (angle * Math.PI) / 180

    return {
        x: CENTER_X + radius * Math.cos(radians),
        y: CENTER_Y + radius * Math.sin(radians),
    }
}

function createArcPath(startAngle: number, endAngle: number) {
    const start = getPoint(startAngle, ARC_RADIUS)
    const end = getPoint(endAngle, ARC_RADIUS)

    return [
        `M ${start.x} ${start.y}`,
        `A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${end.x} ${end.y}`,
    ].join(" ")
}

export function StatusGauge({
    title,
    status,
    description,
    showArcLabels = true,
    showLegend = true,
    className,
}: StatusGaugeProps) {
    const activeIndex = GAUGE_LEVELS.findIndex(
        (level) => level.value === status
    )

    const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex
    const activeLevel = GAUGE_LEVELS[safeActiveIndex]

    /*
     * The needle begins by pointing left.
     * Each status rotates it toward the centre of its segment.
     */
    const needleRotation =
        safeActiveIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2

    return (
        <section
            className={cn(
                "rounded-2xl border border-border-subtle shadow-elevation-01 bg-linear-to-b from-background via-purple-50/70 to-orange-50/80 p-5",
                className
            )}
        >
            <div>
                <h3 className="text-sm font-semibold text-foreground">
                    {title}
                </h3>

                {description && (
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div className="mt-4">
                <svg
                    viewBox="0 0 280 158"
                    role="meter"
                    aria-label={`${title}: ${activeLevel.label}`}
                    aria-valuemin={1}
                    aria-valuemax={GAUGE_LEVELS.length}
                    aria-valuenow={safeActiveIndex + 1}
                    aria-valuetext={activeLevel.label}
                    className="mx-auto w-full max-w-sm overflow-visible"
                >
                    <title>
                        {title}: {activeLevel.label}
                    </title>

                    {GAUGE_LEVELS.map((level, index) => {
                        const segmentStart =
                            START_ANGLE +
                            index * SEGMENT_ANGLE +
                            SEGMENT_GAP / 2

                        const segmentEnd =
                            START_ANGLE +
                            (index + 1) * SEGMENT_ANGLE -
                            SEGMENT_GAP / 2

                        const segmentCenter =
                            START_ANGLE +
                            index * SEGMENT_ANGLE +
                            SEGMENT_ANGLE / 2

                        const labelPosition = getPoint(
                            segmentCenter,
                            LABEL_RADIUS
                        )

                        const labelRotation = segmentCenter + 90
                        const isActive = level.value === activeLevel.value

                        return (
                            <g key={level.value}>
                                <path
                                    d={createArcPath(
                                        segmentStart,
                                        segmentEnd
                                    )}
                                    fill="none"
                                    strokeWidth={isActive ? 30 : 26}
                                    strokeLinecap="round"
                                    className={cn(
                                        level.arcClassName,
                                        "transition-all duration-300",
                                        isActive
                                            ? "opacity-100"
                                            : "opacity-45"
                                    )}
                                />

                                {showArcLabels && (
                                    <text
                                        x={labelPosition.x}
                                        y={labelPosition.y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        transform={`rotate(
                                            ${labelRotation}
                                            ${labelPosition.x}
                                            ${labelPosition.y}
                                        )`}
                                        className={cn(
                                            "fill-muted-foreground text-[8px] font-semibold uppercase tracking-[0.08em]",
                                            isActive &&
                                                "fill-foreground font-bold"
                                        )}
                                    >
                                        {level.label}
                                    </text>
                                )}
                            </g>
                        )
                    })}

                    <g
                        className="transition-transform duration-500 ease-out motion-reduce:transition-none"
                        style={{
                            transform: `rotate(${needleRotation}deg)`,
                            transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                        }}
                    >
                        <line
                            x1={CENTER_X - 2}
                            y1={CENTER_Y}
                            x2={CENTER_X - 66}
                            y2={CENTER_Y}
                            strokeWidth={5}
                            strokeLinecap="round"
                            className="stroke-zinc-500 dark:stroke-neutral-700"
                        />
                    </g>

                    <circle
                        cx={CENTER_X}
                        cy={CENTER_Y}
                        r={12}
                        className="fill-zinc-300 dark:fill-neutral-800"
                    />

                    <circle
                        cx={CENTER_X}
                        cy={CENTER_Y}
                        r={4}
                        className="fill-background"
                    />
                </svg>
            </div>

            <div className="text-center">
                <span
                    className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        activeLevel.badgeClassName
                    )}
                >
                    {activeLevel.label}
                </span>

                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
                    {activeLevel.shortDescription}
                </p>
            </div>

            {showLegend && (
                <div
                    className="mt-5 w-full flex flex-wrap justify-center gap-x-3 gap-y-2 border-t border-border-subtle pt-4"
                    aria-label="Gauge status key"
                >
                    {GAUGE_LEVELS.map((level) => {
                        const isActive =
                            level.value === activeLevel.value

                        return (
                            <div
                                key={level.value}
                                className={cn(
                                    "flex items-center gap-1.5 text-xs text-muted-foreground transition-colors",
                                    isActive &&
                                        "font-semibold text-foreground"
                                )}
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        "size-2.5 rounded-full",
                                        level.dotClassName,
                                        !isActive && "opacity-55"
                                    )}
                                />

                                <span>{level.label}</span>
                            </div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
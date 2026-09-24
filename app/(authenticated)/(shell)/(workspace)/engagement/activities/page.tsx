"use client"

import { WorkspaceEngagementView } from "@/features/workspace/views/WorkspaceEngagementView"
import { Fur } from 'feral-fur'
import 'feral-fur/fur.css'

export default function Page() { 
    return <div className="h-dvh w-dvw grid  place-content-center">
        <ExpandingCard /> 
        <Mpaint />
    </div>
}



  
import MetallicPaint from "@/components/MetallicPaint"


export function Mpaint() {
  return (
    <div style={{ width: '100%', height: '200px' }}>
      <MetallicPaint
        imageSrc={"/brand/ehc.png"}
        // Pattern
        seed={42}
        scale={4}
        patternSharpness={1}
        noiseScale={0.5}
        // Animation
        speed={0.3}
        liquid={0.75}
        mouseAnimation={false}
        // Visual
        brightness={2}
        contrast={0.5}
        refraction={0.01}
        blur={0.015}
        chromaticSpread={2}
        fresnel={1}
        angle={0}
        waveAmplitude={1}
        distortion={1}
        contour={0.2}
        // Colors
        lightColor="#ffffff"
        darkColor="#5EBE7E"
        tintColor="#5EBE7E"
      />
    </div>
  );
}

import * as React from "react"
import { UserRound } from "lucide-react"

import { cn } from "@/lib/utils"


const tabs = [
    "Overview",
    "Subscribers",
    "Activity",
    "Monetization",
] as const

type Tab = (typeof tabs)[number]


export function DashboardPreview() {
    const [activeTab, setActiveTab] =
        React.useState<Tab>("Overview")

    return (
        <div className="w-full max-w-5xl space-y-8 bg-[#0f0f12] p-8 text-white">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Hey hey 👋
                </h1>

                <p className="mt-2 text-base text-white/50">
                    Here&apos;s a quick snapshot of how your publication is performing.
                </p>
            </div>

            <SegmentedTabs
                value={activeTab}
                onValueChange={setActiveTab}
            />

            <StatCard />
        </div>
    )
}


function SegmentedTabs({
    value,
    onValueChange,
}: {
    value: Tab
    onValueChange: (value: Tab) => void
}) {
    return (
        <div
            role="tablist"
            aria-label="Dashboard views"
            className="
                inline-flex
                overflow-hidden
                rounded-lg
                border
                border-white/10
                bg-[#17171c]
                shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
            "
        >
            {tabs.map((tab, index) => {
                const active = value === tab

                return (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onValueChange(tab)}
                        className={cn(
                            `
                                relative
                                h-10
                                min-w-32
                                px-5
                                text-sm
                                font-medium
                                transition-all
                                duration-150
                                outline-none
                                focus-visible:z-10
                                focus-visible:ring-2
                                focus-visible:ring-white/20
                            `,
                            index !== 0 &&
                                "border-l border-white/10",
                            active
                                ? `
                                    bg-[linear-gradient(to_bottom,#28282f,#1d1d23)]
                                    text-white
                                    shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.35)]
                                `
                                : `
                                    bg-[linear-gradient(to_bottom,#1c1c22,#17171c)]
                                    text-white/50
                                    hover:text-white/75
                                    hover:bg-[#202026]
                                `
                        )}
                    >
                        {tab}
                    </button>
                )
            })}
        </div>
    )
}


function StatCard() {
    return (
        <div
            className="
                w-full
                rounded-2xl
                border
                border-white/8
                bg-[#151518]
                p-6
                shadow-[0_10px_30px_rgba(0,0,0,0.18)]
            "
        >
            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        size-11
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-black/80
                        bg-[linear-gradient(to_bottom,#29292f,#1b1b20)]
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.5)]
                    "
                >
                    <UserRound
                        className="size-5 text-white"
                        strokeWidth={2.25}
                    />
                </div>

                <span className="text-base font-medium text-white/65">
                    Current Subscribers
                </span>
            </div>

            <div className="mt-7 flex items-end justify-between gap-6">
                <div className="flex items-end gap-3">
                    <span className="text-5xl font-medium leading-none tracking-tight">
                        6
                    </span>

                    <span className="pb-1 text-base text-white/45">
                        from 0 (last 4 weeks)
                    </span>
                </div>

                <div
                    className="
                        rounded-full
                        bg-emerald-500/20
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        text-emerald-400
                    "
                >
                    +100%
                </div>
            </div>
        </div>
    )
}




import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "motion/react"

export function ExpandingCard() {
    const [expanded, setExpanded] = React.useState(false)
    const reduceMotion = useReducedMotion()

    return (
        <motion.div
            layout
            onClick={() => setExpanded((value) => !value)}
            className="
                relative
                cursor-pointer
                overflow-hidden
                bg-zinc-100
                border-0
                shadow-none
            "
            animate={{
                width: expanded ? 520 : 220,
                height: expanded ? 320 : 52,
                borderRadius: expanded ? 24 : 999,
            }}
            transition={
                reduceMotion
                    ? { duration: 0 }
                    : {
                          layout: {
                              type: "spring",
                              stiffness: 420,
                              damping: 36,
                              mass: 0.8,
                          },
                          width: {
                              type: "spring",
                              stiffness: 420,
                              damping: 36,
                          },
                          height: {
                              type: "spring",
                              stiffness: 420,
                              damping: 36,
                          },
                          borderRadius: {
                              duration: 0.25,
                              ease: [0.22, 1, 0.36, 1],
                          },
                      }
            }
        >
            <AnimatePresence
                initial={false}
                mode="popLayout"
            >
                {!expanded ? (
                    <motion.div
                        key="collapsed"
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{
                            opacity: 0,
                            filter: "blur(6px)",
                            scale: 0.96,
                        }}
                        animate={{
                            opacity: 1,
                            filter: "blur(0px)",
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            filter: "blur(8px)",
                            scale: 0.96,
                        }}
                        transition={{
                            duration: 0.18,
                            ease: "easeOut",
                        }}
                    >
                        <span className="text-sm font-medium">
                            Pay $24.00
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="expanded"
                        className="absolute inset-0 p-6"
                        initial={{
                            opacity: 0,
                            filter: "blur(10px)",
                            scale: 0.97,
                        }}
                        animate={{
                            opacity: 1,
                            filter: "blur(0px)",
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            filter: "blur(8px)",
                            scale: 0.98,
                        }}
                        transition={{
                            duration: 0.24,
                            delay: 0.07,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <ExpandedContent />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function ExpandedContent() {
    return (
        <div className="space-y-5">
            <div>
                <p className="text-sm text-muted-foreground">
                    Payment
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                    Complete payment
                </h2>
            </div>


            

            <Fur text="ellerie" className="text-sm" style={{ width: 200, aspectRatio: '10 / 3', }} fluff={0.5} color="var(--assembly-theme-600)" />

            <div className="rounded-xl bg-muted p-4">
                Order total
                <span className="float-right font-semibold">
                    $24.00
                </span>
            </div>

            <button
    className="
        active-glass
        relative
        flex h-11 w-full
        items-center gap-3
        px-4
        text-sm font-medium
    "
>
    

    <span className="relative z-10">
        Continue
    </span>
</button>
        </div>
    )
}






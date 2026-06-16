"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

export function PremiumThemePreview({
    mode,
}: {
    mode: "light" | "dark" | "system"
}) {
    const [hover, setHover] = useState(false)

    // Only system preview animates between light/dark
    const previewMode =
        mode === "system"
            ? hover
                ? "dark"
                : "light"
            : mode

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={cn(
                "rounded-lg border border-border overflow-hidden",
                "transition-colors"
            )}
        >
            <div
                className={cn(
                    "flex bg-background",
                    previewMode === "dark" && "dark"
                )}
            >
                {/* NAV RAIL */}
                <div className="w-4 border-r border-border bg-muted/30 flex flex-col items-center py-1 gap-1">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/60" />
                </div>

                {/* DASHBOARD CONTENT */}
                <div className="flex-1 p-2 space-y-2">

                    {/* Stat cards */}
                    <div className="grid grid-cols-3 gap-1">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="bg-card border border-border rounded h-5"
                                whileHover={{ y: -1 }}
                            />
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="bg-card border border-border rounded p-1 h-12 flex items-end justify-between">
                        {[28, 20, 40, 32, 12].map((h, i) => (
                            <motion.div
                                key={i}
                                className="bg-primary/70 rounded-sm w-[3px]"
                                animate={{ height: hover ? h : 8 }}
                                transition={{ duration: 0.35 }}
                            />
                        ))}
                    </div>

                    {/* Table */}
                    <div className="space-y-1">
                        {[1, 2, 3].map((row) => (
                            <motion.div
                                key={row}
                                className="flex gap-1"
                                animate={{ x: hover ? 1 : 0 }}
                            >
                                <div className="h-2 flex-1 bg-muted rounded" />
                                <div className="h-2 w-6 bg-muted rounded" />
                                <div className="h-2 w-4 bg-muted rounded" />
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}
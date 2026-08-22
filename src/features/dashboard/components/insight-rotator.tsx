"use client"

import { useEffect, useState } from "react"

import { cn } from "@/utils/cn"
import { Text } from "@/components/ui/text"

type Props = {
    title?: string
    messages: string[]
    interval?: number
}

export function InsightRotator({
    title,
    messages,
    interval = 3500,
}: Props) {
    const [visible, setVisible] = useState(true)
    const [paused, setPaused] = useState(false)
    const [index, setIndex] = useState(0)

    const safeIndex = index % (messages?.length || 1)

    useEffect(() => {
        if (!messages.length || paused) return

        const cycle = setInterval(() => {
            setVisible(false)

            const timeout = setTimeout(() => {
                setIndex((prev) => (prev + 1) % messages.length)
                setVisible(true)
            }, 400)

            return () => clearTimeout(timeout)
        }, interval)

        return () => clearInterval(cycle)
    }, [messages.length, interval, paused])

    if (!messages.length) return null

    return (
        <div
            className="mx-auto w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <div className="relative flex min-h-6 w-full items-center justify-center">
                <div
                    className={cn(
                        "w-full text-center transition-all duration-400 ease-in-out",
                        visible
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-1 opacity-0"
                    )}
                >
                    {title && (
                        <span className="mr-2 text-sm font-semibold">
                            {title}
                        </span>
                    )}

                    <Text
                        key={safeIndex}
                        variant="generate-effect"
                        className="text-center text-muted-foreground"
                    >
                        {messages[safeIndex]}
                    </Text>
                </div>
            </div>

            {messages.length > 1 && (
                <div className="mt-2 hidden gap-1">
                    {messages.map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                "size-1.5 rounded-full transition-all",
                                i === index
                                    ? "bg-primary"
                                    : "bg-muted-foreground/30"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
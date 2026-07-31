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

        setTimeout(() => {
            setIndex((prev) => (prev + 1) % messages.length)
            setVisible(true)
        }, 400) // matches animation duration
        }, interval)

        return () => clearInterval(cycle)
    }, [messages.length, interval, paused])

    if (!messages.length) return null

    return (
        <div
            className="w-full max-w-auto mx-auto"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* {title && (
                <p className="text-sm text-muted-foreground mb-1">
                {title}
                </p>
            )} */}

        <div className="mx-auto inline-block relative h-6 overflow-hidden">
            <Text
                key={safeIndex} // 🔥 THIS triggers animation on change
                variant="generate-effect"
                className="text-muted-foreground"
                >
                {messages[safeIndex]}
            </Text>
            
            <p className="text-sm">
                <span className="font-semibold">{title && title}&nbsp;-&nbsp;</span>
                <span
                key={index}
                className={cn(
                    "text-muted-foreground absolute transition-all duration-500 ease-in-out",
                    visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2"
                )}
                >
                    {messages[safeIndex]}
                </span>
            </p>
        </div>

        {/* Indicators (optional but clean UX) */}
        {messages.length > 1 && (
            <div className="hidden flex gap-1 mt-2">
            {messages.map((_, i) => (
                <span
                key={i}
                className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
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
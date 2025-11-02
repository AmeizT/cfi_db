"use client"

import { cn } from "@/lib/utils"
import { animate, stagger } from "motion"
import { useEffect, useRef } from "react"

interface SplitTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
    text: string
}

export default function SplitText({ text, ...props }: SplitTextProps) {
    const containerRef = useRef<HTMLHeadingElement>(null)

    useEffect(() => {
        document.fonts.ready.then(() => {
            if (!containerRef.current) return

            containerRef.current.style.visibility = "visible"

            const wordElements = Array.from(containerRef.current.children) as HTMLElement[]

            animate(
                wordElements,
                { opacity: [0, 1], y: [1, 0] },
                {
                    type: "spring",
                    duration: 5,
                    bounce: 0,
                    delay: stagger(0.2),
                }
            )
        })
    }, [])

    const words = text.split(" ")

    return (
        <h1
        {...props}
        ref={containerRef}
        className={cn("flex flex-wrap text-center text-4xl text-neutral-800 dark:text-white font-semibold visibility-hidden", props.className)}
        style={{ visibility: "hidden" }}>
            {words.map((word, i) => (
                <span data-index={i} key={i} className="inline-block opacity-0 translate-y-2 transition-all">
                    {word}&nbsp;
                </span>
            ))}
        </h1>
    )
}
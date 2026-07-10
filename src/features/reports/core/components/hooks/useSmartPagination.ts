"use client"

import * as React from "react"

type SmartPaginationState = {
    isSticky: boolean
    isVisible: boolean
    hasVerticalOverflow: boolean
    bounds: {
        left: number
        width: number
    }
}

type UseSmartPaginationOptions = {
    tableRef: React.RefObject<HTMLElement | null>
    paginationRef: React.RefObject<HTMLElement | null>
    enabled: boolean
}

const INITIAL_STATE: SmartPaginationState = {
    isSticky: false,
    isVisible: true,
    hasVerticalOverflow: false,
    bounds: {
        left: 0,
        width: 0,
    },
}

function isSameState(a: SmartPaginationState, b: SmartPaginationState) {
    return (
        a.isSticky === b.isSticky &&
        a.isVisible === b.isVisible &&
        a.hasVerticalOverflow === b.hasVerticalOverflow &&
        Math.round(a.bounds.left) === Math.round(b.bounds.left) &&
        Math.round(a.bounds.width) === Math.round(b.bounds.width)
    )
}

export function useSmartPagination({
    tableRef,
    paginationRef,
    enabled,
}: UseSmartPaginationOptions) {
    const [state, setState] = React.useState<SmartPaginationState>(INITIAL_STATE)
    const previousScrollYRef = React.useRef(0)
    const scrollDirectionRef = React.useRef<"idle" | "down" | "up">("idle")
    const animationFrameRef = React.useRef<number | null>(null)

    React.useEffect(() => {
        if (typeof window === "undefined") return

        previousScrollYRef.current = window.scrollY

        function update() {
            animationFrameRef.current = null

            const tableElement = tableRef.current

            if (!enabled || !tableElement) {
                setState((current) => (
                    isSameState(current, INITIAL_STATE)
                        ? current
                        : INITIAL_STATE
                ))
                return
            }

            const currentScrollY = window.scrollY
            const scrollDelta = currentScrollY - previousScrollYRef.current

            if (Math.abs(scrollDelta) > 1) {
                scrollDirectionRef.current = scrollDelta > 0 ? "down" : "up"
                previousScrollYRef.current = currentScrollY
            }

            const tableRect = tableElement.getBoundingClientRect()
            const paginationHeight = paginationRef.current?.offsetHeight ?? 0
            const viewportHeight = window.innerHeight
            const hasVerticalOverflow = tableRect.height > viewportHeight - paginationHeight
            const isTableInViewport =
                tableRect.bottom > paginationHeight &&
                tableRect.top < viewportHeight
            const isScrollingDown = scrollDirectionRef.current === "down"
            const isScrollingUp = scrollDirectionRef.current === "up"
            const isSticky =
                enabled &&
                hasVerticalOverflow &&
                isScrollingDown &&
                isTableInViewport
            const isVisible =
                !hasVerticalOverflow ||
                (isTableInViewport && !isScrollingUp)
            const nextState: SmartPaginationState = {
                isSticky,
                isVisible,
                hasVerticalOverflow,
                bounds: {
                    left: tableRect.left,
                    width: tableRect.width,
                },
            }

            setState((current) => (
                isSameState(current, nextState)
                    ? current
                    : nextState
            ))
        }

        function scheduleUpdate() {
            if (animationFrameRef.current !== null) return
            animationFrameRef.current = window.requestAnimationFrame(update)
        }

        scheduleUpdate()

        const resizeObserver = new ResizeObserver(scheduleUpdate)

        if (tableRef.current) {
            resizeObserver.observe(tableRef.current)
        }

        if (paginationRef.current) {
            resizeObserver.observe(paginationRef.current)
        }

        window.addEventListener("scroll", scheduleUpdate, { passive: true })
        window.addEventListener("resize", scheduleUpdate)

        return () => {
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current)
            }

            resizeObserver.disconnect()
            window.removeEventListener("scroll", scheduleUpdate)
            window.removeEventListener("resize", scheduleUpdate)
        }
    }, [enabled, paginationRef, tableRef])

    return state
}

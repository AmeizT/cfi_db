"use client"

import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface YearPickerProps {
    minYear?: number
    maxYear?: number
    value: number
    onChange: (year: number) => void
    visibleCount?: number
    itemHeight?: number
}

export function VerticalYearPicker({
    minYear,
    maxYear,
    value,
    onChange,
    visibleCount = 5,
    itemHeight = 40,
}: YearPickerProps) {
    const currentYear = new Date().getFullYear()

    const startYear = minYear ?? value - 20
    const endYear = maxYear ?? Math.max(currentYear + 1, value + 20)
    const [api, setApi] = React.useState<CarouselApi>()

    // DotButtons: track selected snap
    const [selectedSnap, setSelectedSnap] = React.useState(0)

    React.useEffect(() => {
        if (!api) return

        const update = () => setSelectedSnap(api.selectedScrollSnap())
        update()

        api.on("select", update)
        return () => {
            api.off("select", update)
        }
    }, [api])

    /**
     * 1️⃣ Base years
     */
    const baseYears = React.useMemo(
        () =>
            Array.from(
                { length: endYear - startYear + 1 },
                (_, i) => startYear + i
            ),
        [startYear, endYear]
    )

    /**
     * 2️⃣ Repeat years to fake infinite scrolling
     */
    const years = baseYears

    // middleOffset not needed, since we no longer repeat the years

    /**
     * 3️⃣ Sync Embla → value
     */
    React.useEffect(() => {
        if (!api) return

        const onSelect = () => {
            const snap = api.selectedScrollSnap()
            const year = years[snap]
            if (year !== value) onChange(year)
        }

        api.on("select", onSelect)
        return () => {
            api.off("select", onSelect)
        }
    }, [api, years, value, onChange])

    /**
     * 4️⃣ Sync value → Embla (URL reload safe)
     */
    React.useEffect(() => {
        if (!api) return
        const baseIndex = baseYears.indexOf(value)
        if (baseIndex === -1) return

        api.reInit()
        api.scrollTo(baseIndex, false)
    }, [api, value, baseYears])

    /**
     * 5️⃣ Magnifier calculations
     */
    const selectedIndex = api?.selectedScrollSnap() ?? 0

    console.log(years)

    return (
        <div
            className="relative mx-auto flex items-center"
            style={{
                height: visibleCount * itemHeight,
            }}
        >
            {/* center highlight */}
            {/* <div
                className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 rounded-xl bg-muted/40"
                style={{ height: itemHeight }}
            /> */}

            <Carousel
                setApi={setApi}
                orientation="vertical"
                opts={{ align: "center", loop: true }}
                className="h-full"
            >
                <CarouselContent
                    className="h-full"
                    style={{ height: visibleCount * itemHeight }}
                >
                    {years.map((year, index) => {
                        const distance = Math.abs(index - selectedIndex)

                        return (
                            <CarouselItem
                                key={`${year}-${index}`}
                                style={{ height: itemHeight }}
                                className="flex items-center justify-center"
                            >
                                <button
                                    onClick={() => api?.scrollTo(index)}
                                    className={cn(
                                        "w-full rounded-lg text-center transition-all",
                                        year === value
                                            ? "font-semibold text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                    style={{
                                        height: itemHeight,
                                    }}
                                >
                                    {year}
                                </button>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
            {/* vertical DotButtons */}
            <div className="flex flex-col gap-2">
                {baseYears.map((_, i) => {
                    const index = i
                    const active = index === selectedSnap

                    return (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all",
                                active
                                    ? "bg-primary scale-125"
                                    : "bg-red-500"
                            )}
                        />
                    )
                })}
            </div>
        </div>
    )
}
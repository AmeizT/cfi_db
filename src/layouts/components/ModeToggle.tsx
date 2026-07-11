"use client"

import * as React from "react"
import * as motion from "motion/react-client"
import { useTheme } from "next-themes"
import { IconMoonStars, IconSunLowFilled, type TablerIcon } from "@tabler/icons-react"

export function ModeToggle() {
    return (
        <div className="flex items-center">
            <Component />
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu> */}
        </div>
    )
}

interface ThemeModeButton {
    mode: "light" | "dark" | "system"
    icon: TablerIcon
}

const themeOptions: ThemeModeButton[] = [
    { mode: "light", icon: IconSunLowFilled },
    { mode: "dark", icon: IconMoonStars }
                                
]

export default function Component() {
    const { setTheme, theme } = useTheme()
    const selectedMode = theme === "light" || theme === "dark" || theme === "system"
        ? theme
        : "system"

    return (
        <div className="p-[1.5px] w-fit inline-flex gap-x-0.5 h-fit items-center text-sm font-medium rounded-full bg-white dark:bg-gradient-to-b dark:from-neutral-800 dark:to-neutral-900 border border-gray-300/70 dark:border-neutral-600">
            {themeOptions.map((option) => {
                const isActive = selectedMode === option.mode

                return (
                    <button
                        key={option.mode}
                        onClick={() => {
                            setTheme(option.mode)
                        }}
                        className={`relative p-0.5 flex items-center justify-center rounded-full transition-colors ${isActive ? "text-neutral-700 dark:text-white" : "text-muted-foreground"
                            }`}
                    >
                        {isActive ? (
                            <motion.div
                                id="active-pill"
                                layoutId="active-pill"
                                className={`absolute inset-0 rounded-full bg-gray-200 dark:bg-neutral-700 border-0 border-zinc-200/50 dark:border-neutral-600/0`}
                            />
                        ) : null}

                        <span className="relative">
                            <option.icon strokeWidth={2} className="size-4" />
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

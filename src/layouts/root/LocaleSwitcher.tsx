"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Languages } from "lucide-react"
import React, { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { usePathname, useRouter } from "next/navigation"
import { Flex } from "@/components/ui/box"
import { Spinner } from "@/components/ui/spinner"

const locales = [
    { value: "en", label: "English" },
    { value: "af", label: "Afrikaans" },
    { value: "fr", label: "French" },
    { value: "pt", label: "Portuguese" },
    { value: "sw", label: "Swahili" },
]

interface LocalSwitcherProps {
    locale: string
}

export function LocaleSwitcherDropdown({ locale }: LocalSwitcherProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    function onChange(value: string) {
        const nextLocale = value
        const params = new URLSearchParams(searchParams);

        // Remove the current locale from pathname
        let pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

        // Avoid double slashes
        if (pathnameWithoutLocale === "/") pathnameWithoutLocale = "";

        startTransition(() => {
            router.replace(`/${nextLocale}${pathnameWithoutLocale}${params.toString() ? `?${params}` : ""}`);
            router.refresh();
        })
    }

    const activeLocale = locales.find(({ value }) => value === locale)?.label ?? "Unknown"

    return (
        <div className="">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button type="button" disabled={isPending} className="h-fit block content-center py-1.5 px-2 text-sm text-gray-600 dark:text-white font-medium rounded-lg border border-gray-300/70 dark:border-neutral-700 bg-gradient-to-b from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 hover:bg-zinc-50 transition-colors duration-200 shadow-none" suppressHydrationWarning>
                        {isPending ? (
                            <span className="flex items-center gap-x-4">
                                <Spinner className="bg-neutral-700 dark:bg-white" />
                            </span>
                        ) : (
                            <Flex gap={2}>
                                {/* <Globe /> */}
                                <Languages className="size-4.5" />
                                <span className="">{activeLocale}</span>
                                <ChevronDown className="size-4" />
                            </Flex>
                        )}
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full dark:bg-neutral-900 dark:border-neutral-700 rounded-lg">
                    <DropdownMenuRadioGroup
                        defaultValue={locale}
                        value={locale}
                        onValueChange={onChange}
                    >
                        {locales.map((val) => (
                            <DropdownMenuRadioItem key={val.value} value={val.value} className="dark:text-white dark:hover:bg-neutral-800">
                                {val.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

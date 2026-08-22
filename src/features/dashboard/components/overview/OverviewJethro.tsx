"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    CalendarPlus,
    FilePlus2,
    Landmark,
    Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { JethroLauncher } from "@/features/jethro/components/JethroLauncher"
import { useJethroSession } from "@/features/jethro/JethroSessionProvider"
import { JethroIcon } from "@/assets/icons/brand/jethro";

const directActions = [
    {
        label: "Create report",
        href: "/report-wizard",
        icon: FilePlus2,
    },
    {
        label: "Add attendance",
        href: "/forms/attendance",
        icon: CalendarPlus,
    },
    {
        label: "Review finances",
        href: "/finance/tithes",
        icon: Landmark,
    },
    {
        label: "Review tithes",
        href: "/finance/contributors",
        icon: Landmark,
    },
]

export function OverviewJethro({
    monthLabel,
}: {
    monthLabel: string
}) {
    const router = useRouter()
    const { submitMessage, isSending } = useJethroSession()

    async function summarizeReport() {
        const conversationId = await submitMessage(
            `Summarize my ${monthLabel} report and highlight anything that needs attention.`
        )

        if (conversationId) {
            router.push(
                `/ai?conversation=${encodeURIComponent(conversationId)}`
            )
        }
    }

    return (
        <section
            aria-label="Ask Jethro"
            className="mx-auto w-full max-w-2xl"
        >
            <JethroLauncher variant="compact" />

            <div className="relative w-4/5 mx-auto">
                <div
                    data-id="suggestions"
                    className="
                        flex w-full snap-x snap-mandatory gap-2
                        overflow-x-auto scroll-smooth
                        pt-4 pb-1 pr-10
                        [scrollbar-width:none]
                        [&::-webkit-scrollbar]:hidden
                    "
                >
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSending}
                        onClick={() => void summarizeReport()}
                        className="
                            h-8.5 shrink-0 snap-start rounded-full
                            border border-border-subtle
                            bg-background/80 px-3 text-xs
                        "
                    >
                        <JethroIcon className="size-5 text-primary" />
                        Summarize current report
                    </Button>

                    {directActions.map(
                        ({ label, href, icon: Icon }) => (
                            <Button
                                key={label}
                                asChild
                                variant="outline"
                                className="
                                    h-8.5 shrink-0 snap-start rounded-full
                                    border border-border-subtle
                                    bg-background/80 px-3 text-xs
                                "
                            >
                                <Link href={href}>
                                    <Icon className="text-primary" />
                                    {label}
                                </Link>
                            </Button>
                        )
                    )}
                </div>

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute
                        inset-y-0 right-0
                        w-12
                        bg-linear-to-l
                        from-background
                        to-transparent
                    "
                />
            </div>
        </section>
    )
}

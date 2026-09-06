import { createPortal } from "react-dom"
import { getTextColor } from "../utils/get-text-color"
import { oklchLinearGradient } from "../utils/get-oklch-gradient"
import type { AssemblySummary } from "@/features/auth/schemas/user"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

function SwitchingSpinner() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 76 76"
            className="absolute inset-0 size-full -rotate-90 motion-reduce:hidden"
        >
            <circle
                cx="38"
                cy="38"
                r="34"
                fill="none"
                strokeWidth="3"
                className="stroke-border"
            />
            <circle
                cx="38"
                cy="38"
                r="34"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="213.6"
                strokeDashoffset="53.4"
                className="origin-center stroke-primary animate-spin"
                style={{ animationDuration: "1.1s" }}
            />
        </svg>
    )
}

export function AssemblySwitchingOverlay({
    assembly,
}: {
    assembly: AssemblySummary
}) {
    if (typeof document === "undefined") return null

    return createPortal(
        <div
            role="status"
            aria-live="polite"
            aria-label={`Switching to ${assembly.name}`}
            className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-background/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
            

            <div className="relative z-10 flex w-full max-w-sm flex-col items-center _rounded-[28px] border-0 border-border/40 _bg-background/70 px-6 py-8 text-center _shadow-lg _backdrop-blur-md">
                {/* Loading ring around the avatar */}
                <div className="relative size-20">
                    <SwitchingSpinner />

                    <Avatar className="absolute inset-0 m-auto size-16">
                        <AvatarImage src={assembly.avatar ?? undefined} />

                        <AvatarFallback
                            className="text-xl font-semibold uppercase"
                            style={{
                                background: oklchLinearGradient(
                                    assembly.avatar_fallback ??
                                        "oklch(87.2% 0.007 219.6)"
                                ),
                                color: getTextColor(
                                    assembly.avatar_fallback ??
                                        "oklch(45% 0.017 213.2)"
                                ),
                            }}
                        >
                            {assembly.name?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <h2 className="mt-6 text-xl leading-tight text-center font-semibold tracking-tight text-foreground">
                    Switching to {assembly.name}
                </h2>

                <p className="mt-2 text-sm text-center text-muted-foreground">
                    Hang tight, this can take a few seconds
                </p>
            </div>
        </div>,
        document.body
    )
}
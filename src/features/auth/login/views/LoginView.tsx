"use client"

import * as React from "react"

import { Separator } from "@/components/ui/separator"
import { AuthForm } from "../components/AuthForm"
import { AuthSidebar } from "../components/AuthSidebar"
import { FormButton } from "../components/Button"

type AuthView = "welcome" | "form"

export function LoginView() {
    const [view, setView] = React.useState<AuthView>("welcome")

    return (
        <main className="flex h-dvh w-full flex-col items-center lg:flex-row">
            {/* Welcome / sidebar */}
            <section
                className={`
                    relative h-dvh w-full overflow-hidden
                    flex-col items-center justify-center
                    lg:flex lg:w-1/2
                    ${view === "welcome" ? "flex" : "hidden"}
                `}
            >
                <AuthSidebar />

                <div className="absolute inset-x-0 bottom-6 z-50 px-6 lg:hidden">
                    <FormButton
                        type="button"
                        onClick={() => setView("form")}
                        className="bg-linear-to-b from-indigo-500 to-indigo-700"
                    >
                        Sign in to CFI Workspace
                    </FormButton>
                </div>
            </section>

            <Separator
                orientation="vertical"
                className="
                    hidden bg-border-subtle/60 dark:bg-linear-to-b dark:from-neutral-700 dark:to-neutral-900
                    data-[orientation=vertical]:h-[80%]
                    data-[orientation=vertical]:w-px
                    lg:block
                "
            />

            {/* Sign-in form */}
            <section
                className={`
                    relative h-dvh w-full overflow-hidden
                    lg:flex lg:w-1/2
                    ${view === "form" ? "flex" : "hidden"}
                `}
            >
                {/* Decorative background */}
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none absolute inset-0 z-0
                        bg-[radial-gradient(#d9dddf_1px,transparent_1px)]
                        dark:bg-[radial-gradient(#404040_1px,transparent_1px)]
                        bg-size-[16px_16px]
                        mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]
                    "
                />

                {/* Form */}
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                    <button
                        type="button"
                        onClick={() => setView("welcome")}
                        className="absolute left-4 top-4 z-20 text-sm text-muted-foreground hover:text-foreground lg:hidden"
                    >
                        ← Back
                    </button>

                    <AuthForm />
                </div>
            </section>
        </main>
    )
}
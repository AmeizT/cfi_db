"use client"

import React from "react"
import { cn } from "@/lib/utils"
import PadlockIcon from "../icons/Padlock"
import { useTranslations } from "next-intl"
import { FancyIcon } from "../icons/FancyIcon"
import { Check } from "lucide-react"
import { Hint } from "./hint"
import Link from "next/link"
import { UrlObject } from "url"

interface ContainerProps<E extends React.ElementType = "div"> {
    as?: E
    children: React.ReactNode
    className?: string
}

function Container<E extends React.ElementType = "div">({
    as,
    children,
    className,
    ...props
}: ContainerProps<E> & Omit<React.ComponentPropsWithoutRef<E>, keyof ContainerProps>) {
    const Tag = as || "div"
    return <Tag className={cn("min-h-dvh", className)} {...props}>{children}</Tag>
}

type AuthPageType = "login" | "signup" | "reset" | "recovery" | "initialize-recovery" | "password-updated"

interface AuthPageContent {
    type: AuthPageType;
    heading: string;
    subheading: string;
    description?: string;
    actionLabel: string;
    actionUrl: string;
    promptText?: string;
    helpText?: string;
}

interface AuthLayoutProps {
    type: AuthPageType
    children: React.ReactNode
}

export function AuthLayout({ type, children }: AuthLayoutProps) {
    const recover = useTranslations("Recover")
    const reset = useTranslations("Reset")
    const initialize = useTranslations("Initialize")
    const passwordUpdated = useTranslations("PasswordUpdated")

    const authPages: AuthPageContent[] = [
        {
            type: "recovery",
            heading: recover("heading"),
            subheading: recover("subheading"),
            description: recover("description"),
            actionLabel: recover("actionLabel"),
            actionUrl: recover("actionUrl"),
            promptText: recover("promptText")
        },
        {
            type: "reset",
            heading: reset("heading"),
            subheading: reset("subheading"),
            description: reset("description"),
            actionLabel: reset("actionLabel"),
            actionUrl: reset("actionUrl"),
            promptText: reset("promptText"),
            helpText: reset("helpText")
        },
        {
            type: "initialize-recovery",
            heading: initialize("heading"),
            subheading: "",
            description: initialize("description"),
            actionLabel: "",
            actionUrl: "",
            promptText: "",
            helpText: "",
        },
        {
            type: "password-updated",
            heading: passwordUpdated("heading"),
            subheading: "",
            description: passwordUpdated("description"),
            actionLabel: "",
            actionUrl: "",
            promptText: "",
            helpText: "",
        },
    ]

    const currentYear = new Date().getFullYear()
    const page = authPages.find(p => p.type === type)

    if (!page) return null

    const successVariant = type === "initialize-recovery" || type === "password-updated"

    return (
        <div className="flex-col px-4 w-full h-dvh flex justify-center items-center bg-background text-foreground">
            {/* <header className="w-full flex items-center px-3 lg:px-8">
                <span className="text-body-muted text-base font-normal flex items-center gap-1">
                    {page.promptText && <span>{page.promptText}</span>}
                    <Link href={page.actionUrl} className="text-primary hover:underline underline-offset-2">
                        {page.actionLabel}
                    </Link>
                </span>
            </header> */}
            
            <main className="relative w-full md:w-1/2 lg:w-[30%] flex flex-col items-center gap-6 lg:p-6">
                <FancyIcon
                    data-variant={successVariant && "success"}
                    icon={successVariant ? <Check className="text-green-500" /> : <PadlockIcon className="size-10" />}
                    label="Security icon"
                />

                <div className="flex flex-col gap-y-2">
                    <h3 className="text-2xl text-center text-balance font-semibold text-foreground">
                        {page.heading}
                    </h3>

                    {/* <h4 className="text-2xl font-semibold text-body-foreground">
                        {page.subheading}
                    </h4> */}

                    {page.description && 
                        <p className="pt-0 block text-sm text-center text-muted-foreground">
                            {page.description}
                        </p>
                    }

                    {page.helpText && 
                        <div className="mt-2">
                            <Hint message={page.helpText} />
                        </div>
                        // <small className="pt-2 text-center text-sm text-body-muted">
                            
                        // </small>
                    }
                </div>

                {children}
            </main>

            <footer className="fixed bottom-4 left-0 w-full flex justify-center">
                <small className="text-xs text-muted-foreground">
                    &copy; {currentYear} CFI Workspace. All rights reserved.
                </small>
            </footer>
        </div>
    )
}

interface CreationSuccessProps {
    label: string
    message?: string
    redirectPath: string
    onCreateAnother: () => void
}

export function CreationSuccess({ label, redirectPath, onCreateAnother }: CreationSuccessProps) {
    return (
        <div className="flex flex-col w-full h-dvh justify-center items-center px-4 bg-background text-foreground">
            <main className="w-full max-w-md flex flex-col items-center gap-6 text-center">
                <FancyIcon
                    data-variant="success"
                    icon={<Check className="text-green-500" aria-hidden="true" />}
                    label="Success icon"
                />

                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-balance text-foreground capitalize">
                        {label} Submitted
                    </h3>
                    <p className="text-[15px] text-muted-foreground">
                        The {label} has been created successfully.
                    </p>
                </div>

                <footer className="flex flex-col sm:flex-row gap-3 mt-4 w-full justify-center">
                    <Link
                        href={redirectPath as unknown as UrlObject}
                        className="inline-flex items-center justify-center px-3 h-8 rounded-lg bg-theme text-theme-foreground text-sm font-medium hover:bg-theme-600 transition"
                    >
                        View Item
                    </Link>
                    <button
                        onClick={onCreateAnother}
                        className="inline-flex items-center justify-center px-3 h-8 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition"
                    >
                        Add Another
                    </button>
                </footer>
            </main>
        </div>
    )
  }

Container.Auth = AuthLayout
Container.Success = CreationSuccess

export default Container

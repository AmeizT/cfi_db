"use client"

import {
    FormEvent,
    KeyboardEvent,
    useRef,
} from "react"
import {
    ArrowUp,
    LoaderCircle,
    Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type JethroComposerVariant = "compact" | "relaxed"

interface JethroComposerProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    loading: boolean
    variant?: JethroComposerVariant
    placeholder?: string
    className?: string
}

export function JethroComposer({
    value,
    onChange,
    onSubmit,
    loading,
    variant = "relaxed",
    placeholder = "Ask or create anything...",
    className,
}: JethroComposerProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const submit = (event?: FormEvent) => {
        event?.preventDefault()

        if (!value.trim() || loading) return

        onSubmit()
    }

    const onKeyDown = (
        event: KeyboardEvent<HTMLTextAreaElement>,
    ) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault()
            submit()
        }
    }

    const compact = variant === "compact"
    // A restored conversation may fetch immediately after hydration. Only an
    // active send with a draft can change this icon, so an empty SSR composer
    // always has the same DOM on the server and client.
    const showLoading = loading && Boolean(value.trim())

    if (compact) {
        return (
            <form
                onSubmit={submit}
                className={cn(
                    "w-full bg-transparent",
                    className,
                )}
            >
                <div
                    className={cn(
                        "flex h-fit w-full items-center gap-3 p-2",
                        "rounded-full border border-border-subtle",
                        "bg-background",
                        "transition-[border-color,box-shadow]",
                        "focus-within:border-primary/30",
                        "focus-within:ring-2 focus-within:ring-primary/10",
                        "sm:gap-2 sm:p-1.5",
                    )}
                >
                    {/* Add / attachment */}
                    <button
                        type="button"
                        disabled
                        aria-label="Add attachment"
                        title="Attachments are not available yet"
                        className={cn(
                            "grid size-12 shrink-0 place-items-center rounded-full",
                            "hover:bg-surface text-foreground",
                            "transition-colors",
                            "disabled:cursor-default disabled:opacity-100",
                            "sm:size-9",
                        )}
                    >
                        <Plus
                            className="size-5 sm:size-6"
                            strokeWidth={2}
                        />
                    </button>

                    {/* Compact single-line input */}
                    <input
                        type="text"
                        maxLength={2000}
                        value={value}
                        onChange={(event) =>
                            onChange(event.target.value)
                        }
                        placeholder={placeholder}
                        aria-label="Message Jethro"
                        autoComplete="off"
                        className={cn(
                            "h-full min-w-0 flex-1",
                            "border-0 bg-transparent p-0",
                            "text-base text-foreground",
                            "outline-none ring-0",
                            "placeholder:text-muted-foreground/60",
                            "focus:outline-none focus:ring-0",
                        )}
                    />

                    {/* Send */}
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!value.trim() || loading}
                        aria-label="Send message"
                        className={cn(
                            "size-12 shrink-0 rounded-full",
                            "transition-colors",
                            "sm:size-9",
                            !value.trim() &&
                                "bg-primary/15 text-primary/45 opacity-100",
                        )}
                    >
                        {showLoading ? (
                            <LoaderCircle className="size-5 animate-spin" />
                        ) : (
                            <ArrowUp
                                className="size-5"
                                strokeWidth={2.25}
                            />
                        )}
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <form
            onSubmit={submit}
            className={cn(
                "shrink-0 border-t border-border-subtle bg-background p-3",
                className,
            )}
        >
            <div
                className={cn(
                    "flex items-end gap-2 rounded-2xl",
                    "border border-border-subtle",
                    "bg-surface-subtle p-2",
                    "transition",
                    "focus-within:border-primary/30",
                    "focus-within:bg-background",
                    "focus-within:ring-2",
                    "focus-within:ring-primary/10",
                )}
            >
                <Textarea
                    ref={textareaRef}
                    rows={2}
                    maxLength={2000}
                    value={value}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    aria-label="Message Jethro"
                    className={cn(
                        "max-h-40 min-h-20 resize-none",
                        "border-0 bg-transparent p-2",
                        "shadow-none",
                        "focus-visible:ring-0",
                    )}
                />

                <Button
                    type="submit"
                    size="icon"
                    disabled={!value.trim() || loading}
                    aria-label="Send message"
                    className="mb-1 shrink-0 rounded-full"
                >
                    {showLoading ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <ArrowUp />
                    )}
                </Button>
            </div>

            <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Jethro AI can make mistakes
            </p>
        </form>
    )
}

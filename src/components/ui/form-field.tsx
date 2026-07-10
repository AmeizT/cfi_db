import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"

export interface FormFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    helpText?: string
}

export const FormField = React.forwardRef<
    HTMLInputElement,
    FormFieldProps
>(function FormField(
    {
        id,
        name,
        label,
        error,
        helpText,
        className,
        type = "text",
        ...props
    },
    ref
) {
    const [isPasswordVisible, setPasswordVisible] = React.useState(false)

    const inputId = React.useMemo(() => id || name, [id, name])

    const isPassword = type === "password"
    const inputType = isPassword
        ? isPasswordVisible
            ? "text"
            : "password"
        : type

    const describedBy = error
        ? `${inputId}_error`
        : helpText
            ? `${inputId}_helper_text`
            : undefined

    return (
        <>
            <div className="relative w-full">
                <input
                    ref={ref}
                    id={inputId}
                    name={name}
                    type={inputType}
                    placeholder=" "
                    aria-invalid={!!error}
                    aria-describedby={describedBy}
                    className={cn(
                        "peer block h-13 w-full rounded-[14px] border-[1.25px] border-input bg-background px-4 pb-2 pt-6 text-foreground placeholder:text-muted-foreground transition-all duration-150 focus:border-[1.5px] focus:border-primary focus:outline-hidden focus:ring-3 focus:ring-primary/10 dark:focus:border-primary dark:focus:ring-primary/20",
                        error &&
                        "border-destructive ring-3 ring-destructive/10 focus:border-destructive focus:ring-destructive/20",
                        className
                    )}
                    {...props}
                />

                {isPassword && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    tabIndex={-1}
                                    variant="outline"
                                    aria-label={
                                        isPasswordVisible
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    onClick={() =>
                                        setPasswordVisible((v) => !v)
                                    }
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 border-0 bg-transparent px-2 text-muted-foreground shadow-none hover:bg-inherit hover:text-foreground"
                                >
                                    {isPasswordVisible ? (
                                        <HugeiconsIcon icon={ViewIcon} strokeWidth={2} className="size-5" />
                                    ) : (
                                        <HugeiconsIcon icon={ViewOffSlashIcon} strokeWidth={2} className="size-5" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {isPasswordVisible
                                    ? "Hide password"
                                    : "Show password"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                <label
                    htmlFor={inputId}
                    className="absolute text-[15px] text-muted-foreground font-medium duration-300 transform -translate-y-2.5 scale-80 top-3.5 z-10 origin-left start-4 peer-focus:font-normal peer-placeholder-shown:font-normal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-2.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto cursor-text"
                >
                    {label}
                    {error && (
                        <span className="sr-only"> (required)</span>
                    )}
                </label>
            </div>

            {error ? (
                <small
                    id={`${inputId}_error`}
                    className="mt-2 text-xs font-medium text-destructive"
                >
                    {error}
                </small>
            ) : helpText ? (
                <small
                    id={`${inputId}_helper_text`}
                    className="mt-2 text-xs text-muted-foreground"
                >
                    {helpText}
                </small>
            ) : null}
        </>
    )
})

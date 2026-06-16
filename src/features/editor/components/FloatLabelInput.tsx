import * as React from "react"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { HugeiconsIcon } from "@hugeicons/react"
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { FormField, FormFieldProps } from "./FormField"
import { useFieldContext } from "../hooks/use-form"

export interface FloatLabelInputProps
    extends FormFieldProps,
    React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    helpText?: string
}

export const FloatLabelInput = React.forwardRef<
    HTMLInputElement,
    FloatLabelInputProps
>(function FloatLabelInput(
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
    const field = useFieldContext<string>()
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    const { tip, isRequired, ...rest } = props;

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
        <FormField {...rest} tip={tip} isRequired={isRequired}>
            <div className="relative w-full">
                <input
                    ref={ref}
                    id={inputId}
                    type={inputType}
                    name={field.name}
                    placeholder=" "
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    {...rest} 
                    aria-invalid={isInvalid}
                    aria-describedby={describedBy}
                    className={cn(
                        "peer block h-14 w-full rounded-[14px] border-[1.25px] border-gray-300 bg-white px-4 pb-2 pt-6 text-gray-800 placeholder:text-gray-500 transition-all duration-250 focus:border-[1.5px] focus:border-primary focus:outline-hidden focus:ring-3 focus:ring-gray-800/10 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:focus:border-gray-800 dark:focus:ring-primary/20",
                        error &&
                        "border-red-500 ring-3 ring-red-500/10 focus:border-red-500 focus:ring-red-500/20",
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
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 border-0 bg-transparent px-2 text-gray-700 shadow-none hover:bg-inherit hover:text-gray-800 dark:text-white dark:hover:text-white"
                                >
                                    {isPasswordVisible ? (
                                        <HugeiconsIcon icon={ViewIcon} strokeWidth={2.25} className="size-5" />
                                    ) : (
                                        <HugeiconsIcon icon={ViewOffSlashIcon} strokeWidth={2.25} className="size-5" />
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
                    className="absolute text-[15px] text-gray-500 font-medium dark:text-body-muted duration-250 transform -translate-y-2.5 scale-80 top-4 z-10 origin-left start-4 peer-focus:font-normal peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-2.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto cursor-text"
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
                    className="mt-2 text-xs font-medium text-red-500"
                >
                    {error}
                </small>
            ) : helpText ? (
                <small
                    id={`${inputId}_helper_text`}
                    className="mt-2 text-xs text-body-muted"
                >
                    {helpText}
                </small>
            ) : null}
        </FormField>
    )
})
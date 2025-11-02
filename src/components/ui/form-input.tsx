import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    helpText?: string
    ref?: React.Ref<HTMLInputElement>
    type?: string
}

export function FormInput({
    id,
    name,
    label,
    error,
    helpText,
    className,
    ref,
    type = "text",
    ...props
}: FormInputProps) {
    const [isPasswordVisible, setPasswordVisible] = React.useState(false)
    const inputId = id || name

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible)
    }

    return (
        <React.Fragment>
            <div className="w-full relative">
                <input
                    id={inputId}
                    name={name}
                    ref={ref}
                    placeholder=" "
                    type={type === "password" && !isPasswordVisible ? "password" : "text"}
                    aria-describedby={helpText ? `${inputId}_helper_text` : undefined}
                    aria-invalid={error ? true : false}
                    className={cn(`peer block rounded-xl h-12 px-3.5 pb-1.5 pt-5 w-full appearance-none placeholder:text-zinc-400 text-[15px] text-neutral-700 dark:text-white bg-white dark:bg-neutral-800 dark:shadow-md border-[1px] focus:outline-hidden focus:ring-3 focus:ring-primary/20 dark:focus:ring-primary/20 dark:focus:border-primary focus:border-[1.5px] focus:border-primary transition-all duration-150`, error ? "border-[1px] border-red-500 ring-3 ring-red-500/10" : "border-border dark:border-neutral-600", className)}
                    {...props}
                />
                {type === "password" && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    tabIndex={-1}
                                    variant="outline"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                    className="group px-2 rounded-xs absolute right-0 top-1/2 transform -translate-y-1/2 border-0 bg-transparent hover:bg-inherit shadow-none text-xs text-neutral-600 dark:text-white hover:text-neutral-800 dark:hover:text-white [&>svg]:transition-colors [&>svg]:duration-200">
                                    {isPasswordVisible ? (
                                        <IconEyeOff className="size-5" />
                                    ) : (
                                        <IconEye className="size-5" />
                                    )}
                                </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                                <p>
                                    {isPasswordVisible ? "Hide Password" : "Show Password"}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                <label
                    htmlFor={inputId}
                    className="absolute text-[15px] text-neutral-400 dark:text-body-muted duration-300 transform -translate-y-2.5 scale-80 top-3 z-10 origin-[0] start-3.5 peer-focus:text-body-muted peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-2.5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto cursor-text">
                    {label}{" "}
                    {error && <span className="text-red-500 sr-only">Required *</span>}
                </label>
            </div>

            {error ? (
                <small className="mt-2 text-xs text-red-500 font-medium">
                    {error}
                </small>
            ) : helpText ? (
                <small id={`${inputId}_helper_text`} className="mt-2 text-xs text-body-muted">
                    {helpText}
                </small>
            ) : null}
        </React.Fragment>
    )
}


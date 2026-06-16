import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { useFieldContext } from "../hooks/use-form"
import React from "react"
import { Info } from "lucide-react"

export interface FormFieldProps {
    label?: string
    description?: string
    tip?: string
    isRequired?: boolean
}

interface Props extends FormFieldProps {
    children: React.ReactNode
}

export function FormField({
    label,
    description,
    tip,
    isRequired,
    children,
}: Props) {
    const field = useFieldContext<string>()
    const [showTooltip, setShowTooltip] = React.useState(false)
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field data-invalid={isInvalid}>
            <FieldContent>
                {label && (
                    <FieldLabel
                        htmlFor={field.name}
                        className="flex items-center gap-2"
                    >
                        <span>
                            {label}
                            {isRequired && (
                                <span className="text-red-500"> *</span>
                            )}
                        </span>

                        {tip && (
                            <div className="relative">
                                <Info
                                    size={16}
                                    className="text-gray-400 cursor-help"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                />

                                {showTooltip && (
                                    <div className="absolute left-6 top-0 w-64 bg-linear-to-br from-slate-800 to-slate-900 text-white text-xs rounded-[14px] p-3 z-20">
                                        {tip}
                                    </div>
                                )}
                            </div>
                        )}
                    </FieldLabel>
                )}

                {children}

                {description && !isInvalid && (
                    <FieldDescription className="text-sm">
                        {description}
                    </FieldDescription>
                )}

                {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                )}
            </FieldContent>
        </Field>
    )
}
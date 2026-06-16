import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "../hooks/use-form"
import React from "react"
import { Info } from "lucide-react"

export interface FieldProps {
    label: string
    description?: string
    hasTip?: boolean
    tip?: string
    isRequired?: boolean
}

interface BaseFieldProps extends FieldProps {
    children: React.ReactNode
}

export function BaseField(props: BaseFieldProps){
    const field = useFieldContext<string>()
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    const [showTooltip, setShowTooltip] = React.useState("")

    return (
        <Field data-invalid={isInvalid}>
            <FieldContent>
                <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                    <span>{props.label} <span className="text-red-500">{props.isRequired && "*"}</span></span>

                    {props.hasTip ? (
                        <div className="relative">
                            <Info
                                size={16}
                                className="text-gray-400 cursor-help"
                                onMouseEnter={() => setShowTooltip(props.label)}
                                onMouseLeave={() => setShowTooltip('')}
                            />
                            
                            {showTooltip === props.label && (
                                <div className="absolute left-6 top-0 w-64 bg-linear-to-br from-slate-800 to-slate-900 text-white text-xs rounded-[14px] p-3 z-20">
                                    {props.tip}
                                </div>
                            )}
                        </div>
                    ) : null}
                </FieldLabel>

                {props.children}

                {props.description && !isInvalid && 
                    <FieldDescription className="text-sm">
                        {props.description}
                    </FieldDescription>
                }

                {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                )}
            </FieldContent>
        </Field>
    )
}



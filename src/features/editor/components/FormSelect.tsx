import * as React from "react"
import { useFieldContext } from "../hooks/use-form"
import { BaseField, FieldProps } from "./FieldBase"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FormInputProps
    extends FieldProps,
    React.InputHTMLAttributes<HTMLSelectElement> { }

export function FormSelect({...props}: FormInputProps) {
    const { hasTip, tip, isRequired, ...rest } = props
    const field = useFieldContext<string>()
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <BaseField {...rest} hasTip={hasTip} tip={tip} isRequired={isRequired}>
            <Select
                name={field.name}
                value={field.state.value}
                onValueChange={field.handleChange}
                aria-invalid={isInvalid}
            >
                <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    {props.children}
                </SelectContent>
            </Select>
        </BaseField>
    )
}
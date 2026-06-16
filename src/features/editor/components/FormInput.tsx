import * as React from "react"
import { useFieldContext } from "../hooks/use-form"
import { Input } from "@/components/ui/input"
import { FormField, FormFieldProps } from "./FormField"

interface FormInputProps
    extends FormFieldProps,
    React.InputHTMLAttributes<HTMLInputElement> { }

export function FormInput({...props}: FormInputProps) {
    const field = useFieldContext<string>()
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    const { tip, isRequired, ...rest } = props;

    return (
        <FormField {...rest} tip={tip} isRequired={isRequired}>
            <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                {...rest} 
            />
        </FormField>
    )
}
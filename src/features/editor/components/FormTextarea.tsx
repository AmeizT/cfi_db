import * as React from "react"
import { useFieldContext } from "../hooks/use-form"
import { BaseField, FieldProps } from "./FieldBase"
import { Textarea } from "@/components/ui/textarea"

interface FormInputProps
    extends FieldProps,
    React.InputHTMLAttributes<HTMLTextAreaElement> { }

export function FormTextarea({...props}: FormInputProps) {
    const field = useFieldContext<string>()
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    const { hasTip, tip, isRequired, ...rest } = props;

    return (
        <BaseField {...rest} hasTip={hasTip} tip={tip} isRequired={isRequired}>
            <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                {...props} 
            />
        </BaseField>
    )
}
import React from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

type FormSubmitHandler = (formData: FormData) => void

export function handleFormSubmit<T extends FieldValues>(
    form: UseFormReturn<T>,
    ref: React.RefObject<HTMLFormElement | null>,
    action: FormSubmitHandler
) {
    return (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        form.handleSubmit(() => {
            React.startTransition(() => {
                if (ref.current) {
                    const formData = new FormData(ref.current)
                    action(formData)
                }
            })
        })(event)
    }
}
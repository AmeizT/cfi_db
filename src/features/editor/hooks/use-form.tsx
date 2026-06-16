import { FormInput } from "../components/FormInput"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { FormTextarea } from "../components/FormTextarea"
import { FormSelect } from "../components/FormSelect"
import { FloatLabelInput } from "../components/FloatLabelInput"

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

const { useAppForm } = createFormHook({
    fieldComponents: {
        Input: FormInput,
        FloatLabelInput: FloatLabelInput,
        Textarea: FormTextarea,
        Select: FormSelect,
    },
    formComponents: {},
    fieldContext,
    formContext,
})

export { useAppForm, useFieldContext, useFormContext }


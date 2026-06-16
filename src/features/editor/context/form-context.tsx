"use client"

import React from "react"

interface FormContextType {
    isPending: boolean
    setIsPending: (pending: boolean) => void
}

const FormContext = React.createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
    const [isPending, setIsPending] = React.useState(false)

    return (
        <FormContext.Provider value={{ isPending, setIsPending }}>
            {children}
        </FormContext.Provider>
    )
}

export function useFormContext() {
    const context = React.useContext(FormContext)
    if (context === undefined) {
        throw new Error("useFormContext must be used within a FormProvider")
    }
    return context
}
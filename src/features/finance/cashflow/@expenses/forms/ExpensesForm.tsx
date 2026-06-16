import React from "react"
import { useSearchParams } from "next/navigation"

import { VariableExpenditureForm } from "./VariableExpensesForm"
import { FixedExpensesForm } from "./FixedExpensesForm"

export function ExpenseForms({ formId }: { formId: string }) {
    const searchParams = useSearchParams()
    const type = searchParams.get("type")

    const renderForm = () => {
        switch (type) {
            case "fixed":
                return <FixedExpensesForm />
            case "variable":
                return <VariableExpenditureForm />
            default:
                return <FixedExpensesForm />
        }
    }

    return <React.Fragment>{renderForm()}</React.Fragment>
}
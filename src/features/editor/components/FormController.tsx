import { IncomeForm } from "@/features/finance/cashflow/@income/forms/IncomeForm"
import { ExpenseForms } from "@/features/finance/cashflow/@expenses/forms/ExpensesForm"
import { TitheFormUpdated } from "@/features/finance/tithes/forms/TitheFormUpdated"
import { MonthlyReport } from "@/features/reports/core/schemas/report"

interface FormContainerProps {
    form: string
    report: MonthlyReport | null
}

export function FormController({ form, report }: FormContainerProps){
    function renderForm() {
        switch (form) {
            case "expenses":
                return <ExpenseForms formId={form} />
            case "income":
                return <IncomeForm formId={form} />
            case "tithes":
                return <TitheFormUpdated formId={form} report={report} />
            default:
                return
        }
    }

    return renderForm()
}
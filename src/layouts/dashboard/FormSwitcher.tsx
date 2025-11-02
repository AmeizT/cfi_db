import React from "react"
import { TitheForm } from "@/features/finance/tithes/forms/TitheForm"
import { AttendanceForm } from "@/features/attendance/forms/AttendanceForm"

interface FormSwitcherProps {
    currentForm: "assets" | "expenses" | "income" | "members" | "tithes" | "attendance"
}

export function FormSwitcher({ currentForm }: FormSwitcherProps){
    switch (currentForm) {
        case "assets":
            return
        case "expenses":
            return
        case "income":
            return 
        case "members":
            return
        case "tithes":
            return <TitheForm />
        case "attendance":
            return <AttendanceForm />
        default:
            return null
    }
}
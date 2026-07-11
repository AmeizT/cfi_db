"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { FixedExpenditure } from "@/types"
import { Settings2 } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FixedExpense } from "../schemas/fixed-expenses"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUser } from "@/hooks/query/use-user"
import { format } from "date-fns"
import { fixedExpenditureFormAction } from "../actions/fixed-expenditure"
import FormContainer from "@/features/reports/core/_components/FormContainer"


interface FixedExpensesProps {
    expenditure?: FixedExpenditure
}

interface Field {
    name: string
    label: string
    description?: string
    type: "date" | "text" | "number" | string
    onPointerDown?: (e: { stopPropagation: () => unknown }) => void
}

const fieldNames = [
    "timestamp",
    "rent",
    "wages",
    "water",
    "electricity",
    "telephone",
    "internet",
    "security",
    "fuel",
    "car_maintenance",
    "humanitarian",
    "investment",
    "bank_charges",
    "insurance",
]

type FormActionState = {
    message: unknown
    status: number
    success: boolean
}

const initialState: FormActionState = {
    message: "",
    status: 0,
    success: false
}

const STORAGE_KEY = "customizedFieldnames"

function getSavedFieldNames() {
    if (typeof window === "undefined") return fieldNames

    const savedPreferences = window.localStorage.getItem(STORAGE_KEY)
    if (!savedPreferences) return fieldNames

    try {
        const parsed = JSON.parse(savedPreferences)
        return Array.isArray(parsed) ? parsed.filter((field): field is string => typeof field === "string") : fieldNames
    } catch {
        return fieldNames
    }
}

export function FixedExpensesForm({ expenditure }: FixedExpensesProps) {
    const router = useRouter()
    const { data: user } = useUser()
    const ref = React.useRef<HTMLFormElement>(null)
    const [selectedFields, setSelectedFields] = React.useState<string[]>(getSavedFieldNames)
    const [state, formAction, isPending] = React.useActionState(
        fixedExpenditureFormAction, 
        initialState
    )
    const form = useForm<FixedExpense>()

    const savePreferences = (fields: string[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fields))
        setSelectedFields(fields)
    }

    const handleFieldSelection = (field: string) => {
        const updatedFields = selectedFields.includes(field)
            ? selectedFields.filter((f) => f !== field)
            : [...selectedFields, field]

        savePreferences(updatedFields)
    }

    const formFields: Field[] = selectedFields.map(name => ({
        name,
        label: name.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase()),
        type: name === "timestamp" ? "date" : "number",
        description: {
            timestamp: "The reporting month for these expenses",
            rent: "Monthly rent for buildings or facilities",
            wages: "Salaries and wages paid",
            water: "Water utility expenses",
            electricity: "Electricity utility expenses",
            telephone: "Telephone and communication bills",
            internet: "Internet service charges",
            security: "Security-related expenses",
            fuel: "Fuel costs for transportation",
            car_maintenance: "Expenses for maintaining vehicles",
            humanitarian: "Support and donations for humanitarian purposes",
            investment: "Funds allocated for investments",
            bank_charges: "Bank-related fees and charges",
            insurance: "Insurance premiums paid",
        }[name],
        onPointerDown: name === "timestamp" ? (e: { stopPropagation: () => unknown }) => { e.stopPropagation() } : undefined
    }))

    const customizableFieldNames = fieldNames
        .filter(field => field !== "timestamp")
        .sort((a, b) => a.localeCompare(b))


    const monthlyRegularExpenditure = [
        {
            name: "timestamp",
            value: expenditure?.timestamp || "",
        },
        {
            name: "bank_charges",
            value: expenditure?.bank_charges || 0,
        },
        {
            name: "security",
            value: expenditure?.security || 0,
        },
        {
            name: "car_maintenance",
            value: expenditure?.car_maintenance || 0,
        },
        {
            name: "electricity",
            value: expenditure?.electricity || 0,
        },
        {
            name: "fuel",
            value: expenditure?.fuel || 0,
        },
        {
            name: "humanitarian",
            value: expenditure?.humanitarian || 0,
        },
        {
            name: "insurance",
            value: expenditure?.insurance || 0,
        },
        {
            name: "internet",
            value: expenditure?.internet || 0,
        },
        {
            name: "investment",
            value: expenditure?.investment || 0,
        },
        {
            name: "rent",
            value: expenditure?.rent || 0,
        },
        {
            name: "wages",
            value: expenditure?.wages || 0,
        },
        {
            name: "telephone",
            value: expenditure?.telephone || 0,
        },
        {
            name: "water",
            value: expenditure?.water || 0,
        },
    ]
    
    const expenditureMap = Object.fromEntries(
        monthlyRegularExpenditure.map(item => [item.name, item.value])
    )

    React.useEffect(() => {
        if (state?.success) {
            const currentYear = format(new Date(), "yyyy")
            const currentMonth = format(new Date(), "MMM").toLowerCase()

            console.log(currentYear, currentMonth)
        }
    }, [router, state])

    return (
        <FormContainer
        ref={ref}
        context={form}
        action={formAction}
        isPending={isPending}
        onClick={() => form.reset()}
        component={
            <FormConfig 
                customizableFieldNames={customizableFieldNames} 
                handleFieldSelection={handleFieldSelection}
                selectedFields={selectedFields}
            />
        }>
            <div className="px-6 w-full">
                <div className="">
                    <fieldset hidden>
                        <input 
                            hidden type="text" 
                            name="assembly" 
                            defaultValue={user?.church} 
                        />
                    </fieldset>
                    <fieldset className="w-full flex flex-col">
                        <ul>
                            {formFields?.map((field, index) => (
                                <li key={index} data-describedby="field-container" className="py-4 flex gap-2 border-b border-dashed first:border-t-0 last:border-b-0">
                                    <Label htmlFor={field?.name} className="w-2/3 flex flex-col items-start">
                                        {field?.label}
                                        <span className="text-xs text-zinc-400 font-normal">
                                            {field.description}
                                        </span>
                                    </Label>

                                    <Input
                                        key={index}
                                        id={field?.name}
                                        type={field?.type}
                                        name={field?.name}
                                        placeholder=""
                                        step="0.01"
                                        defaultValue={expenditureMap[field?.name] || ''}
                                        className="w-1/2 h-8"
                                        onPointerDown={field?.onPointerDown}
                                    />
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col gap-y-2">
                            <label hidden htmlFor={"remarks"}>
                                {"Remarks"} (optional)
                            </label>

                            <TextareaAutosize
                                id={"remarks"}
                                rows={20}
                                minRows={3}
                                name={"remarks"}
                                placeholder="Remarks, Comments (optional)"
                                className="p-3 w-full resize-none appearance-none text-body text-sm font-normal font-sans leading-tight rounded-md outline-none placeholder:text-body-foreground border-2 xl:border border-muted bg-white dark:bg-dark-900 focus:border-2 lg:focus:border focus:outline-none focus:ring focus:ring-primary/20 focus:border-primary"
                            />

                            <p className="text-xs text-body-muted">
                                Provide additional context (for the reader) as necessary
                            </p>
                        </div>
                    </fieldset>
                </div>
            </div>
        </FormContainer>
    )
}

interface FormConfigProps {
    customizableFieldNames: string[]
    handleFieldSelection: (field: string) => void
    selectedFields: string[]
}

function FormConfig({ customizableFieldNames, handleFieldSelection, selectedFields }: FormConfigProps){
    return (
        <Popover>
            <PopoverTrigger className="p-1 size-6 flex items-center gap-x-4 text-base font-normal rounded-md transition-colors duration-200 bg-gray-100 dark:bg-neutral-700">
                <Settings2 className="size-4" />
            </PopoverTrigger>

            <PopoverContent side="right" align="start" className="p-0 w-80 rounded-xl bg-white/90 dark:bg-neutral-800 backdrop-blur-xs shadow-md dark:shadow-layered-depth">
                <div className="w-full flex flex-col">
                    <div className="px-4 py-2.5 h-fit flex flex-col gap-x-2 border-b">
                        <h5 className="text-[13px] font-medium">
                            Form Layout Settings
                        </h5>
                    </div>

                    <div className="">
                        <ul className="px-4 w-full flex flex-col">
                            {customizableFieldNames?.map(field => (
                                <li key={field} className="py-2 w-full flex justify-between items-center border-b border-gray-200 dark:border-neutral-700 last:border-none">
                                    <label htmlFor={field} className="text-[13px] capitalize">
                                        {field.replace('_', ' ')}
                                    </label>

                                    <Switch
                                        id={field}
                                        checked={selectedFields.includes(field)}
                                        onCheckedChange={
                                            () => handleFieldSelection(field)
                                        }
                                        className='h-4 w-7 *:data-[slot="switch-thumb"]:size-3'
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

"use client"

import React, { startTransition } from "react"
import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"

import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage, 
    FormDescription 
} from "@/components/ui/form"

import { toast } from "sonner"
import { createIncome, type IncomeFormState } from "../actions/create-income"
import { useUser } from "@/hooks/query/use-user"
import { IconPlus } from "@tabler/icons-react"
import { useReports } from "@/features/reports/core/hooks/use-reports"
import { format, parseISO } from "date-fns"
import { Spinner } from "@/components/ui/spinner"
import FormContainer from "@/features/reports/core/_components/FormContainer"

const formSchema = z.object({
    church: z.string().min(1, "Please select a church"),
    report: z.string().min(1, "Please select a report"),
    timestamp: z.string().min(1, "Date is required"),
    offering: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    fundraising: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    thanksgiving: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    donations: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    total_income: z.string(),
    notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const initialState: IncomeFormState = {
    message: "",
    httpStatusCode: -1,
    success: false,
    errors: {},
}

export function IncomeForm({ formId }: { formId: string }) {
    const { data: user } = useUser()
    const { data: reports, isLoading } = useReports({ year: "2025" })
    const formRef = React.useRef<HTMLFormElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [state, formAction, isPending] = React.useActionState(createIncome, initialState)
    const hasManyAssemblies = Boolean((user?.assemblies?.length ?? 0) > 1)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            church: String(user?.church) || "",
            report: "",
            timestamp: "",
            offering: "",
            fundraising: "",
            thanksgiving: "",
            donations: "",
            total_income: "",
            notes: "",
        },
    })

    // const watchedFields = form.watch(["offering", "fundraising", "thanksgiving", "donations"])

    // useEffect(() => {
    //     const [offering, fundraising, thanksgiving, donations] = watchedFields
    //     const total =
    //         (Number.parseFloat(offering) || 0) +
    //         (Number.parseFloat(fundraising) || 0) +
    //         (Number.parseFloat(thanksgiving) || 0) +
    //         (Number.parseFloat(donations) || 0)

    //     form.setValue("total_income", total.toFixed(2))
    // }, [watchedFields, form])

    React.useEffect(() => {
        if (state?.success) {
            toast.success(state.message || "Created successfully")
            form.reset()
            queueMicrotask(() => setSelectedFile(null))
        }

        if (state?.httpStatusCode !== -1 && state?.errors) {
            toast.error(state.message || "An error occurred")
        }
    }, [state, form])

    // const handleSubmit = async (data: FormData) => {
    //     setIsSubmitting(true)

    //     const formData = new FormData()
    //     Object.entries(data).forEach(([key, value]) => {
    //         formData.append(key, value || "")
    //     })

    //     if (selectedFile) {
    //         formData.append("statement", selectedFile)
    //     }

    //     formAction(formData)
    // }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setSelectedFile(file)
    }

    return (
        <div className="h-full">
            <FormContainer 
            ref={formRef}
            context={form} 
            action={formAction}
            onSubmit={(event) => {
                event.preventDefault()
                form.handleSubmit(() => {
                    startTransition(() => formAction(new FormData(formRef.current!)))
                })(event)
            }} 
            isPending={isPending} 
            onClick={() => form.reset()}
            >
                <div className="pt-6 px-4.5 h-full space-y-6">
                    <div className="px-1.5 flex flex-col gap-6">
                        <div className="pb-4 border-b border-dashed border-gray-300">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Spinner /> Loading reports...
                                </div>
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="report"
                                    render={({ field }) => (
                                        <FormItem className={`flex flex-col gap-2`}>
                                            <FormLabel className="mb-2">Report Period</FormLabel>
                                            <FormDescription className="text-xs font-normal leading-tight mb-2">
                                                Report Period is the month covered by your report. You can create or start a new one for each period.
                                            </FormDescription>
                                            <Select name="report" onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select report" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <div className="w-full border-b border-gray-200">
                                                        <button onClick={() => console.log("add report")} className="w-full flex items-center gap-2 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-sm">
                                                            <IconPlus className="size-4" /> Create new report
                                                        </button>
                                                    </div>

                                                    {reports?.map((report) => (
                                                        <SelectItem
                                                            key={report?.id}
                                                            value={String(report?.id)}>
                                                            {format(parseISO(report?.period_start), "MMM dd, yyyy")} –{" "}
                                                            {format(parseISO(report?.period_end), "MMM dd, yyyy")}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                            {state?.errors?.church && <p className="text-sm text-red-600">{state.errors.church.join(", ")}</p>}
                                        </FormItem>
                                    )}
                                /> 
                            )}
                        </div>

                        <FormField
                            control={form.control}
                            name="timestamp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Date
                                    </FormLabel>

                                    <FormControl>
                                        <Input 
                                            type="date" {...field} 
                                            onPointerDown={(e) => e.stopPropagation()} 
                                        />
                                    </FormControl>

                                    <FormMessage />
                                    {state?.errors?.timestamp && (
                                        <p className="text-sm text-red-600">{state.errors.timestamp.join(", ")}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="church"
                            render={({ field }) => (
                                <FormItem className={`flex gap-2 ${hasManyAssemblies ? "block" : "hidden"}`}>
                                    <FormLabel className="mb-2">Assembly</FormLabel>
                                    {hasManyAssemblies ? (
                                        <Select name="church" onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select church" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {user?.assemblies?.map((assembly) => (
                                                    <SelectItem
                                                        key={assembly?.id}
                                                        value={String(assembly?.id)}>
                                                        {assembly?.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <FormControl>
                                            <Input
                                                type="text" {...field}
                                            />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                    {state?.errors?.church && <p className="text-sm text-red-600">{state.errors.church.join(", ")}</p>}
                                </FormItem>
                            )}
                        />  
                    </div>

                    <fieldset className="px-1.5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="offering"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Offering</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" min="0" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    {state?.errors?.offering && (
                                        <p className="text-sm text-red-600">{state.errors.offering.join(", ")}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fundraising"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fundraising</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" min="0" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    {state?.errors?.fundraising && (
                                        <p className="text-sm text-red-600">{state.errors.fundraising.join(", ")}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="thanksgiving"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thanksgiving</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" min="0" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    {state?.errors?.thanksgiving && (
                                        <p className="text-sm text-red-600">{state.errors.thanksgiving.join(", ")}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="donations"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Donations</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" min="0" placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    {state?.errors?.donations && (
                                        <p className="text-sm text-red-600">{state.errors.donations.join(", ")}</p>
                                    )}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="total_income"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Total Income</FormLabel>
                                    <FormControl>
                                        <Input {...field} readOnly className="bg-gray-50 dark:bg-neutral-800 font-semibold text-lg" />
                                    </FormControl>
                                    <FormDescription>
                                        Automatically calculated from the income fields above
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem className="md:col-span-2">
                            <FormLabel htmlFor="statement">
                                Bank Statement
                            </FormLabel>

                            <FormControl>
                                <Input
                                    id="statement"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="file:mr-4 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100 dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700"
                                />
                            </FormControl>
                            <FormDescription>
                                Upload bank statement or supporting document
                            </FormDescription>

                            {selectedFile && (
                                <p className="text-sm text-green-600 dark:text-green-400">Selected: {selectedFile.name}</p>
                            )}
                            {state?.errors?.statement && <p className="text-sm text-red-600">{state.errors.statement.join(", ")}</p>}
                        </FormItem>
                    </fieldset>

                    <div className="mt-4 p-1.5">
                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Additional notes about this income record..." rows={4} {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                    {state?.errors?.notes && <p className="text-sm text-red-600">{state.errors.notes.join(", ")}</p>}
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            </FormContainer>
        </div>
    )
}

"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/features/auth/services/get-user"
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

import { createVariableExpenditure, VariableExpenditureFormState } from "../actions/create-variable-expenses"
import { Expense, expenseSchema } from "../schemas/variable-expenses"
import { expenseCategories } from "./choices/ExpenseTypeChoices"
import FormContainer from "@/features/reports/core/_components/FormContainer"
import { handleFormSubmit } from "@/utils/form-submitter"

const initialState: VariableExpenditureFormState = {
    message: "",
    errors: {},
}

export function VariableExpenditureForm() {
    const ref = React.useRef<HTMLFormElement>(null)
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
    const [state, formAction, isPending] = React.useActionState(createVariableExpenditure, initialState)

    const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: () => getUser()
    })

    const form = useForm<Expense>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            assembly: "",
            invoice_number: "",
            invoice_date: "",
            name: "",
            description: "",
            category: "",
            supplier: "",
            quantity: "1",
            price: "0.00",
            total: "0.00",
        },
    })

    const watchedFields = form.watch(["quantity", "price"])

    React.useEffect(() => {
        const [quantity, price] = watchedFields
        const total = (Number.parseFloat(quantity) || 0) * (Number.parseFloat(price) || 0)
        form.setValue("total", total.toFixed(2))
    }, [watchedFields, form])

    React.useEffect(() => {
        if (state?.success) {
            form.reset()
            setSelectedFile(null)
        }
    }, [state, form])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setSelectedFile(file)
    }

    async function submitExpense(formData: FormData) {
        formData.append("assembly", user?.church as unknown as string)
        formData.append("created_by", user?.id as unknown as string)
        await formAction(formData)
    }

    return (
        <FormContainer
            ref={ref}
            context={form}
            action={submitExpense}
            onSubmit={handleFormSubmit(form, ref, formAction)}
            isPending={isPending}
            onClick={() => form.reset()}
        >
            <section className="px-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="invoice_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Invoice Date</FormLabel>
                                <FormControl>
                                    <Input
                                        type="date" {...field}
                                        onPointerDown={(e) => e.stopPropagation()}
                                    />
                                </FormControl>
                                <FormMessage />
                                {state?.errors?.invoice_date && (
                                    <p className="text-sm text-red-600">{state.errors.invoice_date.join(", ")}</p>
                                )}
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="assembly"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assembly</FormLabel>
                                <Select name="assembly" onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select assembly" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="main-church">Main Church</SelectItem>
                                        <SelectItem value="branch-1">Branch Church 1</SelectItem>
                                        <SelectItem value="branch-2">Branch Church 2</SelectItem>
                                        <SelectItem value="satellite">Satellite Location</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                {state?.errors?.assembly && (
                                    <p className="text-sm text-red-600">{state.errors.assembly.join(", ")}</p>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="invoice_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Invoice Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter invoice number (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expense Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter expense name" {...field} />
                                </FormControl>
                                <FormMessage />
                                {state?.errors?.name && <p className="text-sm text-red-600">{state.errors.name.join(", ")}</p>}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select name="category" onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {expenseCategories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                {state?.errors?.category && (
                                    <p className="text-sm text-red-600">{state.errors.category.join(", ")}</p>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="supplier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supplier</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter supplier name (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" placeholder="1" {...field} />
                                </FormControl>
                                <FormMessage />
                                {state?.errors?.quantity && (
                                    <p className="text-sm text-red-600">{state.errors.quantity.join(", ")}</p>
                                )}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unit Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                                {state?.errors?.price && <p className="text-sm text-red-600">{state.errors.price.join(", ")}</p>}
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <FormField
                        control={form.control}
                        name="total"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Amount ($)</FormLabel>
                                <FormControl>
                                    <Input {...field} readOnly className="bg-gray-50 dark:bg-neutral-800 font-semibold text-lg" />
                                </FormControl>
                                <FormDescription>Automatically calculated (Quantity × Unit Price)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Additional details about this expense..." rows={3} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel htmlFor="receipt">Receipt</FormLabel>
                        <FormControl>
                            <Input
                                id="receipt"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={handleFileChange}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100 dark:file:bg-neutral-800 dark:file:text-neutral-300 dark:hover:file:bg-neutral-700"
                            />
                        </FormControl>

                        <FormDescription>
                            Upload receipt or invoice (PDF, Image, or Document)
                        </FormDescription>

                        {selectedFile && (
                            <p className="text-sm text-green-600 dark:text-green-400">Selected: {selectedFile.name}</p>
                        )}
                    </FormItem>
                </div>
            </section>
        </FormContainer>
    )
}









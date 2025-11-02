import * as z from "zod"

export const expenseSchema = z.object({
    assembly: z.string().min(1, "Please select an assembly"),
    invoice_number: z.string().optional(),
    invoice_date: z.string().min(1, "Invoice date is required"),
    name: z.string().min(1, "Expense name is required"),
    description: z.string().optional(),
    category: z.string().min(1, "Please select a category"),
    supplier: z.string().optional(),
    quantity: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: "Quantity must be a positive number",
    }),
    price: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Price must be a valid positive number",
    }),
    total: z.string(),
})

export type Expense = z.infer<typeof expenseSchema>
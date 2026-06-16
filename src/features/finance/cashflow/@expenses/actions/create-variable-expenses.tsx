"use server"

import { revalidatePath } from "next/cache"
import * as z from "zod"

const variableExpenditureSchema = z.object({
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

export type VariableExpenditureFormState = {
    errors?: {
        assembly?: string[]
        invoice_number?: string[]
        invoice_date?: string[]
        name?: string[]
        description?: string[]
        category?: string[]
        supplier?: string[]
        quantity?: string[]
        price?: string[]
        total?: string[]
        receipt?: string[]
        _form?: string[]
    }
    message?: string
    success?: boolean
}

export async function createVariableExpenditure(
    prevState: VariableExpenditureFormState,
    formData: FormData,
): Promise<VariableExpenditureFormState> {
    // Extract form data
    const rawFormData = {
        assembly: formData.get("assembly") as string,
        invoice_number: formData.get("invoice_number") as string,
        invoice_date: formData.get("invoice_date") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        supplier: formData.get("supplier") as string,
        quantity: formData.get("quantity") as string,
        price: formData.get("price") as string,
        total: formData.get("total") as string,
    }

    // Get the uploaded file
    const receipt = formData.get("receipt") as File | null

    // Validate the form data
    const validatedFields = variableExpenditureSchema.safeParse(rawFormData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors below.",
        }
    }

    // Validate file if provided
    if (receipt && receipt.size > 0) {
        const maxSize = 10 * 1024 * 1024 // 10MB
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]

        if (receipt.size > maxSize) {
            return {
                errors: {
                    receipt: ["File size must be less than 10MB"],
                },
                message: "File validation failed.",
            }
        }

        if (!allowedTypes.includes(receipt.type)) {
            return {
                errors: {
                    receipt: ["File type not supported. Please upload PDF, Image, or Document files."],
                },
                message: "File validation failed.",
            }
        }
    }

    const data = validatedFields.data

    try {
        // Convert string values to numbers for calculation
        const quantity = Number.parseInt(data.quantity) || 0
        const price = Number.parseFloat(data.price) || 0
        const calculatedTotal = quantity * price

        // Prepare the data for Django API
        const expenditureData = {
            assembly: data.assembly,
            invoice_number: data.invoice_number || "",
            invoice_date: data.invoice_date,
            name: data.name,
            description: data.description || "",
            category: data.category,
            supplier: data.supplier || "",
            quantity: quantity,
            price: price.toFixed(2),
            total: calculatedTotal.toFixed(2),
        }

        // Handle file upload if present
        let receiptUrl = null
        if (receipt && receipt.size > 0) {
            const fileName = `${Date.now()}_${receipt.name}`
            receiptUrl = `/uploads/expenditure_receipts/${fileName}`
            console.log(`File would be uploaded: ${fileName}`)
        }

        // Make API call to Django backend
        const response = await fetch(`${process.env.DJANGO_API_URL}/api/expenditure/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...expenditureData,
                receipt: receiptUrl,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Django API Error:", errorData)

            return {
                errors: {
                    _form: ["Failed to save variable expenditure record. Please try again."],
                },
                message: "Server error occurred.",
            }
        }

        const savedExpenditure = await response.json()
        console.log("Variable expenditure saved successfully:", savedExpenditure)

        revalidatePath("/")

        return {
            message: "Variable expenditure record created successfully!",
            success: true,
        }
    } catch (error) {
        console.error("Error creating variable expenditure:", error)
        return {
            errors: {
                _form: ["An unexpected error occurred. Please try again."],
            },
            message: "Failed to create variable expenditure record.",
        }
    }
}

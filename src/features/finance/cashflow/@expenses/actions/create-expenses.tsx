"use server"

import { revalidatePath } from "next/cache"
import * as z from "zod"

const fixedExpenditureSchema = z.object({
    assembly: z.string().min(1, "Please select an assembly"),
    timestamp: z.string().min(1, "Date is required"),
    rent: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    water: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    electricity: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    telephone: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    internet: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    security: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    fuel: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    wages: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    insurance: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    humanitarian: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    investment: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    car_maintenance: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    bank_charges: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    remittance: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Must be a valid positive number",
    }),
    total: z.string(),
    remarks: z.string().optional(),
    remittance_moderator: z.string().optional(),
    is_remittance_verified: z.string().transform((val) => val === "true"),
})

export type FixedExpenditureFormState = {
    errors?: {
        assembly?: string[]
        timestamp?: string[]
        rent?: string[]
        water?: string[]
        electricity?: string[]
        telephone?: string[]
        internet?: string[]
        security?: string[]
        fuel?: string[]
        wages?: string[]
        insurance?: string[]
        humanitarian?: string[]
        investment?: string[]
        car_maintenance?: string[]
        bank_charges?: string[]
        remittance?: string[]
        total?: string[]
        remarks?: string[]
        remittance_moderator?: string[]
        is_remittance_verified?: string[]
        remittance_receipt?: string[]
        _form?: string[]
    }
    message?: string
    success?: boolean
}

export async function createFixedExpenditure(
    prevState: FixedExpenditureFormState,
    formData: FormData,
): Promise<FixedExpenditureFormState> {
    // Extract form data
    const rawFormData = {
        assembly: formData.get("assembly") as string,
        timestamp: formData.get("timestamp") as string,
        rent: formData.get("rent") as string,
        water: formData.get("water") as string,
        electricity: formData.get("electricity") as string,
        telephone: formData.get("telephone") as string,
        internet: formData.get("internet") as string,
        security: formData.get("security") as string,
        fuel: formData.get("fuel") as string,
        wages: formData.get("wages") as string,
        insurance: formData.get("insurance") as string,
        humanitarian: formData.get("humanitarian") as string,
        investment: formData.get("investment") as string,
        car_maintenance: formData.get("car_maintenance") as string,
        bank_charges: formData.get("bank_charges") as string,
        remittance: formData.get("remittance") as string,
        total: formData.get("total") as string,
        remarks: formData.get("remarks") as string,
        remittance_moderator: formData.get("remittance_moderator") as string,
        is_remittance_verified: formData.get("is_remittance_verified") as string,
    }

    // Get the uploaded file
    const remittance_receipt = formData.get("remittance_receipt") as File | null

    // Validate the form data
    const validatedFields = fixedExpenditureSchema.safeParse(rawFormData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors below.",
        }
    }

    // Validate file if provided
    if (remittance_receipt && remittance_receipt.size > 0) {
        const maxSize = 10 * 1024 * 1024 // 10MB
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]

        if (remittance_receipt.size > maxSize) {
            return {
                errors: {
                    remittance_receipt: ["File size must be less than 10MB"],
                },
                message: "File validation failed.",
            }
        }

        if (!allowedTypes.includes(remittance_receipt.type)) {
            return {
                errors: {
                    remittance_receipt: ["File type not supported. Please upload PDF, Image, or Document files."],
                },
                message: "File validation failed.",
            }
        }
    }

    const data = validatedFields.data

    try {
        // Convert string values to numbers for calculation
        const expenseAmounts = {
            rent: Number.parseFloat(data.rent) || 0,
            water: Number.parseFloat(data.water) || 0,
            electricity: Number.parseFloat(data.electricity) || 0,
            telephone: Number.parseFloat(data.telephone) || 0,
            internet: Number.parseFloat(data.internet) || 0,
            security: Number.parseFloat(data.security) || 0,
            fuel: Number.parseFloat(data.fuel) || 0,
            wages: Number.parseFloat(data.wages) || 0,
            insurance: Number.parseFloat(data.insurance) || 0,
            humanitarian: Number.parseFloat(data.humanitarian) || 0,
            investment: Number.parseFloat(data.investment) || 0,
            car_maintenance: Number.parseFloat(data.car_maintenance) || 0,
            bank_charges: Number.parseFloat(data.bank_charges) || 0,
            remittance: Number.parseFloat(data.remittance) || 0,
        }

        const calculatedTotal = Object.values(expenseAmounts).reduce((sum, amount) => sum + amount, 0)

        // Prepare the data for Django API
        const expenditureData = {
            assembly: data.assembly,
            timestamp: data.timestamp,
            ...Object.fromEntries(Object.entries(expenseAmounts).map(([key, value]) => [key, value.toFixed(2)])),
            total: calculatedTotal.toFixed(2),
            remarks: data.remarks || "",
            remittance_moderator: data.remittance_moderator || null,
            is_remittance_verified: data.is_remittance_verified,
        }

        // Handle file upload if present
        let receiptUrl = null
        if (remittance_receipt && remittance_receipt.size > 0) {
            const fileName = `${Date.now()}_${remittance_receipt.name}`
            receiptUrl = `/uploads/remittance_receipts/${fileName}`
            console.log(`File would be uploaded: ${fileName}`)
        }

        // Make API call to Django backend
        const response = await fetch(`${process.env.DJANGO_API_URL}/api/fixed-expenditure/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...expenditureData,
                remittance_receipt: receiptUrl,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Django API Error:", errorData)

            return {
                errors: {
                    _form: ["Failed to save fixed expenditure record. Please try again."],
                },
                message: "Server error occurred.",
            }
        }

        const savedExpenditure = await response.json()
        console.log("Fixed expenditure saved successfully:", savedExpenditure)

        revalidatePath("/")

        return {
            message: "Fixed expenditure record created successfully!",
            success: true,
        }
    } catch (error) {
        console.error("Error creating fixed expenditure:", error)
        return {
            errors: {
                _form: ["An unexpected error occurred. Please try again."],
            },
            message: "Failed to create fixed expenditure record.",
        }
    }
}

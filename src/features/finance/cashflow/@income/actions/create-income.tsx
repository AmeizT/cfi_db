"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { incomeSchema } from "../schemas/income"
import { url } from "@/config/urls"

export type IncomeFormState = {
    errors?: {
        church?: string[]
        report?: string[]
        timestamp?: string[]
        offering?: string[]
        fundraising?: string[]
        thanksgiving?: string[]
        donations?: string[]
        total_income?: string[]
        notes?: string[]
        statement?: string[]
        _form?: string[]
    }
    message?: string
    success?: boolean
    httpStatusCode: number
}

export async function createIncome(prevState: IncomeFormState, formData: FormData): Promise<IncomeFormState> {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    const rawFormData = {
        church: formData.get("church") as string,
        report: formData.get("report") as string,
        timestamp: formData.get("timestamp") as string,
        offering: formData.get("offering") as string,
        fundraising: formData.get("fundraising") as string,
        thanksgiving: formData.get("thanksgiving") as string,
        donations: formData.get("donations") as string,
        total_income: formData.get("total_income") as string,
        notes: formData.get("notes") as string,
    }

    const statement = formData.get("statement") as File | null
    const validatedFields = incomeSchema.safeParse(rawFormData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors below.",
            httpStatusCode: 400,
        }
    }

    if (statement && statement.size > 0) {
        const maxSize = 10 * 1024 * 1024 // 10MB
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]

        if (statement.size > maxSize) {
            return {
                errors: {
                    statement: ["File size must be less than 10MB"],
                },
                message: "File validation failed.",
                httpStatusCode: 400,
            }
        }

        if (!allowedTypes.includes(statement.type)) {
            return {
                errors: {
                    statement: ["File type not supported. Please upload PDF, Image, or Document files."],
                },
                message: "File validation failed.",
                httpStatusCode: 400,
            }
        }
    }

    const { church, report, timestamp, offering, fundraising, thanksgiving, donations, notes } =
        validatedFields.data

    try {
        const offeringAmount = Number.parseFloat(offering) || 0
        const fundraisingAmount = Number.parseFloat(fundraising) || 0
        const thanksgivingAmount = Number.parseFloat(thanksgiving) || 0
        const donationsAmount = Number.parseFloat(donations) || 0

        const payload = {
            church: church,
            report: report,
            timestamp: timestamp,
            offering: offeringAmount.toFixed(2),
            fundraising: fundraisingAmount.toFixed(2),
            thanksgiving: thanksgivingAmount.toFixed(2),
            donations: donationsAmount.toFixed(2),
            notes: notes || "",
        }

        const response = await fetch(url.income, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${accessToken}`,
            },
            body: JSON.stringify({
                ...payload,
                statement: null,
            }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Django API Error:", errorData)

            return {
                errors: {
                    _form: ["Failed to save income record. Please try again."],
                },
                message: "Server error occurred.",
                httpStatusCode: response?.status || 500,
            }
        }

        const savedIncome = await response.json()
        console.log("Income saved successfully:", savedIncome)

        console.log(response)

        revalidatePath("/")

        return {
            message: "Income record created successfully!",
            success: true,
            httpStatusCode: response?.status || 201,
        }
    } catch (error) {
        console.error("Error creating income:", error)
        return {
            errors: {
                _form: ["An unexpected error occurred. Please try again."],
            },
            message: "Failed to create income record.",
            httpStatusCode: 400
        }
    }
}

export async function updateIncome(
    id: string,
    prevState: IncomeFormState,
    formData: FormData,
): Promise<IncomeFormState> {
    const rawFormData = {
        church: formData.get("church") as string,
        timestamp: formData.get("timestamp") as string,
        offering: formData.get("offering") as string,
        fundraising: formData.get("fundraising") as string,
        thanksgiving: formData.get("thanksgiving") as string,
        donations: formData.get("donations") as string,
        total_income: formData.get("total_income") as string,
        notes: formData.get("notes") as string,
    }

    const validatedFields = incomeSchema.safeParse(rawFormData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors below.",
            httpStatusCode: -1,
        }
    }

    try {
        const { church, timestamp, offering, fundraising, thanksgiving, donations, notes } =
            validatedFields.data

        const offeringAmount = Number.parseFloat(offering) || 0
        const fundraisingAmount = Number.parseFloat(fundraising) || 0
        const thanksgivingAmount = Number.parseFloat(thanksgiving) || 0
        const donationsAmount = Number.parseFloat(donations) || 0
        const calculatedTotal = offeringAmount + fundraisingAmount + thanksgivingAmount + donationsAmount

        const incomeData = {
            church: church,
            timestamp: timestamp,
            offering: offeringAmount.toFixed(2),
            fundraising: fundraisingAmount.toFixed(2),
            thanksgiving: thanksgivingAmount.toFixed(2),
            donations: donationsAmount.toFixed(2),
            total_income: calculatedTotal.toFixed(2),
            notes: notes || "",
        }

        const response = await fetch(`${process.env.DJANGO_API_URL}/api/income/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(incomeData),
        })

        if (!response.ok) {
            return {
                errors: {
                    _form: ["Failed to update income record. Please try again."],
                },
                message: "Server error occurred.",
                httpStatusCode: response?.status || 500,
            }
        }

        revalidatePath("/")

        return {
            message: "Income record updated successfully!",
            success: true,
            httpStatusCode: response?.status || 200
        }
    } catch (error) {
        console.error("Error updating income:", error)
        return {
            errors: {
                _form: ["An unexpected error occurred. Please try again."],
            },
            message: "Failed to update income record.",
            httpStatusCode: 400
        }
    }
}

// Action to delete income record
export async function deleteIncome(id: string): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(`${process.env.DJANGO_API_URL}/api/income/${id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            return {
                success: false,
                message: "Failed to delete income record.",
            }
        }

        revalidatePath("/")

        return {
            success: true,
            message: "Income record deleted successfully!",
        }
    } catch (error) {
        console.error("Error deleting income:", error)
        return {
            success: false,
            message: "An unexpected error occurred.",
        }
    }
}

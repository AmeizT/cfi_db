"use server"

import { cookies } from "next/headers"
import { url } from "@/config/urls"
import { withJwt } from "@/config/headers"

export async function getAssets() {
    const cookieStore = await cookies()
    const assetsUrl = url.assets
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined

    try {
        const res = await fetch(assetsUrl, withJwt(accessToken))
        if (!res.ok) {
            throw new Error("Failed to fetch assets. Please try again later.")
        }
        const assets = await res.json()
        return assets
    } catch (error) {
        throw error
    }
}

export async function getIncome(incomeId?: string) {
    const cookieStore = await cookies()
    const incomeURL = incomeId ? `${url.income}${incomeId}` : url.income
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value

    try {
        const response = await fetch(incomeURL, withJwt(accessToken))
        if (!response.ok) {
            console.log(response)
            throw response
        }
        const income = await response.json()
        return income
    } catch (error) {
        console.error("Error fetching income data:", error)
        throw error
    }
}

export async function getFlexibleExpenses() {
    const cookieStore = await cookies()
    const expenditureUrl = url.expenditures
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined
    const bearerHeaders = withJwt(accessToken)

    try {
        const res = await fetch(expenditureUrl, bearerHeaders)
        if (!res.ok) {
            throw new Error("Failed to fetch expenditures. Please try again later.")
        }
        const expenditure = await res.json()
        return expenditure
    } catch (error) {
        throw error
    }
}

export async function getFixedExpenses() {
    const cookieStore = await cookies()
    const accessToken: string | undefined = cookieStore.get("accessToken")?.value ?? undefined
    const bearerHeaders = withJwt(accessToken)

    try {
        const res = await fetch(url.regularExpenditures, bearerHeaders)
        if (!res.ok) {
            throw new Error("Failed to fetch expenditures. Please try again later.")
        }
        const expenditure = await res.json()
        return expenditure
    } catch (error) {
        throw error
    }
}
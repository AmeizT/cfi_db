"use server"

import { cookies } from "next/headers"
import { getServerUrl } from "@/config/urls"
import type { ContributorResponse, SummaryResponse } from "./types"

async function read<T>(kind: string, params: Record<string, string>): Promise<T> {
    const cookieStore = await cookies()
    const response = await fetch(`${getServerUrl(`api/v1/reports/summaries/${kind}`)}?${new URLSearchParams(params)}`, {
        headers: { Cookie: cookieStore.toString() }, cache: "no-store",
    })
    if (!response.ok) {
        if ([401, 403, 404].includes(response.status)) throw new Error("You do not have access to this summary. Select an authorized region or assembly.")
        if (response.status === 400) throw new Error("Choose a valid month and assembly to load the summary.")
        throw new Error("The summary could not be loaded. Please try again.")
    }
    return response.json()
}
export async function getSummary(kind: "regional" | "assembly", params: Record<string, string>) {
    return read<SummaryResponse>(kind, params)
}
export async function getSummaryContributors(params: Record<string, string>) {
    return read<ContributorResponse>("contributors", params)
}

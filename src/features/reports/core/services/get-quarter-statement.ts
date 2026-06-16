"use server"

import { cookies } from "next/headers"
import { 
    AttendanceStatement, 
    QuarterResponse, 
    TithesQuarterStatement 
} from "../../statements/types/summary.types"


export type ReportTab = "attendance" | "tithes"

export type ReportMap = {
    attendance: AttendanceStatement
    tithes: TithesQuarterStatement
}

export async function getQuarterStatement<T extends ReportTab>(
    tab: T,
    q: string,
    period: string
): Promise<QuarterResponse<ReportMap[T]>> {
        
    const cookieStore = await cookies()

    const url = `http://localhost:8000/api/v1/reports/${tab}/quarter/?period=${period}&q=${q}`;

    const response = await fetch(url, {
        headers: {
        Cookie: cookieStore.toString(),
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch the statement. Please try again later.");
    }

    return response.json();
}

export async function getAttendanceQuarter(q: string, period: string) {
    return await getQuarterStatement("attendance", q, period);
}

export async function getTithesQuarter(q: string, period: string) {
    return await getQuarterStatement("tithes", q, period);
}



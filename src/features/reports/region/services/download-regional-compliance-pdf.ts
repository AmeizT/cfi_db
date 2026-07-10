import { getServerUrl } from "@/config/urls"

export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export const MONTH_OPTIONS: Array<{ value: MonthNumber; label: string }> = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
]

type DownloadRegionalCompliancePdfInput = {
    regionId: string | number
    year: number
    fromMonth: MonthNumber
    toMonth: MonthNumber
    zoneId?: string | number | null
    country?: string | null
}

function getRegionalCompliancePdfUrl(regionId: string | number) {
    return getServerUrl(
        `api/v1/reports/region/${regionId}/compliance/monthly-report.pdf`,
        { trailingSlash: false }
    )
}

function parseFilename(contentDisposition: string | null) {
    if (!contentDisposition) return null

    const encodedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
    if (encodedMatch?.[1]) {
        return decodeURIComponent(encodedMatch[1].replace(/"/g, ""))
    }

    const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i)
    return filenameMatch?.[1] ?? null
}

async function getErrorMessage(response: Response) {
    const fallback = "Unable to generate the compliance report."
    const text = await response.text()

    if (!text) return fallback

    try {
        const data = JSON.parse(text) as {
            detail?: string
            error?: string
            non_field_errors?: string[]
        }

        return (
            data.detail ??
            data.error ??
            data.non_field_errors?.[0] ??
            Object.values(data).flat().join(" ") ??
            fallback
        )
    } catch {
        return text
    }
}

function triggerDownload(blob: Blob, filename: string) {
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

export async function downloadRegionalCompliancePdf({
    regionId,
    year,
    fromMonth,
    toMonth,
    zoneId,
    country,
}: DownloadRegionalCompliancePdfInput) {
    const params = new URLSearchParams({
        year: String(year),
        from_month: String(fromMonth),
        to_month: String(toMonth),
    })

    if (zoneId) {
        params.set("zone_id", String(zoneId))
    }

    if (country) {
        params.set("country", country)
    }

    const response = await fetch(
        `${getRegionalCompliancePdfUrl(regionId)}?${params.toString()}`,
        {
            credentials: "include",
            method: "GET",
        }
    )

    if (!response.ok) {
        throw new Error(await getErrorMessage(response))
    }

    const blob = await response.blob()
    const filename =
        parseFilename(response.headers.get("Content-Disposition")) ??
        `regional-compliance-${year}.pdf`

    triggerDownload(blob, filename)
}

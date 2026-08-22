import { apiRoutes } from "@/config/urls"
import type {
    CBAStudent,
    Examination,
    ExaminationImport,
    ImportRow,
    MatchStatus,
    StudentSummaryPage,
    Transcript,
} from "./types"

async function parseError(response: Response) {
    const body = await response.json().catch(() => null)
    if (body?.detail) return body.detail as string
    if (body && typeof body === "object") {
        return Object.values(body).flat().join(" ")
    }
    return "The request could not be completed."
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(url, {
        ...init,
        credentials: "include",
        headers: {
            ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...init.headers,
        },
    })
    if (!response.ok) throw new Error(await parseError(response))
    return response.json() as Promise<T>
}

export const getExaminations = () => request<Examination[]>(apiRoutes.examinations.list())
export const createExamination = (payload: {
    name: string
    academic_year: number
    examination_date: string
    total_marks: number
    pass_mark: number
}) => request<Examination>(apiRoutes.examinations.list(), {
    method: "POST",
    body: JSON.stringify(payload),
})

export function uploadExaminationPdf(
    examinationId: number,
    file: File,
    onProgress?: (progress: number) => void,
) {
    return new Promise<ExaminationImport>((resolve, reject) => {
        const body = new FormData()
        body.append("pdf_file", file)
        const xhr = new XMLHttpRequest()
        xhr.open("POST", apiRoutes.examinations.imports(examinationId))
        xhr.withCredentials = true
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) onProgress?.(Math.round(event.loaded / event.total * 100))
        }
        xhr.onload = () => {
            let data: unknown
            try { data = JSON.parse(xhr.responseText) } catch { data = null }
            if (xhr.status >= 200 && xhr.status < 300) resolve(data as ExaminationImport)
            else reject(new Error(
                data && typeof data === "object" && "detail" in data
                    ? String(data.detail)
                    : "PDF upload or extraction failed."
            ))
        }
        xhr.onerror = () => reject(new Error("PDF upload failed. Check your connection and try again."))
        xhr.send(body)
    })
}

export const getImport = (id: number) => request<ExaminationImport>(apiRoutes.examinationImports.detail(id))
export const getImportRows = (id: number, status?: MatchStatus | "all") => request<ImportRow[]>(
    `${apiRoutes.examinationImports.rows(id)}${status && status !== "all" ? `?match_status=${status}` : ""}`
)
export const updateImportRow = ({ id, ...payload }: Partial<ImportRow> & { id: number }) =>
    request<ImportRow>(apiRoutes.examinationImportRows.detail(id), {
        method: "PATCH",
        body: JSON.stringify(payload),
    })
export const confirmImport = (id: number) => request<{ import: ExaminationImport; created_count: number; updated_count: number }>(
    apiRoutes.examinationImports.confirm(id),
    { method: "POST", body: JSON.stringify({ allow_partial: false }) },
)
export const getCBAStudents = () => request<CBAStudent[]>(`${apiRoutes.cbaStudents.list()}?is_active=true`)

export type StudentSummaryParams = {
    page?: number
    page_size?: number
    search?: string
    academic_year?: string
    final_grade?: string
    no_results?: boolean
    incomplete?: boolean
    ordering?: string
}
export function getStudentSummaries(params: StudentSummaryParams) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== false) query.set(key, String(value))
    })
    return request<StudentSummaryPage>(`${apiRoutes.examinationStudents.list()}?${query}`)
}
export const getTranscript = (id: number) => request<Transcript>(apiRoutes.examinationStudents.transcript(id))
export async function downloadTranscript(id: number) {
    const response = await fetch(apiRoutes.examinationStudents.transcriptPdf(id), { credentials: "include" })
    if (!response.ok) throw new Error(await parseError(response))
    const blob = await response.blob()
    const disposition = response.headers.get("Content-Disposition") ?? ""
    const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? "transcript.pdf"
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = objectUrl
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(objectUrl)
}

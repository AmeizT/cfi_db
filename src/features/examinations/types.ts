export type AcademicYear = "2024" | "2025" | "2026"
export type ResultStatus = "scored" | "absent" | "withheld" | "cancelled"
export type MatchStatus = "matched" | "unmatched" | "invalid" | "duplicate" | "excluded"

export type Examination = {
    id: number
    name: string
    academic_year: number
    examination_date: string
    total_marks: string
    pass_mark: string | null
    status: "draft" | "published" | "archived"
    result_count: number
    import_count: number
}

export type ExaminationImport = {
    id: number
    examination: number
    examination_name: string
    original_filename: string
    status: "uploaded" | "processing" | "review_required" | "completed" | "failed"
    total_rows: number
    matched_rows: number
    unmatched_rows: number
    invalid_rows: number
    duplicate_rows: number
    excluded_rows: number
    error_message: string
}

export type ImportRow = {
    id: number
    row_number: number | null
    raw_student_number: string
    normalized_student_number: string
    raw_result: string
    score: string | null
    result_status: ResultStatus | null
    matched_student: number | null
    student_name: string
    student_number: string
    match_status: MatchStatus
    validation_message: string
}

export type CBAStudent = {
    id: number
    student_number: string
    full_name: string
    is_active: boolean
}

export type StudentSummary = {
    id: number
    student_number: string
    full_name: string
    examinations_written: number
    yearly_averages: Record<AcademicYear, string | null>
    overall_average: string | null
    final_grade: string | null
    overall_result: "Pass" | "Fail" | null
}

export type StudentSummaryPage = {
    count: number
    page: number
    page_size: number
    results: StudentSummary[]
}

export type TranscriptResult = {
    id: number
    examination_name: string
    examination_date: string | null
    score: string | null
    total_marks: string
    percentage: string | null
    status: ResultStatus
    grade: string | null
}

export type Transcript = Omit<StudentSummary, "id" | "student_number" | "full_name"> & {
    student: { id: number; student_number: string; full_name: string }
    academic_period: string
    generated_date: string
    results: Record<AcademicYear, TranscriptResult[]>
}

"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    confirmImport,
    createExamination,
    downloadTranscript,
    getCBAStudents,
    getExaminations,
    getImport,
    getImportRows,
    getStudentSummaries,
    getTranscript,
    updateImportRow,
    uploadExaminationPdf,
    type StudentSummaryParams,
} from "./service"
import type { MatchStatus } from "./types"

export const examinationKeys = {
    all: ["examinations"] as const,
    imports: (id: number) => ["examination-imports", id] as const,
    rows: (id: number, status: string) => ["examination-import-rows", id, status] as const,
    students: (params: StudentSummaryParams) => ["examination-students", params] as const,
    transcript: (id: number) => ["examination-transcript", id] as const,
    cbaStudents: ["cba-students"] as const,
}

export const useExaminations = () => useQuery({ queryKey: examinationKeys.all, queryFn: getExaminations })
export function useCreateExamination() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: createExamination,
        onSuccess: () => client.invalidateQueries({ queryKey: examinationKeys.all }),
    })
}
export const useUploadExaminationPdf = () => useMutation({
    mutationFn: ({ examinationId, file, onProgress }: { examinationId: number; file: File; onProgress?: (value: number) => void }) =>
        uploadExaminationPdf(examinationId, file, onProgress),
})
export const useExaminationImport = (id: number | null) => useQuery({
    queryKey: examinationKeys.imports(id ?? 0),
    queryFn: () => getImport(id!),
    enabled: Boolean(id),
    refetchInterval: (query) => ["uploaded", "processing"].includes(query.state.data?.status ?? "") ? 1500 : false,
})
export const useImportRows = (id: number | null, status: MatchStatus | "all") => useQuery({
    queryKey: examinationKeys.rows(id ?? 0, status),
    queryFn: () => getImportRows(id!, status),
    enabled: Boolean(id),
})
export const useCBAStudents = () => useQuery({ queryKey: examinationKeys.cbaStudents, queryFn: getCBAStudents })
export function useUpdateImportRow(importId: number | null) {
    const client = useQueryClient()
    return useMutation({
        mutationFn: updateImportRow,
        onSuccess: () => {
            if (!importId) return
            client.invalidateQueries({ queryKey: ["examination-import-rows", importId] })
            client.invalidateQueries({ queryKey: examinationKeys.imports(importId) })
        },
    })
}
export function useConfirmImport() {
    const client = useQueryClient()
    return useMutation({
        mutationFn: confirmImport,
        onSuccess: (_, id) => {
            client.invalidateQueries({ queryKey: examinationKeys.imports(id) })
            client.invalidateQueries({ queryKey: ["examination-students"] })
            client.invalidateQueries({ queryKey: examinationKeys.all })
        },
    })
}
export const useStudentSummaries = (params: StudentSummaryParams) => useQuery({
    queryKey: examinationKeys.students(params),
    queryFn: () => getStudentSummaries(params),
})
export const useStudentTranscript = (id: number) => useQuery({
    queryKey: examinationKeys.transcript(id),
    queryFn: () => getTranscript(id),
    enabled: Boolean(id),
})
export const useDownloadTranscript = () => useMutation({ mutationFn: downloadTranscript })

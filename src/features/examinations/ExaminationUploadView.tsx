"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import View from "@/components/ui/view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    useCBAStudents,
    useConfirmImport,
    useCreateExamination,
    useExaminationImport,
    useExaminations,
    useImportRows,
    useUpdateImportRow,
    useUploadExaminationPdf,
} from "./hooks"
import type { MatchStatus } from "./types"

const FILTERS: Array<{ value: MatchStatus | "all"; label: string }> = [
    { value: "all", label: "All" }, { value: "matched", label: "Matched" },
    { value: "unmatched", label: "Unmatched" }, { value: "invalid", label: "Invalid" },
    { value: "duplicate", label: "Duplicate" }, { value: "excluded", label: "Excluded" },
]

export function ExaminationUploadView() {
    const examinations = useExaminations()
    const create = useCreateExamination()
    const upload = useUploadExaminationPdf()
    const confirm = useConfirmImport()
    const [creating, setCreating] = React.useState(false)
    const [examinationId, setExaminationId] = React.useState<number | null>(null)
    const [file, setFile] = React.useState<File | null>(null)
    const [progress, setProgress] = React.useState(0)
    const [importId, setImportId] = React.useState<number | null>(null)
    const [filter, setFilter] = React.useState<MatchStatus | "all">("all")
    const importQuery = useExaminationImport(importId)
    const rowsQuery = useImportRows(importId, filter)
    const students = useCBAStudents()
    const updateRow = useUpdateImportRow(importId)
    const batch = importQuery.data
    const selectedExaminationId = examinationId ?? examinations.data?.[0]?.id ?? null

    async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        try {
            const examination = await create.mutateAsync({
                name: String(data.get("name")), academic_year: Number(data.get("academic_year")),
                examination_date: String(data.get("examination_date")), total_marks: Number(data.get("total_marks")),
                pass_mark: Number(data.get("pass_mark")),
            })
            setExaminationId(examination.id); setCreating(false)
            toast.success("Examination created. You can now upload its results PDF.")
        } catch (error) { toast.error(error instanceof Error ? error.message : "Could not create examination.") }
    }

    async function handleUpload() {
        if (!selectedExaminationId || !file) return toast.error("Select an examination and PDF first.")
        setProgress(0)
        try {
            const result = await upload.mutateAsync({ examinationId: selectedExaminationId, file, onProgress: setProgress })
            setImportId(result.id); setProgress(100)
            if (result.status === "failed") toast.error(result.error_message || "PDF extraction failed.")
            else toast.success("PDF extracted. Review the rows before confirming the import.")
        } catch (error) { toast.error(error instanceof Error ? error.message : "PDF upload failed.") }
    }

    async function handleStudent(rowId: number, studentId: string) {
        if (!studentId) return
        try {
            await updateRow.mutateAsync({ id: rowId, matched_student: Number(studentId), validation_message: "" })
            toast.success("Student match updated.")
        } catch (error) { toast.error(error instanceof Error ? error.message : "Could not update row.") }
    }

    async function excludeRow(rowId: number) {
        try {
            await updateRow.mutateAsync({ id: rowId, match_status: "excluded", matched_student: null })
            toast.success("Row excluded from this import.")
        } catch (error) { toast.error(error instanceof Error ? error.message : "Could not exclude row.") }
    }

    async function handleConfirm() {
        if (!importId) return
        try {
            const result = await confirm.mutateAsync(importId)
            toast.success(`Import completed: ${result.created_count} created, ${result.updated_count} updated.`)
        } catch (error) { toast.error(error instanceof Error ? error.message : "Import confirmation failed.") }
    }

    const unresolved = (batch?.unmatched_rows ?? 0) + (batch?.invalid_rows ?? 0) + (batch?.duplicate_rows ?? 0)

    return (
        <View>
            <View.Header pagename="Upload examination results" actions={<Button variant="outline" asChild><Link href="/students/examinations">Student results directory</Link></Button>} />
            <View.Body className="gap-6 py-4">
                <Card>
                    <CardHeader><CardTitle>1. Select or create an examination</CardTitle><CardDescription>Results will be normalized using the examination&apos;s total marks.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        {!creating ? <div className="flex flex-col gap-2 sm:flex-row">
                            <NativeSelect className="min-w-72" value={selectedExaminationId ?? ""} onChange={(event) => setExaminationId(Number(event.target.value))} disabled={examinations.isLoading}>
                                {!examinations.data?.length && <option value="">No examinations available</option>}
                                {examinations.data?.map((exam) => <option key={exam.id} value={exam.id}>{exam.academic_year} · {exam.name} ({exam.total_marks} marks)</option>)}
                            </NativeSelect>
                            <Button variant="outline" onClick={() => setCreating(true)}>Create examination</Button>
                        </div> : <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <Field label="Examination name"><Input name="name" required /></Field>
                            <Field label="Academic year"><NativeSelect name="academic_year" className="w-full" required><option>2024</option><option>2025</option><option>2026</option></NativeSelect></Field>
                            <Field label="Examination date"><Input name="examination_date" type="date" required /></Field>
                            <Field label="Total marks"><Input name="total_marks" type="number" min="0.01" step="0.01" required /></Field>
                            <Field label="Pass mark"><Input name="pass_mark" type="number" min="0" step="0.01" required /></Field>
                            <div className="flex gap-2 md:col-span-2 lg:col-span-5"><Button type="submit" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create examination"}</Button><Button type="button" variant="ghost" onClick={() => setCreating(false)}>Cancel</Button></div>
                        </form>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>2. Upload results PDF</CardTitle><CardDescription>Upload a text-based PDF containing student numbers and scores or statuses.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <Input type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                        {(upload.isPending || progress > 0) && <div className="space-y-2"><div className="flex justify-between text-sm"><span>{upload.isPending && progress >= 100 ? "Processing PDF…" : "Uploading PDF…"}</span><span>{progress}%</span></div><Progress value={progress} /></div>}
                        <Button onClick={handleUpload} disabled={!file || !selectedExaminationId || upload.isPending}>{upload.isPending ? "Uploading and extracting…" : "Upload and extract results"}</Button>
                    </CardContent>
                </Card>

                {batch && <Card>
                    <CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>3. Review extracted rows</CardTitle><CardDescription>{batch.original_filename} · {batch.total_rows} rows</CardDescription></div><StatusBadge status={batch.status} /></div></CardHeader>
                    <CardContent className="space-y-4">
                        {batch.status === "failed" && <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">{batch.error_message || "The import failed."}</div>}
                        <div className="flex flex-wrap gap-2">{FILTERS.map((item) => <Button key={item.value} size="sm" variant={filter === item.value ? "default" : "outline"} onClick={() => setFilter(item.value)}>{item.label}{item.value !== "all" && ` (${batch[`${item.value}_rows` as keyof typeof batch] ?? 0})`}</Button>)}</div>
                        <div className="overflow-x-auto rounded-md border"><Table>
                            <TableHeader><TableRow><TableHead>Student number</TableHead><TableHead>Matched student</TableHead><TableHead>Score / status</TableHead><TableHead>Match status</TableHead><TableHead>Validation message</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                            <TableBody>{rowsQuery.isLoading ? <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading extracted rows…</TableCell></TableRow> : rowsQuery.data?.length ? rowsQuery.data.map((row) => <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.raw_student_number}</TableCell>
                                <TableCell><NativeSelect className="min-w-56" value={row.matched_student ?? ""} onChange={(event) => handleStudent(row.id, event.target.value)} disabled={updateRow.isPending}><option value="">Select student…</option>{students.data?.map((student) => <option key={student.id} value={student.id}>{student.student_number} · {student.full_name}</option>)}</NativeSelect></TableCell>
                                <TableCell>{row.result_status === "scored" ? row.score : row.result_status?.replace("_", " ") ?? row.raw_result}</TableCell>
                                <TableCell><Badge variant={row.match_status === "matched" ? "default" : "secondary"} className="capitalize">{row.match_status}</Badge></TableCell>
                                <TableCell className="max-w-72 whitespace-normal text-sm text-muted-foreground">{row.validation_message || "—"}</TableCell>
                                <TableCell className="text-right">{row.match_status !== "excluded" && <Button size="sm" variant="ghost" onClick={() => excludeRow(row.id)} disabled={updateRow.isPending}>Exclude</Button>}</TableCell>
                            </TableRow>) : <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No rows match this filter.</TableCell></TableRow>}</TableBody>
                        </Table></div>
                        {batch.status === "completed" ? <div className="rounded-md bg-emerald-500/10 p-4 text-sm text-emerald-700">Import completed successfully. Confirmed results are now visible in the student directory.</div> : <div className="flex flex-col items-start justify-between gap-3 rounded-md border bg-muted/20 p-4 sm:flex-row sm:items-center"><p className="text-sm">{unresolved ? `${unresolved} row(s) still need correction or exclusion.` : "All rows are ready to import."}</p><Button onClick={handleConfirm} disabled={Boolean(unresolved) || confirm.isPending || batch.status !== "review_required"}>{confirm.isPending ? "Confirming…" : "Confirm import"}</Button></div>}
                    </CardContent>
                </Card>}
            </View.Body>
        </View>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div> }
function StatusBadge({ status }: { status: string }) { return <Badge variant={status === "failed" ? "destructive" : status === "completed" ? "default" : "secondary"} className="capitalize">{status.replaceAll("_", " ")}</Badge> }

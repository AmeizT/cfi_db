"use client"

import Link from "next/link"
import { FileDownloadIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import View from "@/components/ui/view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDownloadTranscript, useStudentTranscript } from "./hooks"
import type { AcademicYear } from "./types"

const YEARS: AcademicYear[] = ["2024", "2025", "2026"]
const number = (value: string | null) => value === null ? "—" : Number(value).toFixed(2)

export function TranscriptView({ studentId }: { studentId: number }) {
    const query = useStudentTranscript(studentId)
    const download = useDownloadTranscript()
    const transcript = query.data

    const handleDownload = () => download.mutate(studentId, {
        onSuccess: () => toast.success("Transcript downloaded."),
        onError: (error) => toast.error(error.message || "Transcript PDF download failed."),
    })

    if (query.isLoading) return <div className="space-y-4 p-6"><Skeleton className="h-10 w-80" /><Skeleton className="h-40 w-full" /><Skeleton className="h-80 w-full" /></div>
    if (query.isError || !transcript) return <div className="p-6"><div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-destructive">{query.error?.message ?? "Transcript unavailable."}</div></div>

    return (
        <View>
            <View.Header pagename="Student transcript" actions={<>
                <Button variant="outline" asChild><Link href="/students/examinations">Back to students</Link></Button>
                <Button onClick={handleDownload} disabled={download.isPending}>
                    <HugeiconsIcon icon={FileDownloadIcon} /> {download.isPending ? "Generating PDF…" : "Download transcript"}
                </Button>
            </>} />
            <View.Body className="gap-6 py-4">
                <Card className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30 text-center">
                        <CardTitle className="text-xl">Cornerstone Bible Academy</CardTitle>
                        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Official examination transcript</p>
                    </CardHeader>
                    <CardContent className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Detail label="Student" value={transcript.student.full_name} />
                        <Detail label="Student number" value={transcript.student.student_number} />
                        <Detail label="Academic programme period" value={transcript.academic_period} />
                        <Detail label="Date generated" value={new Date(transcript.generated_date).toLocaleDateString()} />
                    </CardContent>
                </Card>

                {YEARS.map((year) => (
                    <Card key={year}>
                        <CardHeader><CardTitle>{year} Examination Results</CardTitle></CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Examination</TableHead><TableHead>Date</TableHead><TableHead>Score</TableHead><TableHead>Total marks</TableHead><TableHead>Percentage</TableHead><TableHead>Status</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {transcript.results[year].length ? transcript.results[year].map((result) => (
                                            <TableRow key={result.id}>
                                                <TableCell className="font-medium">{result.examination_name}</TableCell>
                                                <TableCell>{result.examination_date ? new Date(result.examination_date).toLocaleDateString() : "—"}</TableCell>
                                                <TableCell>{result.status === "scored" ? number(result.score) : <span className="capitalize">{result.status}</span>}</TableCell>
                                                <TableCell>{number(result.total_marks)}</TableCell>
                                                <TableCell>{result.percentage === null ? "—" : `${number(result.percentage)}%`}</TableCell>
                                                <TableCell><Badge variant="secondary" className="capitalize">{result.status}</Badge></TableCell>
                                                <TableCell>{result.grade ?? "—"}</TableCell>
                                            </TableRow>
                                        )) : <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No examination results for {year}.</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </div>
                            <p className="mt-3 text-right text-sm font-semibold">{year} yearly average: {transcript.yearly_averages[year] === null ? "—" : `${number(transcript.yearly_averages[year])}%`}</p>
                        </CardContent>
                    </Card>
                ))}

                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Detail label="Overall average" value={transcript.overall_average === null ? "—" : `${number(transcript.overall_average)}%`} />
                        <Detail label="Final grade" value={transcript.final_grade ?? "—"} />
                        <Detail label="Overall result" value={transcript.overall_result ?? "—"} />
                        <Detail label="Examinations written" value={String(transcript.examinations_written)} />
                    </CardContent>
                </Card>
            </View.Body>
        </View>
    )
}

function Detail({ label, value }: { label: string; value: string }) {
    return <div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-semibold">{value}</p></div>
}

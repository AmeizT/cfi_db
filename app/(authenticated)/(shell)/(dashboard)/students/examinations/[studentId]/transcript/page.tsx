import { TranscriptView } from "@/features/examinations/TranscriptView"

export default async function StudentTranscriptPage({ params }: { params: Promise<{ studentId: string }> }) {
    const { studentId } = await params
    return <TranscriptView studentId={Number(studentId)} />
}

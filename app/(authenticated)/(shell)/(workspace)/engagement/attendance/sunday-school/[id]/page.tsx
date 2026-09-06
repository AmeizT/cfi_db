import { SundaySchoolAttendanceDetailView } from "@/features/people/sunday-school/views/SundaySchoolAttendanceDetailView"

export default async function SundaySchoolAttendanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <SundaySchoolAttendanceDetailView recordId={id} />
}

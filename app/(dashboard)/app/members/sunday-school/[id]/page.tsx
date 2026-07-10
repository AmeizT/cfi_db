import { SundaySchoolAttendanceDetailView } from "@/features/people/sunday-school/views/SundaySchoolAttendanceDetailView"

type SundaySchoolAttendanceDetailPageProps = {
    params: Promise<{ id: string }>
}

export default async function SundaySchoolAttendanceDetailPage({
    params,
}: SundaySchoolAttendanceDetailPageProps) {
    const { id } = await params

    return <SundaySchoolAttendanceDetailView recordId={id} />
}

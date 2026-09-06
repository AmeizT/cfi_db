import { getMetaData } from "@/config/metadata"
import { StudentDirectoryView } from "@/features/examinations/StudentDirectoryView"

export const metadata = getMetaData({ title: "Student Examination Results" })

export default function StudentExaminationResultsPage() {
    return <StudentDirectoryView />
}

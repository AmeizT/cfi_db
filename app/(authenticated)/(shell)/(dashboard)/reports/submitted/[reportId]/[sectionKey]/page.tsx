import { getMetaData } from "@/config/metadata"
import { SubmittedSectionView } from "@/features/reports/workflow/views/SubmittedSectionView"

export const metadata = getMetaData({ title: "Submitted Report Section" })

export default async function SubmittedReportSectionPage({ params }: {
  params: Promise<{ reportId: string; sectionKey: string }>
}) {
  const { reportId, sectionKey } = await params
  return <SubmittedSectionView reportId={Number(reportId)} sectionKey={sectionKey} />
}

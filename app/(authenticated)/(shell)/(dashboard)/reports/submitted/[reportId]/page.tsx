import { getMetaData } from "@/config/metadata"
import { LegacySubmittedReportRedirect } from "@/features/reports/workflow/views/LegacySubmittedReportRedirect"

export const metadata = getMetaData({ title: "Submitted Report" })

export default async function SubmittedReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params
  return <LegacySubmittedReportRedirect reportId={Number(reportId)} />
}

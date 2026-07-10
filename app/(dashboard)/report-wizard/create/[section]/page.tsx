import { ReportWizardView } from "@/features/report-wizard/views/ReportWizardView"

type ReportWizardCreateSectionPageProps = {
    params: Promise<{ section: string }>
}

export default async function ReportWizardCreateSectionPage({
    params,
}: ReportWizardCreateSectionPageProps) {
    const { section } = await params

    return <ReportWizardView section={section} />
}

import { Metadata } from "next"
import { parseTab } from "@/utils/parse-tab"
import ReportStatementView from "@/features/reports/statements/views/ReportStatementView"

function capitalize(word: string) {
    return word?.charAt(0)?.toUpperCase() + word?.slice(1)
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const activeTab = searchParams.then((sp) => sp.tab as string)
    const { main: tab } = parseTab(await activeTab)


    return {
        title: `${capitalize(await tab)} Statement`,
        description: `Comprehensive ${capitalize(await tab)} statement for your church. Explore detailed ${await tab} data, trends, and performance insights to support informed decision-making and improve overall ${await tab} management.`,
    }
}

export default function ReportStatementPage() {
    return (
        <ReportStatementView />
    )
}
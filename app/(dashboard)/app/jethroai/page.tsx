import { DashboardShell } from "@/features/dashboard/components/dashboard/dashboard-shell";
import { JethroChat } from "@/features/dashboard/components/dashboard/jethro-chat";

interface JethroPageProps {
    searchParams: Promise<{ q?: string }>
}

export default async function JethroPage({ searchParams }: JethroPageProps) {
    const { q = "" } = await searchParams

    return (
        <JethroChat initialMessage={q} userInitial="N" />
    )
}
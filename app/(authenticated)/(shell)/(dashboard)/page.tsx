import { OverviewView } from "@/features/dashboard/views/OverviewView"

export default function HomePage() {
    return <OverviewView initialNow={new Date().toISOString()} />
}

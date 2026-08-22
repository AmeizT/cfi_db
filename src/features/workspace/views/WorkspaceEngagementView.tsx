"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import View from "@/components/ui/view"
import { ReportSourceBanner } from "@/features/reports/workflow/components/ReportSourceBanner"

export type WorkspaceEngagementPage = "overview" | "activities"

const titles: Record<WorkspaceEngagementPage, string> = {
    overview: "Engagement",
    activities: "Activities",
}

const engagementAreas = [
    ["/engagement/attendance", "Attendance"],
    ["/engagement/attendance/sunday-school", "Sunday School"],
    ["/engagement/outreach", "Outreach"],
] as const

export function WorkspaceEngagementView({ page }: { page: WorkspaceEngagementPage }) {
    return (
        <View>
            <View.Header pagename={titles[page]} />
            <View.Body className="gap-4 py-4 lg:px-6">
                <ReportSourceBanner />
                {page === "overview" ? <div className="grid gap-4 md:grid-cols-3">{engagementAreas.map(([href, label]) => <Link key={href} href={href}><Card className="h-full transition-colors hover:border-primary/40"><CardHeader><CardTitle>{label}</CardTitle></CardHeader><CardContent className="flex items-center justify-between text-sm text-muted-foreground">Open operational records <ArrowRight className="size-4" /></CardContent></Card></Link>)}</div> : null}
                {page === "activities" ? <EmptyState type="reports" title="Activities" description="Activities is registered in Engagement and will use this page when its operational data source is ready." size="full" /> : null}
            </View.Body>
        </View>
    )
}

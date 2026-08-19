import Link from "next/link"
import { ArrowRight, HeartHandshake, Landmark } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import View from "@/components/ui/view"

const areas = [
    { href: "/finance/tithes", label: "Finance", description: "Tithes, revenue, expenses, statements, and remittance records.", icon: Landmark },
    { href: "/engagement/attendance", label: "Engagement", description: "Attendance, Sunday School, outreach, check-ins, and activities.", icon: HeartHandshake },
]

export function WorkspaceOverviewView() {
    return (
        <View>
            <View.Header pagename="Workspace" />
            <View.Body className="gap-4 py-4 lg:px-6">
                <p className="max-w-2xl text-sm text-muted-foreground">Open the operational records used by monthly reports. Reporting-period edits remain in the Report Wizard.</p>
                <div className="grid gap-4 md:grid-cols-2">
                    {areas.map((area) => <Link key={area.href} href={area.href}><Card className="h-full transition-colors hover:border-primary/40"><CardHeader><area.icon className="size-5 text-primary" /><CardTitle>{area.label}</CardTitle></CardHeader><CardContent className="flex items-end justify-between gap-4"><p className="text-sm text-muted-foreground">{area.description}</p><ArrowRight className="size-4 shrink-0" /></CardContent></Card></Link>)}
                </div>
            </View.Body>
        </View>
    )
}

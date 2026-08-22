import {
    BanknoteIcon,
    BookOpenTextIcon,
    ClipboardListIcon,
    ListMusicIcon,
    NotebookPenIcon,
    UsersRoundIcon,
} from "lucide-react"
import type { ComponentType, ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import type { AttendanceRecordDetail } from "../attendance-record-detail"
import { parseAttendanceList } from "../attendance-record-format"

function UnavailableDetail({
    icon: Icon,
    title,
    description,
}: {
    icon: ComponentType<{ className?: string }>
    title: string
    description: string
}) {
    return (
        <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
                {title}
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    )
}

function DetailSection({
    icon: Icon,
    title,
    children,
}: {
    icon: ComponentType<{ className?: string }>
    title: string
    children: ReactNode
}) {
    return (
        <section className="space-y-3">
            <h3 className="flex items-center gap-2 border-b border-border-subtle pb-2 text-sm font-semibold text-foreground">
                <Icon className="size-4 text-muted-foreground" />
                {title}
            </h3>
            {children}
        </section>
    )
}

export function SermonDetailsPanel({
    record,
}: {
    record: AttendanceRecordDetail
}) {
    const scriptures = parseAttendanceList(record.scriptures)

    return (
        <Card className="overflow-hidden rounded-2xl border-border-subtle shadow-elevation-01">
            <CardHeader className="border-b border-border-subtle bg-muted/20 px-5 py-5 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Series not recorded
                </p>
                <CardTitle className="text-2xl">
                    {record.sermon?.trim() || "No sermon title recorded"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    A sermon summary is not available for this attendance record.
                </p>
            </CardHeader>
            <CardContent className="grid gap-8 p-5 sm:p-6 md:grid-cols-2">
                <DetailSection icon={BookOpenTextIcon} title="Key Scriptures">
                    {scriptures.length ? (
                        <ul className="space-y-2">
                            {scriptures.map((scripture) => (
                                <li
                                    key={scripture}
                                    className="rounded-lg bg-muted/40 px-3 py-2 text-sm font-medium text-foreground"
                                >
                                    {scripture}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            No scripture references were recorded.
                        </p>
                    )}
                </DetailSection>

                <DetailSection icon={ListMusicIcon} title="Worship Setlist">
                    <p className="text-sm text-muted-foreground">
                        Worship songs are not exposed by the attendance record API.
                    </p>
                </DetailSection>

                <div className="md:col-span-2">
                    <DetailSection icon={NotebookPenIcon} title="Administrator Notes">
                        <p className="min-h-24 whitespace-pre-wrap rounded-xl border border-border-subtle bg-muted/30 p-4 text-sm leading-6 text-foreground">
                            {record.notes?.trim() || "No administrator notes were recorded."}
                        </p>
                    </DetailSection>
                </div>
            </CardContent>
        </Card>
    )
}

function VolunteerRosterPanel({ record }: { record: AttendanceRecordDetail }) {
    return (
        <Card className="rounded-2xl border-border-subtle shadow-elevation-01">
            <CardHeader className="border-b border-border-subtle">
                <CardTitle className="text-lg">Volunteer Roster</CardTitle>
                <p className="text-sm text-muted-foreground">
                    {record.volunteers_on_duty?.toLocaleString() ?? 0} volunteers were recorded on duty.
                </p>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
                <UnavailableDetail
                    icon={UsersRoundIcon}
                    title="Volunteer names are not available"
                    description="The server currently stores the volunteer count, but it does not expose individual roster assignments for this attendance record."
                />
            </CardContent>
        </Card>
    )
}

function OfferingPanel() {
    return (
        <Card className="rounded-2xl border-border-subtle shadow-elevation-01">
            <CardHeader className="border-b border-border-subtle">
                <CardTitle className="text-lg">Offering</CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
                <UnavailableDetail
                    icon={BanknoteIcon}
                    title="No offering data on this record"
                    description="Attendance records do not currently expose offering transactions. Use the Finance workspace for available financial records."
                />
            </CardContent>
        </Card>
    )
}

export function AttendanceDetailsTabs({
    record,
}: {
    record: AttendanceRecordDetail
}) {
    return (
        <Tabs defaultValue="sermon" className="min-w-0 gap-4">
            <div className="overflow-x-auto pb-1">
                <TabsList className="min-w-max">
                    <TabsTrigger value="sermon">
                        <BookOpenTextIcon />
                        Sermon Details
                    </TabsTrigger>
                    <TabsTrigger value="volunteers">
                        <ClipboardListIcon />
                        Volunteer Roster
                    </TabsTrigger>
                    <TabsTrigger value="offering">
                        <BanknoteIcon />
                        Offering
                    </TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="sermon">
                <SermonDetailsPanel record={record} />
            </TabsContent>
            <TabsContent value="volunteers">
                <VolunteerRosterPanel record={record} />
            </TabsContent>
            <TabsContent value="offering">
                <OfferingPanel />
            </TabsContent>
        </Tabs>
    )
}

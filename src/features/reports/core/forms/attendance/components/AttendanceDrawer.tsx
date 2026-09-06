"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { AttendanceRecord } from "../types/attendance"

const weatherOptions = [
    ["sunny", "Sunny"],
    ["partly_cloudy", "Partly cloudy"],
    ["cloudy", "Cloudy"],
    ["windy", "Windy"],
    ["light_rain", "Light rain"],
    ["heavy_rain", "Heavy rain"],
    ["storm", "Storm"],
    ["very_hot", "Very hot"],
    ["cold", "Cold"],
    ["extreme", "Extreme weather"],
] as const

type Props = {
    record: AttendanceRecord | null
    close: () => void
    saveRecord: (record: AttendanceRecord) => Promise<void>
    isSaving?: boolean
}

export function AttendanceDetailDrawer({
    record,
    close,
    saveRecord,
    isSaving,
}: Props) {
    const [draft, setDraft] = React.useState<AttendanceRecord | null>(record)

    const updateDraft = (changes: Partial<AttendanceRecord>) => {
        setDraft((current) => current ? { ...current, ...changes } : current)
    }

    return (
        <Sheet open={Boolean(record)} onOpenChange={(open) => { if (!open && !isSaving) close() }}>
            <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader className="border-b border-border-subtle px-5 py-5">
                    <SheetTitle>Attendance details</SheetTitle>
                    <SheetDescription>
                        {draft
                            ? new Date(`${draft.timestamp}T00:00:00`).toLocaleDateString(undefined, {
                                weekday: "long", day: "numeric", month: "long", year: "numeric",
                            })
                            : "Add service information for this Sunday."}
                    </SheetDescription>
                </SheetHeader>

                {draft ? (
                    <div className="space-y-5 px-5 py-2">
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-border-subtle p-3">
                            <div className="space-y-1">
                                <Label htmlFor="attendance-special-event">Special event</Label>
                                <p className="text-xs text-muted-foreground">Mark this Sunday as a named special service.</p>
                            </div>
                            <Switch
                                id="attendance-special-event"
                                checked={Boolean(draft.is_special_event)}
                                onCheckedChange={(checked) => updateDraft({
                                    is_special_event: checked,
                                    special_event_name: checked ? draft.special_event_name : "",
                                })}
                            />
                        </div>

                        {draft.is_special_event ? (
                            <div className="space-y-2">
                                <Label htmlFor="attendance-special-event-name">Event name</Label>
                                <Input
                                    id="attendance-special-event-name"
                                    value={draft.special_event_name ?? ""}
                                    onChange={(event) => updateDraft({ special_event_name: event.target.value })}
                                    placeholder="e.g. Family Sunday"
                                />
                            </div>
                        ) : null}

                        <div className="space-y-2">
                            <Label htmlFor="attendance-preacher">Preacher</Label>
                            <Input
                                id="attendance-preacher"
                                value={draft.preacher ?? ""}
                                onChange={(event) => updateDraft({ preacher: event.target.value })}
                                placeholder="Preacher's name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attendance-sermon">Sermon</Label>
                            <Textarea
                                id="attendance-sermon"
                                value={draft.sermon ?? ""}
                                onChange={(event) => updateDraft({ sermon: event.target.value })}
                                placeholder="Sermon title or summary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attendance-scriptures">Scriptures</Label>
                            <Textarea
                                id="attendance-scriptures"
                                value={draft.scriptures ?? ""}
                                onChange={(event) => updateDraft({ scriptures: event.target.value })}
                                placeholder="e.g. John 3:16; Romans 8:1–4"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attendance-weather">Weather</Label>
                            <NativeSelect
                                id="attendance-weather"
                                value={draft.weather ?? ""}
                                onChange={(event) => updateDraft({ weather: event.target.value || null })}
                            >
                                <NativeSelectOption value="">Not recorded</NativeSelectOption>
                                {weatherOptions.map(([value, label]) => (
                                    <NativeSelectOption key={value} value={value}>{label}</NativeSelectOption>
                                ))}
                            </NativeSelect>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="attendance-notes">Notes</Label>
                            <Textarea
                                id="attendance-notes"
                                className="min-h-24"
                                value={draft.notes ?? ""}
                                onChange={(event) => updateDraft({ notes: event.target.value })}
                                placeholder="Additional service notes"
                            />
                        </div>
                    </div>
                ) : null}

                <SheetFooter className="border-t border-border-subtle bg-background px-5 py-4 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" onClick={close} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        disabled={!draft || isSaving}
                        onClick={async () => {
                            if (!draft) return
                            try {
                                await saveRecord(draft)
                                close()
                            } catch {
                                // The mutation keeps the sheet open and shows the error toast.
                            }
                        }}
                    >
                        {isSaving ? <Loader2Icon className="size-4 animate-spin" /> : null}
                        Save details
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

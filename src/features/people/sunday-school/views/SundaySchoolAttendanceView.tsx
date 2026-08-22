"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    CheckIcon,
    EyeIcon,
    Loader2Icon,
    PencilIcon,
    PlusIcon,
    XIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import View from "@/components/ui/view"
import { DataTable } from "@/features/reports/core/components/DataTable"
import { useMembersDirectory } from "@/features/people/members/hooks/use-members-directory"
import {
    approveSundaySchoolAttendance,
    createSundaySchoolAttendance,
    rejectSundaySchoolAttendance,
    updateSundaySchoolAttendance,
} from "../services/sunday-school-attendance"
import {
    SundaySchoolClassOptions,
    type SundaySchoolAttendance,
    type SundaySchoolAttendancePayload,
    type SundaySchoolClassName,
} from "../schemas/sunday-school"
import {
    useSundaySchoolAggregates,
    useSundaySchoolAttendance,
} from "../hooks/use-sunday-school-attendance"
import { sundaySchoolAttendanceTableSchema } from "../config/table-schema"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"

type SundaySchoolTableRow = Record<string, unknown> & {
    id: number
    date_label: string
    assembly_name: string
    class_label: string
    teacher_name: string
    boys: number
    girls: number
    visitors: number
    first_timers: number
    offering: string
    total_children: number
    grand_total: number
    status_label: string
    record: SundaySchoolAttendance
}

type SundaySchoolFormState = {
    teacher: string
    service_date: string
    class_name: SundaySchoolClassName
    boys: string
    girls: string
    male_visitors: string
    female_visitors: string
    male_first_timers: string
    female_first_timers: string
    lesson_title: string
    scripture_reference: string
    offering: string
    remarks: string
}

function getDefaultServiceDate(period?: string | null) {
    if (!period) return new Date().toISOString().slice(0, 10)

    const [year, month] = period.slice(0, 7).split("-").map(Number)
    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
        return new Date().toISOString().slice(0, 10)
    }

    const firstDay = new Date(year, month - 1, 1)
    const daysUntilSunday = (7 - firstDay.getDay()) % 7
    const day = String(1 + daysUntilSunday).padStart(2, "0")
    return `${year}-${String(month).padStart(2, "0")}-${day}`
}

function getDefaultFormState(period?: string | null): SundaySchoolFormState {
    return {
        teacher: "",
        service_date: getDefaultServiceDate(period),
        class_name: "beginners",
        boys: "0",
        girls: "0",
        male_visitors: "0",
        female_visitors: "0",
        male_first_timers: "0",
        female_first_timers: "0",
        lesson_title: "",
        scripture_reference: "",
        offering: "0",
        remarks: "",
    }
}

const tableOptions = {
    enablePinning: true,
}

function formatDate(value: string) {
    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date)
}

function formatNumber(value: number | string) {
    return new Intl.NumberFormat().format(Number(value || 0))
}

function getErrorMessage(error: unknown) {
    return error instanceof Error
        ? error.message
        : "Sunday School attendance request failed."
}

function mapTableRow(record: SundaySchoolAttendance): SundaySchoolTableRow {
    return {
        id: record.id,
        date_label: formatDate(record.service_date),
        assembly_name: record.assembly_name ?? `Assembly #${record.assembly}`,
        class_label: record.class_label ?? record.class_name,
        teacher_name: record.teacher_name ?? `Member #${record.teacher}`,
        boys: record.boys,
        girls: record.girls,
        visitors: record.total_visitors,
        first_timers: record.total_first_timers,
        offering: record.offering,
        total_children: record.total_children,
        grand_total: record.grand_total,
        status_label: record.status_label ?? record.status,
        record,
    }
}

function recordToFormState(record: SundaySchoolAttendance): SundaySchoolFormState {
    return {
        teacher: String(record.teacher),
        service_date: record.service_date,
        class_name: record.class_name,
        boys: String(record.boys),
        girls: String(record.girls),
        male_visitors: String(record.male_visitors),
        female_visitors: String(record.female_visitors),
        male_first_timers: String(record.male_first_timers),
        female_first_timers: String(record.female_first_timers),
        lesson_title: record.lesson_title,
        scripture_reference: record.scripture_reference,
        offering: String(record.offering),
        remarks: record.remarks,
    }
}

function numberFromForm(value: string) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function toPayload(
    form: SundaySchoolFormState,
    reportId?: string | number | null,
): SundaySchoolAttendancePayload {
    return {
        report: reportId ? Number(reportId) : undefined,
        teacher: Number(form.teacher),
        service_date: form.service_date,
        class_name: form.class_name,
        boys: numberFromForm(form.boys),
        girls: numberFromForm(form.girls),
        male_visitors: numberFromForm(form.male_visitors),
        female_visitors: numberFromForm(form.female_visitors),
        male_first_timers: numberFromForm(form.male_first_timers),
        female_first_timers: numberFromForm(form.female_first_timers),
        lesson_title: form.lesson_title.trim(),
        scripture_reference: form.scripture_reference.trim(),
        offering: numberFromForm(form.offering),
        remarks: form.remarks.trim(),
    }
}

function StatCard({
    label,
    value,
}: {
    label: string
    value: string | number
}) {
    return (
        <Card className="rounded-lg border border-border bg-card">
            <CardHeader className="px-4 pt-4 pb-0">
                <CardTitle className="text-xs font-medium uppercase text-muted-foreground">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-2">
                <div className="text-2xl font-semibold text-foreground">
                    {value}
                </div>
            </CardContent>
        </Card>
    )
}

function Field({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            {children}
        </div>
    )
}

export function SundaySchoolAttendanceForm({
    record = null,
    reportId,
    period,
    onCancel,
    onSaved,
}: {
    record?: SundaySchoolAttendance | null
    reportId?: string | number | null
    period?: string | null
    onCancel?: () => void
    onSaved?: (record: SundaySchoolAttendance) => void
}) {
    const assemblyId = useActiveAssemblyId()
    const queryClient = useQueryClient()
    const membersQuery = useMembersDirectory({})
    const [currentRecord, setCurrentRecord] = React.useState(record)
    const [form, setForm] = React.useState<SundaySchoolFormState>(() =>
        record ? recordToFormState(record) : getDefaultFormState(period)
    )
    const isEditing = Boolean(currentRecord)

    React.useEffect(() => {
        queueMicrotask(() => {
            setCurrentRecord(record)
            setForm(record ? recordToFormState(record) : getDefaultFormState(period))
        })
    }, [period, record])

    const saveMutation = useMutation({
        mutationFn: (payload: SundaySchoolAttendancePayload) => {
            if (currentRecord) {
                return updateSundaySchoolAttendance(currentRecord.id, payload)
            }

            return createSundaySchoolAttendance(payload)
        },
        onSuccess: async (savedRecord) => {
            setCurrentRecord(savedRecord)
            setForm(recordToFormState(savedRecord))
            toast.success(
                isEditing
                    ? "Sunday School attendance updated"
                    : "Sunday School attendance created"
            )
            onSaved?.(savedRecord)
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: assemblyQueryKeys.scope(assemblyId),
                }),
                queryClient.invalidateQueries({ queryKey: ["reports-workflow"] }),
            ])
        },
        onError: (error) => {
            toast.error(getErrorMessage(error))
        },
    })

    function updateField<Key extends keyof SundaySchoolFormState>(
        key: Key,
        value: SundaySchoolFormState[Key]
    ) {
        setForm((current) => ({ ...current, [key]: value }))
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        saveMutation.mutate(toPayload(form, reportId))
    }

    const members = membersQuery.data ?? []

    return (
        <form className="grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Service date">
                    <Input
                        required
                        type="date"
                        value={form.service_date}
                        onChange={(event) => updateField("service_date", event.target.value)}
                    />
                </Field>

                <Field label="Class">
                    <NativeSelect
                        required
                        className="min-w-full"
                        value={form.class_name}
                        onChange={(event) => updateField("class_name", event.target.value as SundaySchoolClassName)}
                    >
                        {SundaySchoolClassOptions.map((option) => (
                            <NativeSelectOption key={option.value} value={option.value}>
                                {option.label}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                </Field>

                <Field label="Teacher">
                    <NativeSelect
                        required
                        className="min-w-full"
                        disabled={membersQuery.isLoading}
                        value={form.teacher}
                        onChange={(event) => updateField("teacher", event.target.value)}
                    >
                        <NativeSelectOption value="">
                            Select teacher
                        </NativeSelectOption>
                        {members.map((member) => (
                            <NativeSelectOption key={member.id} value={String(member.id)}>
                                {member.full_name}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {([
                    ["boys", "Boys"],
                    ["girls", "Girls"],
                    ["male_visitors", "Male visitors"],
                    ["female_visitors", "Female visitors"],
                    ["male_first_timers", "Male first timers"],
                    ["female_first_timers", "Female first timers"],
                ] as const).map(([key, label]) => (
                    <Field key={key} label={label}>
                        <Input
                            min={0}
                            required
                            type="number"
                            value={form[key]}
                            onChange={(event) => updateField(key, event.target.value)}
                        />
                    </Field>
                ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Lesson title">
                    <Input
                        value={form.lesson_title}
                        onChange={(event) => updateField("lesson_title", event.target.value)}
                    />
                </Field>
                <Field label="Scripture reference">
                    <Input
                        value={form.scripture_reference}
                        onChange={(event) => updateField("scripture_reference", event.target.value)}
                    />
                </Field>
                <Field label="Offering">
                    <Input
                        min={0}
                        step="0.01"
                        type="number"
                        value={form.offering}
                        onChange={(event) => updateField("offering", event.target.value)}
                    />
                </Field>
            </div>

            <Field label="Remarks">
                <Textarea
                    value={form.remarks}
                    onChange={(event) => updateField("remarks", event.target.value)}
                />
            </Field>

            <div className="flex flex-wrap items-center justify-end gap-2">
                {onCancel ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                ) : null}
                <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? (
                        <Loader2Icon className="size-4 animate-spin" />
                    ) : null}
                    {saveMutation.isPending ? "Saving..." : "Save attendance"}
                </Button>
            </div>
        </form>
    )
}

function SundaySchoolDialog({
    open,
    record,
    reportId,
    period,
    onOpenChange,
}: {
    open: boolean
    record: SundaySchoolAttendance | null
    reportId?: string | number | null
    period?: string | null
    onOpenChange: (open: boolean) => void
}) {
    const isEditing = Boolean(record)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Sunday School Attendance" : "Record Sunday School Attendance"}
                    </DialogTitle>
                    <DialogDescription>
                        Weekly Sunday School attendance is tracked separately from the main service.
                    </DialogDescription>
                </DialogHeader>

                <SundaySchoolAttendanceForm
                    key={record?.id ?? `${period ?? "current"}-new`}
                    record={record}
                    reportId={reportId}
                    period={period}
                    onCancel={() => onOpenChange(false)}
                    onSaved={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

function ExpandedRecord({
    row,
    onEdit,
    onApprove,
    onReject,
    onOpenDetail,
    isApproving,
    isRejecting,
    readOnly,
}: {
    row: SundaySchoolTableRow
    onEdit: (record: SundaySchoolAttendance) => void
    onApprove: (id: number) => void
    onReject: (id: number) => void
    onOpenDetail: (id: number) => void
    isApproving: boolean
    isRejecting: boolean
    readOnly: boolean
}) {
    const record = row.record

    return (
        <div className="grid w-full gap-4 md:grid-cols-[1fr_auto]">
            <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Lesson</dt>
                    <dd className="mt-1 text-foreground">{record.lesson_title || "Not recorded"}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Scripture</dt>
                    <dd className="mt-1 text-foreground">{record.scripture_reference || "Not recorded"}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">Visitors</dt>
                    <dd className="mt-1 text-foreground">{record.total_visitors}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-muted-foreground">First timers</dt>
                    <dd className="mt-1 text-foreground">{record.total_first_timers}</dd>
                </div>
            </dl>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenDetail(record.id)}
                >
                    <EyeIcon className="size-4" />
                    Detail
                </Button>
                {!readOnly ? (
                    <>
                        <Button type="button" variant="outline" onClick={() => onEdit(record)}>
                            <PencilIcon className="size-4" />
                            Edit
                        </Button>
                        <Button type="button" variant="outline" disabled={isApproving} onClick={() => onApprove(record.id)}>
                            {isApproving ? <Loader2Icon className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
                            Approve
                        </Button>
                        <Button type="button" variant="outline" disabled={isRejecting} onClick={() => onReject(record.id)}>
                            {isRejecting ? <Loader2Icon className="size-4 animate-spin" /> : <XIcon className="size-4" />}
                            Reject
                        </Button>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export function SundaySchoolAttendanceView({
    embedded = false,
    period,
    reportId,
    readOnly = false,
}: {
    embedded?: boolean
    period?: string | null
    reportId?: string | number | null
    readOnly?: boolean
}) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [editingRecord, setEditingRecord] = React.useState<SundaySchoolAttendance | null>(null)
    const periodStart = period ? `${period.slice(0, 7)}-01` : undefined
    const periodEnd = periodStart
        ? new Date(Number(periodStart.slice(0, 4)), Number(periodStart.slice(5, 7)), 0).toISOString().slice(0, 10)
        : undefined
    const attendanceQuery = useSundaySchoolAttendance({ dateAfter: periodStart, dateBefore: periodEnd })
    const aggregatesQuery = useSundaySchoolAggregates({ dateAfter: periodStart, dateBefore: periodEnd })

    const rows = React.useMemo(
        () => (attendanceQuery.data ?? []).map(mapTableRow),
        [attendanceQuery.data]
    )

    const approveMutation = useMutation({
        mutationFn: approveSundaySchoolAttendance,
        onSuccess: async () => {
            toast.success("Sunday School attendance approved")
            await queryClient.invalidateQueries({
                queryKey: ["people", "sunday-school-attendance"],
            })
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    })

    const rejectMutation = useMutation({
        mutationFn: rejectSundaySchoolAttendance,
        onSuccess: async () => {
            toast.success("Sunday School attendance rejected")
            await queryClient.invalidateQueries({
                queryKey: ["people", "sunday-school-attendance"],
            })
        },
        onError: (error) => toast.error(getErrorMessage(error)),
    })

    function openCreateDialog() {
        setEditingRecord(null)
        setDialogOpen(true)
    }

    function openEditDialog(record: SundaySchoolAttendance) {
        setEditingRecord(record)
        setDialogOpen(true)
    }

    const aggregates = aggregatesQuery.data
    const isLoading = attendanceQuery.isLoading || attendanceQuery.isFetching

    return (
        <View className="gap-0">
            {!embedded ? (
                <View.Header pagename="Sunday School Attendance" />
            ) : null}

            <View.Body className="gap-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">
                            Attendance Records
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Records are submitted for review and approval independently from main service attendance.
                        </p>
                    </div>
                    <Button type="button" onClick={openCreateDialog} className={readOnly ? "hidden" : undefined}>
                        <PlusIcon className="size-4" />
                        New Record
                    </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    {aggregatesQuery.isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton key={index} className="h-24 rounded-lg" />
                        ))
                    ) : (
                        <>
                            <StatCard label="Total Children" value={formatNumber(aggregates?.total_children ?? 0)} />
                            <StatCard label="Total Visitors" value={formatNumber(aggregates?.total_visitors ?? 0)} />
                            <StatCard label="First Timers" value={formatNumber(aggregates?.total_first_timers ?? 0)} />
                            <StatCard label="Average Attendance" value={formatNumber(aggregates?.average_attendance ?? 0)} />
                            <StatCard label="Offering" value={formatNumber(aggregates?.sunday_school_offering ?? 0)} />
                        </>
                    )}
                </div>

                {attendanceQuery.isError ? (
                    <Card className="rounded-lg border border-border bg-card px-6 py-12 text-center">
                        <h2 className="text-lg font-semibold text-foreground">
                            Unable to load Sunday School attendance
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            {getErrorMessage(attendanceQuery.error)}
                        </p>
                    </Card>
                ) : !isLoading && rows.length === 0 ? (
                    <Card className="rounded-lg border border-border bg-card px-6 py-12">
                        <EmptyState
                            type="demographics"
                            variant="both"
                            context={{ label: "Sunday School attendance" }}
                        />
                    </Card>
                ) : (
                    <DataTable<SundaySchoolTableRow>
                        variant="simple"
                        data={rows}
                        config={sundaySchoolAttendanceTableSchema}
                        isLoading={isLoading}
                        loadingMode="overlay"
                        options={tableOptions}
                        showToolbar={false}
                        showRowActions={false}
                        enableDelete={false}
                        exportFilename="sunday-school-attendance"
                        expandedRow={(row) => (
                            <ExpandedRecord
                                row={row}
                                onEdit={readOnly ? () => undefined : openEditDialog}
                                onApprove={readOnly ? () => undefined : (id) => approveMutation.mutate(id)}
                                onReject={readOnly ? () => undefined : (id) => rejectMutation.mutate(id)}
                                onOpenDetail={(id) => router.push(`/engagement/attendance/sunday-school/${id}`)}
                                isApproving={
                                    approveMutation.isPending && approveMutation.variables === row.id
                                }
                                isRejecting={
                                    rejectMutation.isPending && rejectMutation.variables === row.id
                                }
                                readOnly={readOnly}
                            />
                        )}
                    />
                )}
            </View.Body>

            <SundaySchoolDialog
                open={dialogOpen}
                record={editingRecord}
                reportId={reportId}
                period={period}
                onOpenChange={setDialogOpen}
            />
        </View>
    )
}

import { z } from "zod"

export const SundaySchoolClassNameSchema = z.enum([
    "beginners",
    "primary",
    "juniors",
    "intermediate",
    "teens",
])

export const SundaySchoolClassOptions = [
    { value: "beginners", label: "Beginners" },
    { value: "primary", label: "Primary" },
    { value: "juniors", label: "Juniors" },
    { value: "intermediate", label: "Intermediate" },
    { value: "teens", label: "Teens" },
] as const

export const SundaySchoolStatusSchema = z.enum([
    "draft",
    "submitted",
    "under_review",
    "approved",
    "rejected",
    "archived",
])

const NullableString = z.string().nullable().optional()
const DateTimeString = z.string().nullable().optional()
const DecimalValue = z.union([z.string(), z.number()]).transform((value) => String(value))

export const SundaySchoolAttendanceSchema = z.object({
    id: z.number(),
    assembly: z.number(),
    assembly_name: z.string().optional(),
    teacher: z.number(),
    teacher_name: z.string().optional(),
    reported_by: z.number().nullable().optional(),
    reported_by_name: NullableString,
    reviewed_by: z.number().nullable().optional(),
    reviewed_by_name: NullableString,
    service_date: z.iso.date(),
    class_name: SundaySchoolClassNameSchema,
    class_label: z.string().optional(),
    boys: z.number(),
    girls: z.number(),
    male_visitors: z.number(),
    female_visitors: z.number(),
    male_first_timers: z.number(),
    female_first_timers: z.number(),
    lesson_title: z.string(),
    scripture_reference: z.string(),
    offering: DecimalValue,
    remarks: z.string(),
    status: SundaySchoolStatusSchema,
    status_label: z.string().optional(),
    submitted_at: DateTimeString,
    reviewed_at: DateTimeString,
    total_children: z.number(),
    total_visitors: z.number(),
    total_first_timers: z.number(),
    grand_total: z.number(),
    is_deleted: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
})

export const SundaySchoolAttendancePayloadSchema = z.object({
    teacher: z.number().int().positive(),
    service_date: z.iso.date(),
    class_name: SundaySchoolClassNameSchema,
    boys: z.number().int().min(0),
    girls: z.number().int().min(0),
    male_visitors: z.number().int().min(0),
    female_visitors: z.number().int().min(0),
    male_first_timers: z.number().int().min(0),
    female_first_timers: z.number().int().min(0),
    lesson_title: z.string(),
    scripture_reference: z.string(),
    offering: z.number().min(0),
    remarks: z.string(),
})

export const SundaySchoolAttendanceListSchema = z.union([
    z.array(SundaySchoolAttendanceSchema),
    z.object({
        results: z.array(SundaySchoolAttendanceSchema),
        count: z.number().optional(),
    }),
]).transform((response) => Array.isArray(response) ? response : response.results)

const AggregateGroupSchema = z.object({
    id: z.union([z.number(), z.string()]),
    label: z.string(),
    records: z.number(),
    total_children: z.number(),
    total_visitors: z.number(),
    total_first_timers: z.number(),
    grand_total: z.number(),
    offering: DecimalValue,
})

export const SundaySchoolAggregatesSchema = z.object({
    total_children: z.number(),
    total_visitors: z.number(),
    total_first_timers: z.number(),
    average_attendance: z.number(),
    sunday_school_offering: DecimalValue,
    attendance_by_class: z.array(AggregateGroupSchema),
    attendance_by_teacher: z.array(AggregateGroupSchema),
    attendance_by_assembly: z.array(AggregateGroupSchema),
    attendance_by_zone: z.array(AggregateGroupSchema),
    attendance_by_region: z.array(AggregateGroupSchema),
    generated_at: z.string().optional(),
})

export type SundaySchoolClassName = z.infer<typeof SundaySchoolClassNameSchema>
export type SundaySchoolAttendance = z.infer<typeof SundaySchoolAttendanceSchema>
export type SundaySchoolAttendancePayload = z.infer<typeof SundaySchoolAttendancePayloadSchema>
export type SundaySchoolAttendanceList = z.infer<typeof SundaySchoolAttendanceListSchema>
export type SundaySchoolAggregates = z.infer<typeof SundaySchoolAggregatesSchema>

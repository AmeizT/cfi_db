import { z } from "zod"

export const AttendanceCategories = {
    Sunday: "Sunday",
    Midweek: "Midweek",
    Prayer: "Prayer",
    Youth: "Youth",
    Womens: "Womens",
    Mens: "Mens",
    Children: "Children",
    Special: "Special",
    Conference: "Conference",
    Revival: "Revival",
    Homecell: "Homecell",
} as const

export type AttendanceCategory = keyof typeof AttendanceCategories

export const AttendanceFormSchema = z.object({
    church: z.string().min(1, "Church is required"),
    homecell: z.string().optional(),
    category: z.nativeEnum(AttendanceCategories),
    preacher: z.string().optional(),
    sermon: z.string().optional(),
    scriptures: z.string().optional(),
    headcount: z
        .string()
        .min(1, "Headcount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Headcount must be a valid number"),
    adults: z
        .string()
        .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), "Adults must be a valid number")
        .optional(),
    children: z
        .string()
        .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), "Children must be a valid number")
        .optional(),
    visitors: z
        .string()
        .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), "Visitors must be a valid number")
        .optional(),
    newcomers: z
        .string()
        .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), "Newcomers must be a valid number")
        .optional(),
    altar_call: z
        .string()
        .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), "Altar call must be a valid number")
        .optional(),
    baptism: z
        .string()
        .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), "Baptism must be a valid number")
        .optional(),
    summary: z.string().optional(),
    achievements: z.string().optional(),
    timestamp: z.date(),
    start_time: z.date().optional(),
    end_time: z.date().optional(),
})

// Infer the TypeScript type from the schema
export type AttendanceFormData = z.infer<typeof AttendanceFormSchema>

// Server action schema (for processing)
export const AttendanceServerSchema = z.object({
    church: z.string().min(1, "Church is required"),
    homecell: z.string().optional(),
    category: z.nativeEnum(AttendanceCategories),
    preacher: z.string().optional(),
    sermon: z.string().optional(),
    scriptures: z.string().optional(),
    headcount: z.number().min(0, "Headcount must be non-negative"),
    adults: z.number().min(0, "Adults must be non-negative").optional(),
    children: z.number().min(0, "Children must be non-negative").optional(),
    visitors: z.number().min(0, "Visitors must be non-negative").optional(),
    newcomers: z.number().min(0, "Newcomers must be non-negative").optional(),
    altar_call: z.number().min(0, "Altar call must be non-negative").optional(),
    baptism: z.number().min(0, "Baptism must be non-negative").optional(),
    summary: z.string().optional(),
    achievements: z.string().optional(),
    timestamp: z.string().min(1, "Date is required"),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
})

export type Attendance = z.infer<typeof AttendanceServerSchema>

export const CategoryLabels: Record<string, string> = {
    Sunday: "Sunday Service",
    Midweek: "Midweek Service",
    Prayer: "Prayer Meeting",
    Youth: "Youth Service",
    Womens: "Women's Meeting",
    Mens: "Men's Meeting",
    Children: "Children's Service",
    Special: "Special Event",
    Conference: "Conference",
    Revival: "Revival Meeting",
    Homecell: "Home Cell",
}

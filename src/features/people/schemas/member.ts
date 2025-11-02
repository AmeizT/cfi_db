import { z } from "zod"

const phoneRegex = /^\+?[0-9]{9,15}$/

export const MemberSchema = z.object({
    id: z.string().optional(),
    member_key: z.string().optional(),
    assembly: z.string({
        error: (issue) => issue.input === undefined
            ? "Please select an assembly"
            : "Assembly is invalid"
    }),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    date_of_birth: z.string({
        error: (issue) => issue.input === undefined
            ? "Date of birth is required"
            : "Date of birth is invalid"
    }),
    age: z.number().optional(),
    full_name: z.string().optional(),
    spouse_full_name: z.string().optional(),
    gender: z.string({
        error: (issue) => issue.input === undefined
            ? "Please select a gender"
            : "Gender is invalid"
    }),
    country: z.string().min(1, "Country is required"),

    prefix: z.string().optional(),
    middle_name: z.string().optional(),
    maiden_name: z.string().optional(),
    place_of_birth: z.string().optional(),
    relationship: z.string().optional(),
    marriage_date: z.string().optional().nullable(),
    spouse: z.string().optional(),
    phone_number: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
    secondary_phone_number: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    address: z.string().optional(),
    address_line2: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    membersince: z.string().optional().nullable(),
    membership_status: z.string().optional(),
    previous_church: z.string().optional(),
    ministries: z.array(z.string()).optional(),
    positions: z.array(z.string()).optional(),
    baptized: z.boolean().default(false),
    baptized_at: z.string().optional().nullable(),
    baptized_where: z.string().optional(),
    confirmation_date: z.string().optional().nullable(),
    occupation: z.string().optional(),
    employer: z.string().optional(),
    education_level: z.string().optional(),
    skills: z.string().optional(),
    emergency_contact_name: z.string().optional(),
    emergency_contact_relationship: z.string().optional(),
    emergency_contact_phone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
    avatar: z.instanceof(File).optional().nullable() || z.string().optional(),
    avatar_fallback: z.string().optional(),
    is_active: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    created_by: z.string().optional(),
    updated_by: z.string().optional(),
})

export type Member = z.infer<typeof MemberSchema>
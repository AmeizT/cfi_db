import { z } from "zod"

export const HouseholdSchema = z.object({
    id: z.number(),
    assembly: z.number(),
    household_key: z.string(),
    name: z.string(),
    status: z.string(),
    phone_number: z.string(),
    secondary_phone_number: z.string(),
    email: z.string(),
    address: z.string(),
    address_line2: z.string(),
    city: z.string(),
    province: z.string(),
    country: z.string(),
    notes: z.string(),
    active_member_count: z.number(),
    primary_contact_id: z.number().nullable(),
    head_of_household: z.string().nullable(),
    location: z.string(),
    contact: z.string(),
    created_at: z.iso.datetime({ offset: true }),
    updated_at: z.iso.datetime({ offset: true }),
})

export const HouseholdsResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(HouseholdSchema),
    table_schema: z.unknown().optional(),
})

export type Household = z.infer<typeof HouseholdSchema>

import { z } from "zod"

export const AssetConditionSchema = z.enum([
    "New",
    "Good",
    "Fair",
    "Old",
    "Not Working",
])

export const AssetTypeSchema = z.enum([
    "Building",
    "Instrument",
    "Vehicle",
    "Furniture",
    "Electronics",
    "Machinery",
    "Software",
    "Land",
    "Other",
])

export const AssetAssemblySchema = z.object({
    id: z.number(),
    country_code: z.string().optional(),
    language: z.string().optional(),
    currency: z.string().optional(),
}).strict()

export const AssetImageSchema = z.object({
    id: z.number(),
    image: z.string(),
    asset: z.number(),
}).strict()

export const AssetSchema = z.object({
    id: z.number(),
    assembly: AssetAssemblySchema,
    item_code: z.string().optional(),
    item_name: z.string(),
    description: z.string().optional(),
    condition: AssetConditionSchema,
    asset_type: AssetTypeSchema,
    units: z.number(),
    acquisition_date: z.iso.date(),
    acquisition_cost: z.string().optional(),
    residual: z.string().optional(),
    vendor: z.string().optional(),
    asset_images: z.array(AssetImageSchema),
    created_by: z.number().nullable().optional(),
    created_at: z.iso.datetime({ offset: true }),
    updated_at: z.iso.datetime({ offset: true }),
}).strict()

export const AssetsListResponseSchema = z.object({
    count: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(AssetSchema),
}).strict()

export type Asset = z.infer<typeof AssetSchema>
export type AssetsListResponse = z.infer<typeof AssetsListResponseSchema>
export type AssetCondition = z.infer<typeof AssetConditionSchema>
export type AssetType = z.infer<typeof AssetTypeSchema>

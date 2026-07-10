import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
    table_schema?: TableSchema
    table_schemas?: Partial<Record<"churches" | "users", TableSchema>>
}

export type RegionalListParams = {
    page?: number
    pageSize?: number
    search?: string
    ordering?: string
}

export interface RegionalPastorSummary {
    id: number
    full_name: string
    email: string
}

export interface RegionalAssembly {
    [key: string]: unknown
    id: number
    uuid: string
    public_id: string
    code: string | null
    name: string
    zone: number | null
    zone_name: string | null
    region_id: number | null
    region_name: string | null
    description: string | null
    address: string | null
    city: string | null
    province: string | null
    country: string | null
    country_code: string | null
    locale: string | null
    currency: string | null
    primary_currency: string | null
    phone_number: string | null
    email: string | null
    status: string | null
    avatar: string | null
    avatar_fallback: string | null
    total_members: number
    assigned_pastors_count: number
    assigned_pastors: RegionalPastorSummary[]
    pastor_names: string | null
    created_at: string
    updated_at: string
}

export interface RegionalUser {
    [key: string]: unknown
    id: number
    user_id: string
    full_name: string
    first_name: string
    last_name: string
    username: string
    email: string
    roles: string[]
    role_names: string
    church_id: number | null
    church_name: string | null
    church_code: string | null
    church_country: string | null
    zone_id: number | null
    zone_name: string | null
    region_id: number | null
    region_name: string | null
    avatar: string | null
    avatar_fallback: string | null
    last_active: string | null
    is_active: boolean
    status: string
    is_onboarded: boolean
    created_at: string
    updated_at: string
}

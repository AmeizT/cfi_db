import { Church } from "@/types"

export interface MinimalUser {
    full_name: string
    first_name: string
    last_name: string
    email: string
    avatar: string
    avatar_fallback: string
}

export type Roles =
    | "President"
    | "Secretary General"
    | "Senior Pastor"
    | "Overseer"
    | "Moderator"
    | "Pastor"
    | "Secretary"
    | "Admin"

export type Role = {
    id: number
    name: Roles | string
}

export interface User {
    id: number
    user_id: string
    church: number | string
    assemblies: Church[]
    full_name: string
    first_name: string
    last_name: string
    username: string
    email: string
    roles: Role[]
    avatar_fallback: string
    avatar: string | null
    is_active: boolean
    is_admin: boolean
    is_onboarded: boolean
    created_at: string
    updated_at: string
}
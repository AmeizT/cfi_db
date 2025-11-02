import { type LucideIcon } from "lucide-react"

interface BaseMenuItem {
    name: string
    description?: string
    pathname?: string
    children?: MenuItemBase[]
    permissions?: string[]
}

export interface MenuItem extends BaseMenuItem {
    icon: LucideIcon 
}

export interface MenuItemBase extends BaseMenuItem {
    icon?: LucideIcon 
}
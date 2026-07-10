import { IconSvgElement } from "@hugeicons/react"
import { ReadonlyURLSearchParams } from "next/navigation"

interface NavItemBase {
    label: string
    href?: string
    description?: string
    defaultHref?: string
    disabled?: boolean
    hidden?: boolean
    mobile?: boolean
    permissions?: string[]
    exact?: boolean
}

export interface NavItem extends NavItemBase {
    icon: IconSvgElement
    activeIcon: IconSvgElement
    children?: NavItemBase[]
}

export interface NavGroup {
    id: string
    label: string
    items: NavItem[]
}

export type QueryParams = ReadonlyURLSearchParams

export interface RailNavigation {
    top: NavItem[]
    bottom: NavItem[]
    href?: string
    label?: string
    children?: NavItem[]
}

export type PeriodType = "year" | "month" | "range"

export type Period =
    | { type: "year"; value: number }
    | { type: "month"; value: string }
    | { type: "range"; from: string; to: string }

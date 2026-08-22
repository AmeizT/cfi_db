import type { IconSvgElement } from "@hugeicons/react"
import type { ComponentType, SVGProps } from "react"
import type { ReadonlyURLSearchParams } from "next/navigation"

export type CustomSvgIcon = ComponentType<SVGProps<SVGSVGElement>>

export type NavigationIcon = IconSvgElement | CustomSvgIcon

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
    icon?: NavigationIcon
}

export interface NavItem extends NavItemBase {
    icon: NavigationIcon
    activeIcon: NavigationIcon
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

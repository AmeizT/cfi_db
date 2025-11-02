import React from "react"

export interface Submenu {
    id: string
    name: string
    path: string
}

interface Shortcut {
    keys?: string;
    shortcutFunc?: () => void
}

export interface Menu {
    id: string
    category?: number | string
    description?: string
    type?: "button" | "link"
    name: string
    params?: {
        activeStateIcon?: React.JSX.Element
        baseIcon?: React.JSX.Element
        createPathname?: string
        hasBlankTarget?: boolean
        hasCreateButton?: boolean
        onClick?: () => void
        permissions?: "isAdminUser" | "isBaseUser" | "isOwner" | "allowAny"
    }
    pathname?: string
    shortcut?: Shortcut
    submenu?: Menu[]
}


export interface AttendanceReferenceProps {
    id: string,
    key: string,
    name: string
}
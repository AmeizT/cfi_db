import React from "react"

export type LayoutKey = "root" | "dashboard" | "home" | "headless" | "memberbook"

export type LayoutConfig = {
    key: LayoutKey
    component: React.ComponentType<unknown>
}
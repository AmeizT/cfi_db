import RootLayout from "./root/RootLayout"
import { HomeLayout } from "./home/HomeLayout"
import DashboardAppLayout from "./dashboard/AppLayout"
import { MemberBookLayout } from "./memberbook/Layout"
import { HeadlessLayout } from "./headless/HeadlessLayout"
import HeadlessSidebarLayout from "./dashboard/SidebarLayout"
import type { User } from "@/features/auth/schemas/user"

type LayoutKey = "root" | "dashboard" | "home" | "headless" | "headlessSidebar" | "memberbook"

export type LayoutConfig = {
    key: LayoutKey
    component: React.ComponentType<unknown>
}

interface HomeLayoutProps {
    children: React.ReactNode 
    isAuthenticated?: boolean
    user?: User | null
}

type LayoutRegistry = {
    root: React.ComponentType<{ children: React.ReactNode, locale?: string, isAuthenticated?: boolean, user?: User | null }>
    dashboard: React.ComponentType<{ children: React.ReactNode }>
    home: React.ComponentType<HomeLayoutProps>
    headless: React.ComponentType<{ children: React.ReactNode }>
    headlessSidebar: React.ComponentType<{ children: React.ReactNode }>
    memberbook: React.ComponentType<{ children: React.ReactNode }>
}

const layoutRegistry: LayoutRegistry = {
    root: RootLayout,
    dashboard: DashboardAppLayout,
    home: HomeLayout,
    headless: HeadlessLayout,
    memberbook: MemberBookLayout,
    headlessSidebar: HeadlessSidebarLayout,
}

export function getLayoutComponent(key: LayoutKey) {
    return layoutRegistry[key] || "root"
}

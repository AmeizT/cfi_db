import RootLayout from "./root/RootLayout"
import { HomeLayout } from "./home/HomeLayout"
import { User } from "@/features/auth/types/user"
import DashboardAppLayout from "./dashboard/AppLayout"
import { MemberBookLayout } from "./memberbook/Layout"
import { HeadlessLayout } from "./headless/HeadlessLayout"

type LayoutKey = "root" | "dashboard" | "home" | "headless" | "memberbook"

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
    root: React.ComponentType<{ children: React.ReactNode, locale?: string }>
    dashboard: React.ComponentType<{ children: React.ReactNode }>
    home: React.ComponentType<HomeLayoutProps>
    headless: React.ComponentType<{ children: React.ReactNode }>
    memberbook: React.ComponentType<{ children: React.ReactNode }>
}

const layoutRegistry: LayoutRegistry = {
    root: RootLayout,
    dashboard: DashboardAppLayout,
    home: HomeLayout,
    headless: HeadlessLayout,
    memberbook: MemberBookLayout
}

export function getLayoutComponent(key: LayoutKey) {
    return layoutRegistry[key] || "root"
}
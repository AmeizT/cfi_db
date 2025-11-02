"use client"

import * as React from "react"
import {
    MessageCircle,
    LayoutGrid,
    Calendar,
    Users,
    DollarSign,
    Settings,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CustomSidebarProps {
    className?: string
}

const sidebarItems = [
    { icon: MessageCircle, label: "Messages", href: "#" },
    { icon: LayoutGrid, label: "Dashboard", href: "#", active: true },
    { icon: Calendar, label: "Calendar", href: "#" },
    { icon: Users, label: "Users", href: "#" },
    { icon: DollarSign, label: "Finance", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
]

// Custom hook for mobile detection
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIsMobile()
        window.addEventListener("resize", checkIsMobile)

        return () => window.removeEventListener("resize", checkIsMobile)
    }, [])

    return isMobile
}

export function CustomSidebar({ className }: CustomSidebarProps) {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)
    const isMobile = useIsMobile()
    const sidebarRef = React.useRef<HTMLDivElement>(null)

    // Close mobile sidebar when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isMobile && isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsMobileOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMobile, isMobileOpen])

    // Close mobile sidebar on escape key
    React.useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && isMobile && isMobileOpen) {
                setIsMobileOpen(false)
            }
        }

        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isMobile, isMobileOpen])

    // Mobile sidebar
    if (isMobile) {
        return (
            <>
                {/* Mobile backdrop */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                {/* Mobile sidebar */}
                <div
                    ref={sidebarRef}
                    className={cn(
                        "fixed left-0 top-0 h-full w-64 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden",
                        isMobileOpen ? "translate-x-0" : "-translate-x-full",
                        className,
                    )}
                >
                    {/* Mobile header with close button */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <h2 className="text-white font-semibold">Menu</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileOpen(false)}
                            className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Mobile navigation */}
                    <nav className="flex-1 space-y-2 p-4">
                        {sidebarItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors",
                                    "hover:bg-gray-800",
                                    item.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white",
                                )}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Mobile trigger button - this will be rendered by the parent component */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileOpen(true)}
                    className="md:hidden h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </>
        )
    }

    // Desktop sidebar (original behavior)
    return (
        <div
            className={cn(
                "relative hidden md:flex h-screen flex-col bg-gray-900 transition-all duration-300 ease-in-out",
                isExpanded ? "w-64" : "w-16",
                className,
            )}
        >
            {/* Desktop toggle button */}
            <div className="flex justify-end p-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
            </div>

            {/* Desktop navigation */}
            <nav className="flex-1 space-y-2 px-2">
                {sidebarItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        className={cn(
                            "flex items-center rounded-lg transition-all duration-200 ease-in-out",
                            "hover:bg-gray-800",
                            item.active ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white",
                            isExpanded ? "h-8 px-3 gap-3" : "h-14 w-14 justify-center",
                        )}
                    >
                        <item.icon className={cn("shrink-0 transition-all duration-200", isExpanded ? "h-4 w-4" : "h-6 w-6")} />
                        {isExpanded && <span className="text-sm font-medium transition-opacity duration-200">{item.label}</span>}
                    </a>
                ))}
            </nav>
        </div>
    )
}

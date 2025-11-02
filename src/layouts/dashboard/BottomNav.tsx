import React from "react"
import Link from "next/link"
import { MoreMenu } from "./MoreMenu"
import { dashboardMenu, STROKE_WIDTH } from "./dashboardMenu"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"

export function BottomNav(){
    const pathname = usePathname()
    const bottomNavItems = dashboardMenu?.platform?.filter(item => item.showInBottomNav)

    return (
        <nav className="fixed bottom-0 inset-x-0 w-full h-14 flex lg:hidden justify-around items-center border-t border-gray-100 dark:border-neutral-800 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl">
            {dashboardMenu?.feed?.map(item => {
                const isActive = item?.pathname === "/" ? pathname === "/" : pathname !== "/" && pathname?.includes(item?.pathname?.split("/")[1] ?? "")
                return (
                    <Link
                        key={item?.name}
                        href={item?.pathname || "/"}
                        className={`flex flex-col items-center justify-center ${isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}
                    >
                        {isActive ? <item.activeIcon strokeWidth={STROKE_WIDTH} /> : <HugeiconsIcon icon={item.icon} strokeWidth={2.2} />}
                        <span className="text-[0.625rem] font-medium">
                            {item.name}
                        </span>
                    </Link>
                )
            })}

            {bottomNavItems.map(item => {
                const isActive = pathname !== "/" && pathname?.includes(item?.pathname?.split("/")[1] ?? "")
                return (
                    <Link
                        key={item?.name}
                        href={item?.pathname || "/"}
                        className={`flex flex-col items-center justify-center ${isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}
                    >
                        {isActive ? <item.activeIcon strokeWidth={STROKE_WIDTH} /> : <HugeiconsIcon icon={item.icon} strokeWidth={2.2} />}
                        <span className="text-[0.625rem] font-medium">
                            {item.name}
                        </span>
                    </Link>
                )
            })}

            <MoreMenu />
            {/* <UserMenu /> */}
        </nav>
    )
}

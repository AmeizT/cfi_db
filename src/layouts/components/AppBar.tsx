import React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { homeMenu } from "../home/menu"
import { AccountMenu } from "./AccountMenu"
import { ArrowUpRight } from "lucide-react"
import { User } from "@/features/auth/types/user"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IoCaretForward } from "react-icons/io5"

interface AppBarProps {
    isAuthenticated: boolean | undefined
    user?: User
}

export function AppBar({ isAuthenticated, user }: AppBarProps){    
    return (
        <header className="px-4 lg:px-20 w-full h-14 fixed top-0 z-50 flex justify-between items-center dark:border-b dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.06)] dark:shadow-none">
            <div className="w-[140px] h-[36px] relative">
                <Image
                    src="/images/logos/cfi-logo.svg"
                    fill
                    alt="CFI Logo"
                    className=""
                    sizes="(max-width: 120px) 100vw, 120px"
                    priority
                    quality={100}
                    style={{ objectFit: "contain" }}
                />
            </div>

            <nav className="w-full lg:w-fit">
                <ul className="grow flex gap-x-0">
                    {homeMenu.main.map((item) => (
                        <li
                        key={item.name}
                        className={cn("hidden lg:block")}>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                        href={item.pathname || "#"}
                                        target={item.pathname?.includes("http") ? "_blank" : undefined}
                                        rel={item.pathname?.includes("http") ? "noopener noreferrer" : undefined}
                                        className="px-3 py-1.5 flex items-center gap-x-0.5 text-[13px] text-zinc-500 dark:text-body-muted font-medium hover:text-charcoal-700 dark:hover:text-white hover:bg-gradient-to-b from-zinc-100 to-zinc-100 dark:from-charcoal-700 dark:to-charcoal-800 rounded-md transition-colors">
                                            <span className="flex items-center gap-x-0.5">
                                                {item.name}
                                                {item.pathname?.includes("http") && (
                                                    <sup className="p-[1px] rounded-[3px] bg-zinc-200 dark:bg-charcoal-600">
                                                        <ArrowUpRight className="size-2.5 text-body-muted" strokeWidth={2.25} />
                                                    </sup>
                                                )}
                                            </span>
                                        </Link>
                                    </TooltipTrigger>
                                    {item.pathname?.includes("http") && (
                                        <TooltipContent>
                                            <p>Open an external link</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="flex items-center gap-x-4">
                <Link
                href={isAuthenticated ? "/dashboard" : "/en/auth/login?stage=verification"}
                className="group px-4 w-fit h-9 flex items-center gap-x-2 rounded-[10px] bg-theme-gradient-br text-theme-foreground text-sm font-medium transition-colors duration-300">
                    {isAuthenticated ? "Dashboard" : "Sign in"} <span className="text-[0.375rem] text-white/70 group-hover:text-white transition-colors duration-200">
                        <IoCaretForward className="size-2.5" />
                    </span>
                </Link>

                {user ? (
                    <React.Fragment>
                        <Separator
                            orientation="vertical"
                            className="data-[orientation=vertical]:h-4 bg-zinc-200 dark:bg-neutral-700"
                        />

                        <AccountMenu user={user} />
                    </React.Fragment>
                ) : null}
            </div>
        </header>
    )
}

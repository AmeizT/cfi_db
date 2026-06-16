import React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight } from "lucide-react"
import { UrlObject } from "url"

interface MenuItem {
    label: string
    path: string
    external?: boolean
}

const authMenus: MenuItem[] = [
    { label: "Blog", path: "/blog" },
    { label: "Terms", path: "/tos" },
    { label: "What's New", path: "/" },
    { label: "Help", path: "/" },
    { label: "CBA", path: "https://cba.cfi.church", external: true },
]

export function AuthFooter() {
    return (
        <footer className="py-6 fixed inset-x-0 bottom-0 flex justify-center border-t-0 border-zinc-200 dark:border-neutral-800 bg-inherit">
            <div className="px-6 lg:px-0 w-full lg:w-3/4 flex justify-center items-center">
                <nav aria-label="Home Menu">
                    <ul className="flex flex-wrap justify-center items-center gap-3 text-xs text-body-muted">
                        {authMenus.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <li className="flex items-center">
                                    <Link
                                        href={item.path as unknown as UrlObject}
                                        target={item.external ? "_blank" : "_self"}
                                        rel={item.external ? "noopener noreferrer" : undefined}
                                        className="transition-colors duration-100 dark:hover:text-white"
                                    >

                                        <span className="flex items-center gap-x-0.5">
                                            {item.label}
                                            {item.external && (
                                                <sup className="p-px rounded-[3px] bg-zinc-200 dark:bg-neutral-700">
                                                    <ArrowUpRight className="size-2.5 text-body-muted" strokeWidth={2.25} />
                                                </sup>
                                            )}
                                        </span>
                                    </Link>
                                </li>

                                {index < authMenus.length - 0 && (
                                    <li>
                                        <Separator
                                            orientation="vertical"
                                            className="data-[orientation=vertical]:h-2.5 mx-0 bg-zinc-200 dark:bg-neutral-700"
                                        />
                                    </li>
                                )}
                            </React.Fragment>
                        ))}

                        <small aria-label="Copyright" className="text-xs text-body-muted text-center">
                            Copyright &copy; {format(new Date(), "yyyy")} CFI Workspace
                        </small>
                    </ul>
                </nav>
            </div>
        </footer>
    )
}
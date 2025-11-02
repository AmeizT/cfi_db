import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Menu, MessageSquareText } from "lucide-react"
import { DocsAppSidebar } from "./components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

interface DocsLayoutProps {
    accessToken: string | undefined
    children: Readonly<React.ReactNode>
}

export default function DocsLayout({ accessToken, children }: DocsLayoutProps) {
    return (
        <SidebarProvider 
        style={{
            "--sidebar-width": "17.5rem",
            "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties}>
            <DocsAppSidebar />
            <header className="px-8 h-14 fixed z-50 inset-0 flex items-center justify-between p-4 bg-white dark:bg-charcoal-950/70 backdrop-blur-2xl dark:border-b border-charcoal-700 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.06)]">
                <Menu className="text-body-muted" />

                <form action="#" className="w-1/4">
                    <input
                        spellCheck="false"
                        type="search"
                        placeholder="Search documentation..."
                        className="w-full py-2 px-3 text-sm border dark:border-charcoal-600 rounded-md bg-zinc-100 dark:bg-charcoal-800 font-medium placeholder:text-body-muted focus:bg-inherit focus:outline-none focus:border-[1.5px] focus:border-primary focus:ring-3 focus:ring-primary/20 focus:ring-opacity-50 transition-all duration-150 dark:shadow-md dark:shadow-black/5 dark:drop-shadow-[0_-1px_1px_rgba(255,255,255,0.06)]"
                    />
                </form>

                <div className="flex items-center gap-x-4">
                    <Link
                        href={{
                            pathname: accessToken ? "/dashboard" : "/auth/login"
                        }}
                        className="group px-3.5 py-1.5 flex items-center gap-x-2 rounded-md bg-gradient-to-br from-charcoal-950 to-charcoal-600 hover:bg-gradient-to-b dark:from-blue-500 dark:to-blue-700 text-white text-sm font-medium shadow-xl transition-colors duration-300">
                        {accessToken ? "Dashboard" : "Login"} <span className="text-[0.375rem] text-white/50 group-hover:text-white transition-colors duration-200">&#9654;</span>
                    </Link>

                    <div className="h-4">
                        <Separator orientation="vertical" className="bg-[#999] dark:bg-charcoal-500" />
                    </div>

                    <button>
                        <MessageSquareText className="size-5 text-body-muted" />
                    </button>
                </div>
            </header>

            <main className="w-full pt-20 lg:pt-28">
                {children}
            </main>
        </SidebarProvider>
    )
}

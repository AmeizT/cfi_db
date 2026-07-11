"use client"

import React from "react"
import "@/styles/globals.css"
import LocalFont from "next/font/local"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/providers/theme.provider"

const inter = LocalFont({
    src: '../../../public/fonts/InterVariable.woff2',
    variable: "--inter-variable",
    declarations: [{ prop: "font-feature-settings", 
        value: "'ss01' 1, 'ss07' 1, 'ss08' 1, 'cv01', 'cv09',", 
    }],
    display: "swap",
})

interface LayoutProps {
    children: Readonly<React.ReactNode>
    accessToken?: string | undefined
    locale?: string
    overflowY?: boolean
}

export default function RootLayout(props: LayoutProps) {
    return (
        <html lang={props.locale || "en"} dir="ltr" suppressHydrationWarning={true}>
            <body className={`font-sans ${inter.variable} ${GeistSans.variable} ${GeistMono.variable} dark:bg-neutral-900 ${props.overflowY ? "overflow-y-auto" : "overflow-y-hidden"}`}>
                <div className="w-full h-dvh">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {props.children}

                        <Toaster
                            position="bottom-center"
                        />
                    </ThemeProvider>
                </div>
            </body>
        </html>
    )
}

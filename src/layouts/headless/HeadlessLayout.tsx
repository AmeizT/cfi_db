import React from "react"

export function HeadlessLayout({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <React.Fragment>
            <main>
                {children}
            </main>
        </React.Fragment>
    )
}
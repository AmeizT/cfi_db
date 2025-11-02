import React from "react"
import { SWRConfig } from "swr"

export function SWRProvider({ children }: { children: Readonly<React.ReactNode> }) {
    return (
        <SWRConfig>
            {children}
        </SWRConfig>
    )
}
import React from "react"
import { cn } from "@/lib/utils"

// interface GradientHeaderTextProps extends React.AllHTMLAttributes<HTMLHeadingElement>()

// interface HeaderTextProps {
//     children: Readonly<React.ReactNode>
// }

export function GradientHeaderText({ children }: HeaderTextProps){
    return (
        <h1 className={cn(`text-2xl tracking-tight font-semibold bg-linear-to-r from-[#4285f4] to-[#d96570] bg-clip-text text-transparent`)}>
            {children}
        </h1>
    )
}

type HeaderTextProps = React.PropsWithChildren<{
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}> & React.HTMLAttributes<HTMLHeadingElement>

export function HeaderText({ as: Tag = "h1", className, children, ...rest }: HeaderTextProps) {
    return (
        <Tag {...rest} className={cn("text-2xl text-left text-body-muted font-semibold tracking-tight", className)}>
            {children}
        </Tag>
    )
}
import React from "react"
import { Flex } from "./box"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { Separator } from "./separator"
import { ReportNavigator } from "@/features/reports/statements/components/ReportNavigator"


type AsProp<T extends React.ElementType> = {
    as?: T
}

interface TabItem {
    label: string
    href: string
    key: string
}

type PropsToOmit<T extends React.ElementType, P> = keyof (AsProp<T> & P)

type PolymorphicComponentProps<
    T extends React.ElementType,
    Props = object
> = React.PropsWithChildren<Props & AsProp<T>> &
    Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>

type ViewBaseProps = {
    className?: string;
}

type ViewHeaderProps = React.ComponentPropsWithoutRef<"header"> & {
    tabs?: TabItem[]
    pagename?: React.ReactNode
    description?: React.ReactNode
    actions?: React.ReactNode
    pathname?: string
    activeTab?: string
}

type ViewComponent = <T extends React.ElementType = "div">(
    props: PolymorphicComponentProps<T, ViewBaseProps>
) => React.JSX.Element | null;

type ViewCompound = {
    Header: ((props: ViewHeaderProps) => React.JSX.Element) & { displayName?: string }
    TabBar: ((props: {
        items: TabItem[]
        activeKey?: string
        className?: string
        variant?: "default" | "report"
        showReportNavigator?: boolean
    }) => React.JSX.Element | null) & { displayName?: string }
    Body: ((props: React.ComponentPropsWithoutRef<"div">) => React.JSX.Element) & { displayName?: string }
    Footer: ((props: React.ComponentPropsWithoutRef<"footer">) => React.JSX.Element) & { displayName?: string }
}

type ViewType = ViewComponent & ViewCompound;


const View = (<T extends React.ElementType = "div">({
    as,
    children,
    ...props
}: PolymorphicComponentProps<T, ViewBaseProps>) => {
    const Component = as || "div"

    return (
        <Component 
            {...props} 
            className={cn("mb-6 h-full flex flex-col gap-0", props.className)}
        >        
            {children}
        </Component>
    )
}) as ViewType


View.Header = ({ tabs, pathname, pagename, description, actions, activeTab, ...props }) => {
    return (
        <header {...props} className={cn("py-4 h-fit flex flex-col shrink-0 relative bg-inherit overflow-hidden", props.className)}>
            <div className="lg:px-6 w-full h-fit flex items-center gap-4">
                <div className="flex flex-col">
                    <div className="text-2xl lg:text-[28px] font-bold tracking-tight text-foreground capitalize">
                        {pagename}
                    </div>

                    {description ? (
                        <div className="w-full">
                            <p className="text-lg text-balance text-muted-foreground mt-1.5">
                                {description}
                            </p>
                        </div>
                    ) : null}
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                    {actions}
                </div>
            </div>

            {tabs ? (
                <div className="mt-18 lg:mt-2 flex w-full h-fit items-center transition-[width,height] ease-linear">
                    <div className="flex flex-col w-full gap-4 px-2 lg:px-0 lg:gap-0">
                        <div className="lg:px-2">
                            <div className={cn("h-8 lg:h-7 flex items-center space-x-2",
                                "lg:space-x-1 overflow-y-hidden overflow-x-auto lg:overflow-y-visible lg:overflow-x-visible no-scrollbar",
                                
                            )}>
                                {tabs.map((tab) => {
                                    const isActiveTab = (() => {
                                        if (!tab) return false

                                        const isQueryMatch = activeTab && tab.key === activeTab

                                        if (isQueryMatch) return true

                                        if (!activeTab && tab.href && pathname) {
                                            const tabPath = new URL(tab.href, "http://localhost").pathname
                                            const currentPath = new URL(pathname, "http://localhost").pathname

                                            return tabPath === currentPath
                                        }

                                        return false
                                    })()

                                    return (
                                        <Link
                                            key={tab.label}
                                            href={tab?.href || "#"}
                                            className={`px-4 lg:px-2 h-full inline-flex justify-center items-center relative z-0 text-sm font-semibold whitespace-nowrap rounded-full lg:rounded-lg ${isActiveTab ? "text-primary-foreground lg:text-primary lg:hover:bg-primary/5" : "text-foreground hover:bg-accent"}`}
                                        >
                                            {tab?.label}

                                            {isActiveTab ? (
                                                <motion.span
                                                    id="active-pill"
                                                    layoutId="active-pill"
                                                    className={`w-full lg:w-[calc(100%-1rem)] h-full lg:h-0.5 absolute inset-x-0 lg:left-2 lg:bottom-[-5.5px] -z-10 rounded-full ${isActiveTab ? "block bg-primary" : "hidden"} transition-discrete`}
                                                />
                                            ) : null}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="lg:px-6">{props.children}</div>
        </header>
    )
}

View.TabBar = ({ items, activeKey, className, variant, showReportNavigator = true }) => {
    if (!items?.length) return null

    return (
        <div className={cn("w-full flex shrink-0 text-foreground", className)}>
            <div className="flex flex-col w-full gap-4 lg:gap-0">
                <div
                    className={cn(
                        "px-4 h-8 lg:h-7 flex items-center gap-x-1",
                        "lg:space-x-0 overflow-y-hidden overflow-x-auto lg:overflow-y-visible lg:overflow-x-visible no-scrollbar"
                    )}
                >
                    {items.map((tab) => {
                        const isActiveTab = tab.key === activeKey

                        return (
                            <Link
                                key={tab.key}
                                href={tab.href}
                                className={`px-4 lg:px-2 h-full inline-flex justify-center items-center relative z-0 text-sm font-semibold whitespace-nowrap rounded-full lg:rounded-lg ${isActiveTab ? "text-primary-foreground lg:text-primary lg:hover:bg-primary/5" : "text-foreground hover:bg-accent"}`}
                            >
                                {tab.label}

                                {isActiveTab ? (
                                    <motion.span
                                        id="active-pill"
                                        layoutId="active-pill"
                                        className="w-full lg:w-[calc(100%-1rem)] h-full lg:h-0.5 absolute lg:left-2 lg:bottom-[-5.5px] -z-10 rounded-full block bg-primary transition-discrete"
                                    />
                                ) : null}
                            </Link>
                        )
                    })}
                </div>

                <div data-id="separator" className="px-6 mt-1 hidden lg:flex">
                    <Separator className="w-full bg-border-subtle" />
                </div>

                {variant === "report" && showReportNavigator ? (
                    <Flex direction="column" align="center" className="px-6 py-2 w-full">
                        <ReportNavigator />
                        <Separator className="mt-2 w-full bg-border-subtle" />
                    </Flex>
                ) : null}
            </div>
        </div>
    )
}

View.Body = ({ children, ...props }) => {
    return (
        <div {...props} className={cn("px-6 min-h-0 flex-1 flex flex-col", props.className)}>
            {children}
        </div>
    )
}

View.Footer = ({ children, ...props }) => {
    return <footer {...props}>{children}</footer>
}

View.Header.displayName = "View.Header"
View.TabBar.displayName = "View.TabBar"
View.Body.displayName = "View.Body"
View.Footer.displayName = "View.Footer"

export default View

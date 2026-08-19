import React from "react"
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

type ViewTabsProps = {
    items: TabItem[]
    activeKey?: string
    className?: string
    pathname?: string
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
    pagename?: React.ReactNode
    actions?: React.ReactNode
    showReportNavigator?: boolean
}

type ViewComponent = <T extends React.ElementType = "div">(
    props: PolymorphicComponentProps<T, ViewBaseProps>
) => React.JSX.Element | null;

type ViewCompound = {
    Header: ((props: ViewHeaderProps) => React.JSX.Element) & { displayName?: string }
    TabBar: ((props: ViewTabsProps) => React.JSX.Element | null) & { displayName?: string }
    Tabs: ((props: ViewTabsProps) => React.JSX.Element | null) & { displayName?: string }
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


View.Header = ({ pagename, actions, showReportNavigator = false, ...props }) => {
    return (
        <header {...props} className={cn("py-4 h-fit flex flex-col shrink-0 relative bg-inherit overflow-hidden", props.className)}>
            <div className="lg:px-6 flex h-fit w-full flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="min-w-0 text-2xl font-bold tracking-tight text-foreground capitalize lg:text-[24px]">
                    {pagename}
                </div>
                
                {showReportNavigator || actions ? (
                    <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto sm:flex-nowrap">
                        {showReportNavigator ? <ReportNavigator /> : null}
                        {actions}
                    </div>
                ) : null}
            </div>

            {props.children ? <div className="lg:px-6">{props.children}</div> : null}
        </header>
    )
}

function ViewTabs({ items, activeKey, className, pathname }: ViewTabsProps) {
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
                        const isActiveTab = tab.key === activeKey || Boolean(
                            !activeKey
                            && pathname
                            && new URL(tab.href, "http://localhost").pathname
                                === new URL(pathname, "http://localhost").pathname,
                        )

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
            </div>
        </div>
    )
}

View.TabBar = ViewTabs
View.Tabs = ViewTabs

View.Body = ({ children, ...props }) => {
    return (
        <div {...props} className={cn("px-6 flex flex-col", props.className)}>
            {children}
        </div>
    )
}

View.Footer = ({ children, ...props }) => {
    return <footer {...props}>{children}</footer>
}

View.Header.displayName = "View.Header"
View.TabBar.displayName = "View.TabBar"
View.Tabs.displayName = "View.Tabs"
View.Body.displayName = "View.Body"
View.Footer.displayName = "View.Footer"

export default View

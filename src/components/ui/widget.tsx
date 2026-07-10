import {
  ComponentPropsWithoutRef,
  HTMLAttributes,
} from "react"

import { cn } from "@/utils/cn"

function Root({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn(
        "w-full rounded-xl border-0 bg-card text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

function Header({
  className,
  ...props
}: ComponentPropsWithoutRef<"header">) {
  return (
    <header
      className={cn(
        "flex flex-col gap-1 border-b p-4",
        className
      )}
      {...props}
    />
  )
}

function Title({
  className,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn(
        "font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function Description({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function Content({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("p-1", className)}
      {...props}
    />
  )
}

function Footer({
  className,
  ...props
}: ComponentPropsWithoutRef<"footer">) {
  return (
    <footer
      className={cn(
        "border-t p-4 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function Legend({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 border-t px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

interface LegendItemProps
  extends HTMLAttributes<HTMLDivElement> {
  label: string
  indicator?: React.ReactNode
}

function LegendItem({
  label,
  indicator,
  className,
  ...props
}: LegendItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        className
      )}
      {...props}
    >
      {indicator ?? (
        <span className="size-3 rounded-full bg-current" />
      )}
      <span>{label}</span>
    </div>
  )
}

export const Widget = Object.assign(Root, {
  Header,
  Title,
  Description,
  Content,
  Footer,
  Legend,
  LegendItem,
})

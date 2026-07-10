import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const ref = React.useRef<HTMLTableElement>(null)
  return (
    <div
      data-slot="table-container"
      className="relative w-full"
    >
      <table
        ref={ref}
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b border-border-subtle", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group border-b-0 border-border-subtle transition-colors",
        "hover:bg-surface dark:hover:bg-surface/40",
        // "hover:border-y hover:border-border-subtle",
        // "first:hover:border-y-0 first:hover:border-b first:hover:border-border-subtle",
        // "last:hover:border-y-0 last:hover:border-t last:hover:border-border-subtle",
        "data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-[14px] h-9 px-2.5 text-left align-middle font-semibold whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5 slashed-zero",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 h-9 text-sm align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

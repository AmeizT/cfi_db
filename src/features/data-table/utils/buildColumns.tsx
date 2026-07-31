import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/features/auth/schemas/user"
import { formatCurrency } from "@/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { oklchLinearGradient } from "@/layouts/utils/get-oklch-gradient"
import { getTextColor } from "@/layouts/utils/get-text-color"
import { Badge } from "@/components/ui/badge"
import { MasksBoldDuotoneIcon } from "@solar-icons/react";
import { cn } from "@/utils/cn";

type RowFlags = {
    is_section?: boolean
    is_total?: boolean
    tone?: "income" | "expense" | "neutral"
}

type CurrencyRow = {
    currency?: unknown
    country_currency?: unknown
    primary_currency?: unknown
}

type Formatter = "text" | "currency" | "date" | "avatar" | "percentage" | "numeric" | "number"

export type ColumnMeta<T> = {
    id: keyof T
    label?: string
    formatter?: Formatter
    isNumeric?: boolean
    width?: number
    sortable?: boolean
    editable?: boolean
    pinned?: "left" | "right"
    className?: string
    cellClassName?: string
    render?: (value: unknown, row: T) => React.ReactNode
    meta?: {
        avatarField?: keyof T
        avatarFallback?: keyof T
        rowAction?: boolean
        onRowClick?: (row: T) => void
        indent?: boolean
        disableEditForSection?: boolean
        badge?:
            | boolean
            | {
                  variant?: string
                  className?: string
                  bgColor?: string
                  textColor?: string
              }
        trend?:
            | boolean
            | {
                  positiveClassName?: string
                  negativeClassName?: string
                  neutralClassName?: string
              }
        font?: "normal" | "mono"
        weight?: "normal" | "medium" | "semibold" | "bold"
        descriptionField?: keyof T
        align?: "left" | "center" | "right"
    }
}

function formatHeader(key: string) {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getWeightClass(weight?: "normal" | "medium" | "semibold" | "bold") {
    switch (weight) {
        case "medium":
            return "font-medium"
        case "semibold":
            return "font-semibold"
        case "bold":
            return "font-bold"
        default:
            return "font-normal"
    }
}

function getFontClass(font?: "normal" | "mono") {
    return font === "mono" ? "font-mono" : ""
}

function getAlignClass(align?: "left" | "center" | "right") {
    switch (align) {
        case "center":
            return "text-center"
        case "right":
            return "text-right"
        default:
            return "text-left"
    }
}

function getStringValue(value: unknown) {
    return typeof value === "string" && value.trim() ? value : undefined
}

function resolveCurrency(row: Record<string, unknown>, user?: User) {
    const currencyRow = row as CurrencyRow
    const regionalCurrency =
        getStringValue(currencyRow.currency) ??
        getStringValue(currencyRow.country_currency)
    const assemblyCurrency =
        getStringValue(user?.assembly?.primary_currency) ??
        getStringValue(currencyRow.primary_currency)

    return user?.is_region_staff
        ? regionalCurrency ?? assemblyCurrency ?? "USD"
        : assemblyCurrency ?? "USD"
}

function renderBadge(
    value: unknown,
    badge:
        | boolean
        | {
              variant?: string
              className?: string
              bgColor?: string
              textColor?: string
          }
) {
    if (!badge) return null

    if (badge === true) {
        return <Badge>{String(value)}</Badge>
    }

    return (
        <Badge
            className={badge.className}
            style={{
                backgroundColor: badge.bgColor,
                color: badge.textColor,
            }}
        >
            {String(value)}
        </Badge>
    )
}

function renderTrend(
    value: unknown,
    displayValue: string,
    trend:
        | boolean
        | {
              positiveClassName?: string
              negativeClassName?: string
              neutralClassName?: string
          }
) {
    if (!trend) return null

    const numericValue = Number(value)

    const icon =
        numericValue < 0
            ? <span className="inline-block text-[10px]">▼</span>
            : numericValue > 0
            ? <span className="text-xs!">▲</span>
            : <span className="text-muted-foreground/40">●</span>

    const className =
        typeof trend === "object"
            ? numericValue < 0
                ? trend.negativeClassName ?? "bg-red-100 text-red-600"
                : numericValue > 0
                ? trend.positiveClassName ?? "bg-green-100 text-green-600"
                : trend.neutralClassName ?? "bg-muted text-muted-foreground"
            : numericValue < 0
            ? "bg-red-100 text-red-600"
            : numericValue > 0
            ? "bg-green-100 text-green-600"
            : "bg-muted text-muted-foreground"

    return (
        <Badge className={className}>
            {icon} {displayValue}
        </Badge>
    )
}

export function buildColumns<T extends Record<string, unknown>>(
    config: ColumnMeta<T>[],
    user?: User,
    onRowClick?: (row: T) => void
): ColumnDef<T>[] {

    function formatValue(value: unknown, formatter: Formatter | undefined, row: T) {
        if (value == null) return "-"

        if (formatter === "currency") {
            const num = Number(value)
            return formatCurrency(num, {
                language: user?.assembly?.locale,
                currency: resolveCurrency(row, user),
                currencyDisplay: "narrowSymbol"
            })
        }

        if (formatter === "date") {
            return format(value as string, "MMM dd, yyyy")
        }

        const percentageFormatter = new Intl.NumberFormat(undefined, {
            style: "percent",
            maximumFractionDigits: 0,
        })

        if (formatter === "percentage") {
            return percentageFormatter.format(Number(value))
        }

        return String(value)
    }

    const getDefaultSize = (col: ColumnMeta<T>) => {
        if (col.width) return col.width

        switch (col.formatter) {
            case "avatar":
                return 260
            case "currency":
                return 140
            case "date":
                return 140
            default:
                return 140
        }
    }

    const isFlexible = (col: ColumnMeta<T>) =>
        col.formatter === "text" || col.id === "notes"

    return config.map((col) => {
        const isNumeric = col.isNumeric ?? (
            col.formatter === "currency" ||
            col.formatter === "numeric" ||
            col.formatter === "number" ||
            col.formatter === "percentage"
        )
        const align = col.meta?.align ?? (isNumeric ? "right" : undefined)

        return ({
            accessorKey: String(col.id),
            header: () => col.label ?? formatHeader(String(col.id)),
            size: getDefaultSize(col),
            minSize: isFlexible(col) ? 120 : 60,
            maxSize: isFlexible(col) ? 1000 : 400,
            meta: {
                editable: col.editable ?? false,
                isNumeric,
                disableEditForRow: (row: T) => {
                    const r = row as unknown as RowFlags
                    if (r.is_section && col.meta?.disableEditForSection) return true
                    if (r.is_total) return true
                    return false
                },
                avatarField: col.meta?.avatarField,
                avatarFallback: col.meta?.avatarFallback,
                badge: col.meta?.badge,
                trend: col.meta?.trend,
                font: col.meta?.font,
                weight: col.meta?.weight,
                descriptionField: col.meta?.descriptionField,
                align,
            },

            cell: ({ row }) => {
            const flags = row.original as unknown as RowFlags
            const isSection = !!flags.is_section
            const isTotal = !!flags.is_total
            const toneClass =
                flags.tone === "income"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : flags.tone === "expense"
                    ? "text-red-700 dark:text-red-400"
                    : ""

            const value = row.original[col.id]

            if (isSection && col.id === "label") {
                return (
                    <div className={`font-bold text-sm py-2 ${toneClass}`}>
                        {String(value)}
                    </div>
                )
            }

            if (isSection) {
                return null
            }

            if (col.id === "notes") {
                return null
            }

            if (col.render) {
                return col.render(value, row.original)
            }

            if (col.meta?.badge) {
                return renderBadge(value, col.meta.badge)
            }

            if (col.formatter === "avatar") {
                const avatarField = col.meta?.avatarField
                const fallbackField = col.meta?.avatarFallback

                const avatar = getStringValue(
                    avatarField ? row.original[avatarField] : undefined
                )

                const fallbackColor = getStringValue(
                    fallbackField ? row.original[fallbackField] : undefined
                )

                const name = getStringValue(value)
                const isAnonymous = !name

                const displayName = isAnonymous
                    ? "Private / Unidentified"
                    : name

                const placeholderColor =
                    "oklch(0.65 0.2 174.88864402807843)"

                const resolvedFallbackColor =
                    fallbackColor ?? placeholderColor

                return (
                    <div className="group flex w-full min-w-0 items-center gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="size-7 shrink-0 rounded-[33%] text-sm">
                                {avatar ? (
                                    <AvatarImage
                                        src={avatar}
                                        alt={displayName}
                                    />
                                ) : null}

                                <AvatarFallback
                                    className="rounded-none text-sm"
                                    style={
                                        isAnonymous
                                            ? {
                                                background:
                                                    "var(--color-indigo-100)",
                                                color:
                                                    "var(--color-indigo-600)",
                                            }
                                            : {
                                                background:
                                                    oklchLinearGradient(
                                                        resolvedFallbackColor
                                                    ),
                                                color: getTextColor(
                                                    resolvedFallbackColor
                                                ),
                                            }
                                    }
                                >
                                    {isAnonymous ? (
                                        <MasksBoldDuotoneIcon size={20} />
                                    ) : (
                                        name.charAt(0).toUpperCase()
                                    )}
                                </AvatarFallback>
                            </Avatar>

                            <span className={cn(
                                "truncate",
                                isAnonymous ? "text-indigo-600" : ""
                            )}>
                                {displayName}
                            </span>
                        </div>

                        {col.meta?.rowAction && onRowClick ? (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    onRowClick(row.original)
                                }}
                                className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                            >
                                ...
                            </button>
                        ) : null}
                    </div>
                )
            }

            const displayValue = formatValue(value, col.formatter, row.original)
            if (col.meta?.trend) {
                return renderTrend(
                    value,
                    String(displayValue),
                    col.meta.trend
                )
            }

            const typographyClass = [
                "w-full block",
                getWeightClass(col.meta?.weight),
                getFontClass(col.meta?.font),
                getAlignClass(align),
                isNumeric ? "tabular-nums" : "",
                isTotal ? "py-2 font-semibold" : "",
                col.id === "label" ? toneClass : "",
                col.cellClassName,
            ]
                .filter(Boolean)
                .join(" ")

            return (
                <div className={typographyClass}>
                    {displayValue?.toString().trim() ? (
                        displayValue
                    ) : (
                        <span className="block h-0.5 w-6 rounded-full bg-muted"></span>
                    )}
                </div>
            )
            },
        })
    })
}

"use client"

import { Plus, Trash2 } from "lucide-react"

import type { LedgerItem } from "../types"

type LedgerSectionProps = {
    title: string
    description: string
    items: LedgerItem[]
    categories?: string[]
    hasDescription?: boolean
    totalLabel: string
    showRemittance?: boolean
    onAdd: () => void
    onUpdate: (index: number, field: keyof LedgerItem, value: string) => void
    onDelete: (index: number) => void
}

export function money(value: number) {
    return `P${value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

export function ledgerTotal(items: LedgerItem[]) {
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
}

export function LedgerSection({
    title,
    description,
    items,
    categories,
    hasDescription = false,
    totalLabel,
    showRemittance = false,
    onAdd,
    onUpdate,
    onDelete,
}: LedgerSectionProps) {
    const total = ledgerTotal(items)

    return (
        <>
            <div className="mb-[22px]">
                <h2 className="text-[22px] font-bold tracking-[-0.01em]">{title}</h2>
                <p className="mt-1 max-w-[60ch] text-sm leading-[1.5] text-muted-foreground">
                    {description}
                </p>
            </div>

            <div className="overflow-x-auto rounded-[14px] border border-border bg-card text-card-foreground">
                <table className="w-full min-w-[720px] border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted">
                            <th className="px-4 py-3 text-left text-[11.5px] font-bold uppercase tracking-[0.03em] text-muted-foreground">
                                {categories ? "Category" : "Source"}
                            </th>
                            <th className="px-4 py-3 text-left text-[11.5px] font-bold uppercase tracking-[0.03em] text-muted-foreground">
                                Description
                            </th>
                            <th className="px-4 py-3 text-right text-[11.5px] font-bold uppercase tracking-[0.03em] text-muted-foreground">
                                Amount
                            </th>
                            <th />
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item, index) => (
                            <tr
                                key={`${index}-${item.category ?? item.source ?? "item"}`}
                                className="border-b border-border last:border-b-0"
                            >
                                <td className="w-[210px] px-4 py-[11px]">
                                    {categories ? (
                                        <select
                                            value={item.category ?? categories[0]}
                                            onChange={(event) =>
                                                onUpdate(index, "category", event.target.value)
                                            }
                                            className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-[13.5px] outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/10"
                                        >
                                            {categories.map((category) => (
                                                <option key={category}>{category}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            value={item.source ?? ""}
                                            onChange={(event) =>
                                                onUpdate(index, "source", event.target.value)
                                            }
                                            placeholder="Source"
                                            className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-[13.5px] outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/10"
                                        />
                                    )}
                                </td>

                                <td className="px-4 py-[11px]">
                                    {hasDescription ? (
                                        <input
                                            value={item.desc ?? ""}
                                            onChange={(event) =>
                                                onUpdate(index, "desc", event.target.value)
                                            }
                                            placeholder="Description (optional)"
                                            className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-[13.5px] outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/10"
                                        />
                                    ) : null}
                                </td>

                                <td className="w-40 px-4 py-[11px]">
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={item.amount}
                                        onChange={(event) =>
                                            onUpdate(index, "amount", event.target.value)
                                        }
                                        placeholder="0.00"
                                        className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-right text-[13.5px] outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/10"
                                    />
                                </td>

                                <td className="w-11 px-2 py-[11px]">
                                    <button
                                        type="button"
                                        onClick={() => onDelete(index)}
                                        className="grid size-[30px] place-items-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                                        aria-label={`Delete ${title} row ${index + 1}`}
                                    >
                                        <Trash2 className="size-[15px]" strokeWidth={1.75} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button
                    type="button"
                    onClick={onAdd}
                    className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-[13.5px] font-semibold text-primary transition hover:bg-primary/10"
                >
                    <Plus className="size-[15px]" strokeWidth={2} />
                    Add line item
                </button>
            </div>

            <div className="mt-4 flex flex-col gap-3.5 sm:flex-row">
                <div className="flex-1 rounded-[10px] border border-primary bg-primary px-4 py-3.5 text-primary-foreground">
                    <div className="text-xs text-primary-foreground/65">{totalLabel}</div>
                    <div className="mt-1 text-[19px] font-bold tracking-[-0.01em]">{money(total)}</div>
                </div>

                {showRemittance && (
                    <div className="flex-1 rounded-[10px] border border-border bg-card px-4 py-3.5 text-card-foreground">
                        <div className="text-xs text-muted-foreground">Remittance owed</div>
                        <div className="mt-1 text-[19px] font-bold tracking-[-0.01em]">
                            {money(total * 0.1)}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                            10% of tithes · obligation, not a confirmed payment
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

"use client"

import * as React from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/hooks/query/use-user"
import { formatCurrency } from "@/utils/currency"

import { MultiEntryForm } from "./MultiEntryForm"
import {
    BatchRequestError,
    type BatchKind,
    useBatchEntry,
    useCreateFinancialOption,
    useFinancialEntryOptions,
} from "../hooks/use-batch-entry"
import {
    calculateEntryTotal,
    findDuplicateEntryIndices,
} from "../lib/manual-entry-utils"
import { FileText, Plus, UploadCloud, X } from "lucide-react";
import { AddCircleIcon } from '@solar-icons/react/bold-duotone/add-circle'
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { InfoSquareIcon } from '@solar-icons/react/bold-duotone/info-square'
import { cn } from "@/lib/utils";
import { LightbulbMinimalisticIcon } from '@solar-icons/react/bold-duotone/lightbulb-minimalistic'
import { CloudsIllustration } from "@/assets/icons/illustrations";

type EntryRow = {
    member: string
    category: string
    overhead_type: string
    name: string
    expense_category: string
    amount: string
    price: string
    quantity: string
    payment_method: string
    reference_code: string
    notes: string
    timestamp: string
    supplier: string
    invoice_number: string
    file: File | null
}

type FormValues = {
    entries: EntryRow[]
}

const PAYMENT_METHODS = ["Bank", "Cash", "Cheque", "Mobile Money", "Other"]

const EXPENSE_CATEGORIES = [
    "amenities",
    "conference",
    "decor",
    "fellowship",
    "hotel bookings",
    "humanitarian",
    "office",
    "other",
    "outreach",
    "repair",
    "travel",
    "wages",
]

function emptyRow(date: string): EntryRow {
    return {
        member: "",
        category: "",
        overhead_type: "",
        name: "",
        expense_category: "",
        amount: "",
        price: "",
        quantity: "1",
        payment_method: "Cash",
        reference_code: "",
        notes: "",
        timestamp: date,
        supplier: "",
        invoice_number: "",
        file: null,
    }
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="text-xs text-destructive" role="alert">
            {message}
        </p>
    ) : null
}

interface FinancialEntriesFormProps {
    kind: BatchKind
    period: string
    reportId?: string | number | null
}

export function FinancialEntriesForm({
    kind,
    period,
    reportId,
}: FinancialEntriesFormProps) {
    const user = useUser()
    const options = useFinancialEntryOptions(kind)
    const mutation = useBatchEntry(kind)
    const createOption = useCreateFinancialOption(
        kind === "overhead" ? "overhead" : "revenue"
    )

    const [newOptionName, setNewOptionName] = React.useState("")

    const defaultDate = `${period}-01`

    const form = useForm<FormValues>({
        defaultValues: {
            entries: [emptyRow(defaultDate)],
        },
    })

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "entries",
    })

    const rows = useWatch({
        control: form.control,
        name: "entries",
    })

    const currency = user.data?.assembly?.currency || "USD"
    const language = user.data?.assembly?.language || undefined
    const total = calculateEntryTotal(kind, rows)
    const totalLabel = formatCurrency(total, { currency, language })

    const validateDuplicates = React.useCallback(
        (values: FormValues) => {
            const field =
                kind === "tithes"
                    ? "member"
                    : kind === "revenue"
                      ? "category"
                      : kind === "overhead"
                        ? "overhead_type"
                        : null

            if (!field) {
                return true
            }

            const duplicates = findDuplicateEntryIndices(kind, values.entries)

            duplicates.forEach((index) => {
                form.setError(`entries.${index}.${field}`, {
                    message: "This selection is already used in another row.",
                })
            })

            return duplicates.length === 0
        },
        [form, kind]
    )

    const submit = form.handleSubmit(async (values) => {
        form.clearErrors()

        if (!validateDuplicates(values)) {
            return
        }

        const entries = values.entries.map((row) => {
            if (kind === "tithes") {
                return {
                    member:
                        row.member && row.member !== "anonymous"
                            ? Number(row.member)
                            : null,
                    amount: row.amount,
                    payment_method: row.payment_method,
                    reference_code: row.reference_code,
                    notes: row.notes,
                    timestamp: row.timestamp,
                }
            }

            if (kind === "revenue") {
                return {
                    category: Number(row.category),
                    amount: row.amount,
                    notes: row.notes,
                    timestamp: row.timestamp,
                }
            }

            if (kind === "overhead") {
                return {
                    overhead_type: Number(row.overhead_type),
                    amount: row.amount,
                    notes: row.notes,
                    timestamp: row.timestamp,
                }
            }

            return {
                name: row.name,
                category: row.expense_category,
                quantity: Number(row.quantity),
                price: row.price,
                invoice_date: row.timestamp,
                invoice_number: row.invoice_number,
                supplier: row.supplier,
                description: row.notes,
            }
        })

        const body = new FormData()

        body.set("period", period)

        if (reportId) {
            body.set("report", String(reportId))
        }

        body.set("entries", JSON.stringify(entries))

        values.entries.forEach((row, index) => {
            if (!row.file) {
                return
            }

            const fileField = kind === "revenue" ? "statement" : "receipt"
            body.set(`entries.${index}.${fileField}`, row.file)
        })

        try {
            const result = await mutation.mutateAsync(body)

            toast.success(
                `${result.count ?? values.entries.length} entries saved successfully.`
            )

            replace([emptyRow(defaultDate)])
            form.reset({
                entries: [emptyRow(defaultDate)],
            })
        } catch (error) {
            if (error instanceof BatchRequestError) {
                let firstErrorPath:
                    | `entries.${number}.${keyof EntryRow}`
                    | null = null

                Object.entries(error.body.errors?.entries ?? {}).forEach(
                    ([index, fieldErrors]) => {
                        Object.entries(fieldErrors).forEach(
                            ([field, messages]) => {
                                const key =
                                    field === "non_field_errors"
                                        ? kind === "expenses"
                                            ? "name"
                                            : "amount"
                                        : field === "invoice_date"
                                          ? "timestamp"
                                          : field === "description"
                                            ? "notes"
                                            : field === "receipt" ||
                                                field === "statement"
                                              ? "file"
                                              : kind === "expenses" &&
                                                  field === "category"
                                                ? "expense_category"
                                                : field

                                const path =
                                    `entries.${Number(index)}.${key as keyof EntryRow}` as const

                                form.setError(path, {
                                    message: Array.isArray(messages)
                                        ? messages.join(" ")
                                        : messages,
                                })

                                firstErrorPath ??= path
                            }
                        )
                    }
                )

                if (firstErrorPath) {
                    form.setFocus(firstErrorPath)
                }

                toast.error(error.message)
            } else {
                toast.error(
                    "Could not save entries. Your values have been preserved."
                )
            }
        }
    })

    const cancel = () => {
        if (
            form.formState.isDirty &&
            !window.confirm("Discard the entries you have not saved?")
        ) {
            return
        }

        replace([emptyRow(defaultDate)])
        form.reset({
            entries: [emptyRow(defaultDate)],
        })
    }

    const optionLabel = (option: Record<string, unknown>) =>
        String(option.full_name ?? option.name ?? option.id)

    const addOption = async () => {
        const name = newOptionName.trim()

        if (!name) {
            return
        }

        try {
            await createOption.mutateAsync(name)
            setNewOptionName("")

            toast.success(
                `${kind === "revenue" ? "Category" : "Overhead type"} created.`
            )
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Could not create the option."
            )
        }
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            {options.isError ? (
                <p className="text-sm text-destructive">
                    Unable to load available selections.
                </p>
            ) : null}

            {kind === "revenue" || kind === "overhead" ? (
                <div className={cn(
                    "flex h-fit w-full items-center justify-between px-1.5",
                    "rounded-xl bg-background shadow-elevation-01",
                    "border border-black/8",
                    "focus-within:border-primary",
                    "focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary/20"
                )}>
                    <div className="flex items-center">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <InfoSquareIcon className="size-8 text-primary" />
                            </HoverCardTrigger>

                            <HoverCardContent
                                sideOffset={0}
                                align="start"
                                alignOffset={-16}
                                className={cn(
                                    "flex items-start gap-3",
                                    "bg-background/45 p-1.5",
                                    "backdrop-blur-xl backdrop-saturate-150",
                                    // "supports-[corner-shape:squircle]:squircle-24",

                                    // Reflective edge
                                    "border border-white/30",
                                    "dark:border-white/10",

                                    // Depth
                                    "shadow-[0_4px_16px_rgb(0_0_0/0.08)]",
                                    "ring-1 ring-black/5"
                                )}
                            >
                                <span
                                    className={cn(
                                        "grid size-9 shrink-0 place-content-center",
                                        "rounded-lg border border-yellow-50 bg-linear-to-b from-yellow-300 to-yellow-400 text-white",
                                        
                                    )}
                                >
                                    <LightbulbMinimalisticIcon className="size-7" />
                                </span>

                                <div className="min-w-0 flex-1 text-sm text-foreground">
                                    Creates a new <strong>{kind === "revenue" ? "revenue category" : "overhead type"}</strong>&nbsp;you can reuse in this assembly&apos;s future reports.
                                </div>
                            </HoverCardContent>
                        </HoverCard>

                        <Input
                            value={newOptionName}
                            onChange={(event) =>
                                setNewOptionName(event.target.value)
                            }
                            placeholder={
                                kind === "revenue"
                                    ? "New revenue category"
                                    : "New overhead type"
                            }
                            className="border-none shadow-none focus-visible:ring-0 bg-transparent"
                        />
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={
                            !newOptionName.trim() || createOption.isPending
                        }
                        onClick={addOption}
                        className="shadow-elevation-sm"
                    >
                        <Plus className="size-4" /> {kind === "revenue" ? "Add category" : "Add type"}
                    </Button>
                </div>
            ) : null}

            <MultiEntryForm
                rows={fields}
                onAddRow={() => append(emptyRow(defaultDate))}
                onRemoveRow={remove}
                onCancel={cancel}
                totalLabel={totalLabel}
                isPending={mutation.isPending}
                renderRow={(_, index) => {
                    const errors = form.formState.errors.entries?.[index]
                    const selectedFile = rows?.[index]?.file
                    const fileInputId = `financial-entry-file-${index}`

                    return (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {kind === "tithes" ? (
                                <div className="grid gap-1.5">
                                    <Label>Member</Label>

                                    <NativeSelect
                                        {...form.register(
                                            `entries.${index}.member`
                                        )}
                                    >
                                        <NativeSelectOption value="anonymous">
                                            Anonymous
                                        </NativeSelectOption>

                                        {options.data?.map((option) => (
                                            <NativeSelectOption
                                                key={String(option.id)}
                                                value={String(option.id)}
                                            >
                                                {optionLabel(option)}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>

                                    <FieldError
                                        message={errors?.member?.message}
                                    />
                                </div>
                            ) : null}

                            {kind === "revenue" ? (
                                <div className="grid gap-1.5">
                                    <Label>Revenue category</Label>

                                    <NativeSelect
                                        {...form.register(
                                            `entries.${index}.category`,
                                            {
                                                required: "Choose a category.",
                                            }
                                        )}
                                    >
                                        <NativeSelectOption value="">
                                            Select category
                                        </NativeSelectOption>

                                        {options.data?.map((option) => (
                                            <NativeSelectOption
                                                key={String(option.id)}
                                                value={String(option.id)}
                                            >
                                                {optionLabel(option)}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>

                                    <FieldError
                                        message={errors?.category?.message}
                                    />
                                </div>
                            ) : null}

                            {kind === "overhead" ? (
                                <div className="grid gap-1.5">
                                    <Label>Overhead type</Label>

                                    <NativeSelect
                                        {...form.register(
                                            `entries.${index}.overhead_type`,
                                            {
                                                required:
                                                    "Choose an overhead type.",
                                            }
                                        )}
                                    >
                                        <NativeSelectOption value="">
                                            Select type
                                        </NativeSelectOption>

                                        {options.data?.map((option) => (
                                            <NativeSelectOption
                                                key={String(option.id)}
                                                value={String(option.id)}
                                            >
                                                {optionLabel(option)}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>

                                    <FieldError
                                        message={errors?.overhead_type?.message}
                                    />
                                </div>
                            ) : null}

                            {kind === "expenses" ? (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label>Item</Label>

                                        <Input
                                            {...form.register(
                                                `entries.${index}.name`,
                                                {
                                                    required:
                                                        "Enter an item name.",
                                                }
                                            )}
                                        />

                                        <FieldError
                                            message={errors?.name?.message}
                                        />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label>Category</Label>

                                        <NativeSelect
                                            {...form.register(
                                                `entries.${index}.expense_category`,
                                                {
                                                    required:
                                                        "Choose a category.",
                                                }
                                            )}
                                        >
                                            <NativeSelectOption value="">
                                                Select category
                                            </NativeSelectOption>

                                            {EXPENSE_CATEGORIES.map((value) => (
                                                <NativeSelectOption
                                                    key={value}
                                                    value={value}
                                                >
                                                    {value.replaceAll("_", " ")}
                                                </NativeSelectOption>
                                            ))}
                                        </NativeSelect>

                                        <FieldError
                                            message={
                                                errors?.expense_category?.message
                                            }
                                        />
                                    </div>
                                </>
                            ) : null}

                            <div className="grid gap-1.5">
                                <Label>
                                    {kind === "expenses"
                                        ? "Unit price"
                                        : "Amount"}
                                </Label>

                                <Input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    inputMode="decimal"
                                    {...form.register(
                                        `entries.${index}.${
                                            kind === "expenses"
                                                ? "price"
                                                : "amount"
                                        }`,
                                        {
                                            required:
                                                "Enter an amount greater than zero.",
                                            validate: (value) =>
                                                Number(value) > 0 ||
                                                "Enter an amount greater than zero.",
                                        }
                                    )}
                                />

                                <FieldError
                                    message={
                                        kind === "expenses"
                                            ? errors?.price?.message
                                            : errors?.amount?.message
                                    }
                                />
                            </div>

                            {kind === "expenses" ? (
                                <div className="grid gap-1.5">
                                    <Label>Quantity</Label>

                                    <Input
                                        type="number"
                                        min="1"
                                        step="1"
                                        {...form.register(
                                            `entries.${index}.quantity`,
                                            {
                                                required: true,
                                                min: {
                                                    value: 1,
                                                    message:
                                                        "Quantity must be at least one.",
                                                },
                                            }
                                        )}
                                    />

                                    <FieldError
                                        message={errors?.quantity?.message}
                                    />
                                </div>
                            ) : null}

                            {kind === "tithes" ? (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label>Payment method</Label>

                                        <NativeSelect
                                            {...form.register(
                                                `entries.${index}.payment_method`
                                            )}
                                        >
                                            {PAYMENT_METHODS.map((value) => (
                                                <NativeSelectOption
                                                    key={value}
                                                    value={value}
                                                >
                                                    {value}
                                                </NativeSelectOption>
                                            ))}
                                        </NativeSelect>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label>Reference</Label>

                                        <Input
                                            {...form.register(
                                                `entries.${index}.reference_code`
                                            )}
                                        />
                                    </div>
                                </>
                            ) : null}

                            <div className="grid gap-1.5">
                                <Label>Transaction date</Label>

                                <Input
                                    type="date"
                                    min={`${period}-01`}
                                    max={`${period}-31`}
                                    {...form.register(
                                        `entries.${index}.timestamp`,
                                        {
                                            required: "Choose a date.",
                                        }
                                    )}
                                />

                                <FieldError
                                    message={errors?.timestamp?.message}
                                />
                            </div>

                            {kind === "expenses" ? (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label>Supplier</Label>

                                        <Input
                                            {...form.register(
                                                `entries.${index}.supplier`
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label>Invoice number</Label>

                                        <Input
                                            {...form.register(
                                                `entries.${index}.invoice_number`
                                            )}
                                        />
                                    </div>
                                </>
                            ) : null}

                            {kind !== "overhead" ? (
    <div className="col-span-full grid gap-1.5">
        <Label htmlFor={fileInputId}>
            {kind === "revenue"
                ? "Bank statement"
                : kind === "expenses"
                  ? "Receipt"
                  : "Receipt (optional)"}
        </Label>

        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-dashed",
                "transition-colors duration-200",
                selectedFile
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-surface-foreground/60 hover:border-primary/70 hover:bg-surface/80"
            )}
        >
            <input
                key={selectedFile?.name ?? "empty"}
                id={fileInputId}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                    const file = event.target.files?.[0] ?? null

                    if (file && file.size > 10 * 1024 * 1024) {
                        toast.error("The selected file must be smaller than 10 MB.")
                        event.currentTarget.value = ""
                        return
                    }

                    form.setValue(
                        `entries.${index}.file`,
                        file,
                        {
                            shouldDirty: true,
                            shouldValidate: true,
                        }
                    )
                }}
            />

            {selectedFile ? (
                <div className="flex min-h-24 items-center gap-3 p-4">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <FileText className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                            {selectedFile.name}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 rounded-full"
                        aria-label="Remove selected file"
                        onClick={() =>
                            form.setValue(
                                `entries.${index}.file`,
                                null,
                                {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                }
                            )
                        }
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            ) : (
                <Label
                    htmlFor={fileInputId}
                    className="flex min-h-32 relative cursor-pointer flex-col items-center justify-center gap-2 p-5 text-center"
                >
                    <div className="grid size-11 place-items-center rounded-xl shadow-elevation-sm bg-background">
                        <UploadCloud className="size-5 text-muted-foreground" />
                    </div>

                    <div className="">
                        <p className="text-sm font-medium">
                            Choose a file to upload
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            PDF, PNG, JPG or WebP · Maximum 10 MB
                        </p>
                    </div>
                </Label>
            )}
        </div>

        <FieldError message={errors?.file?.message} />
    </div>
) : null}

                            <div className="col-span-full grid gap-1.5">
                                <Label>Notes</Label>

                                <Textarea
                                    {...form.register(
                                        `entries.${index}.notes`
                                    )}
                                />

                                <FieldError
                                    message={errors?.notes?.message}
                                />
                            </div>
                        </div>
                    )
                }}
            />
        </form>
    )
}
